import os
import sys
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

# Force UTF-8 on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ──────────────────────────────────────────────
# Load Keys
# ──────────────────────────────────────────────
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
GROQ_KEY   = os.getenv("GROQ_API_KEY")

if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

groq_client = Groq(api_key=GROQ_KEY) if GROQ_KEY else None

# ──────────────────────────────────────────────
# Model Registry
# Each entry: (provider, model_id, display_name)
# ──────────────────────────────────────────────
ALL_MODELS = [
    # ── Groq (fast, free tier) ──
    ("groq",   "llama-3.3-70b-versatile",        "Llama 3.3 70B (Groq)"),
    ("groq",   "llama-3.1-8b-instant",           "Llama 3.1 8B Instant (Groq)"),
    ("groq",   "mixtral-8x7b-32768",             "Mixtral 8x7B (Groq)"),
    ("groq",   "gemma2-9b-it",                   "Gemma 2 9B (Groq)"),
    # ── Gemini ──
    ("gemini", "gemini-2.5-pro",                 "Gemini 2.5 Pro"),
    ("gemini", "gemini-2.5-flash",               "Gemini 2.5 Flash"),
    ("gemini", "gemini-2.0-flash",               "Gemini 2.0 Flash"),
    ("gemini", "gemini-1.5-pro",                 "Gemini 1.5 Pro"),
    ("gemini", "gemini-1.5-flash",               "Gemini 1.5 Flash"),
]

SYSTEM_PROMPT = """You are MediVoice AI — an advanced, empathetic healthcare assistant built into the MediVoice platform.

Your capabilities:
- Answer patient queries about symptoms, medications, and general health
- Assist doctors with clinical summaries and treatment suggestions
- Help medical staff with scheduling, prescriptions, and patient notes
- Explain lab results in simple, non-technical language
- Provide emergency guidance and recommend when to seek care

Guidelines:
- Always be compassionate, clear, and professional
- Never diagnose definitively — always recommend seeing a licensed physician for serious concerns
- Keep responses concise unless the user asks for more detail
- For emergency symptoms (chest pain, difficulty breathing, etc.), always advise calling emergency services immediately

Platform: MediVoice hospital management system, serving patients, doctors, staff, and lab users."""


# ──────────────────────────────────────────────
# Provider Adapters
# ──────────────────────────────────────────────
def test_groq_model(model_id: str) -> bool:
    """Quick test to check if a Groq model works."""
    resp = groq_client.chat.completions.create(
        model=model_id,
        messages=[{"role": "user", "content": "Hi"}],
        max_tokens=5,
    )
    return bool(resp.choices[0].message.content)


def test_gemini_model(model_id: str):
    """Returns a GenerativeModel if it works, else raises."""
    m = genai.GenerativeModel(
        model_name=model_id,
        system_instruction=SYSTEM_PROMPT,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7, top_p=0.95, max_output_tokens=8192
        ),
    )
    test = m.generate_content("Hi", stream=False)
    _ = test.text  # raises if failed
    return m


def send_groq(model_id: str, history: list, user_input: str) -> str:
    """Send message via Groq and return full response text."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    # Replay history
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": user_input})

    resp = groq_client.chat.completions.create(
        model=model_id,
        messages=messages,
        max_tokens=8192,
        stream=True,
    )
    full = ""
    for chunk in resp:
        delta = chunk.choices[0].delta.content or ""
        print(delta, end="", flush=True)
        full += delta
    return full


def send_gemini(chat_session, user_input: str) -> str:
    """Send message via Gemini streaming and return full text."""
    full = ""
    response = chat_session.send_message(user_input, stream=True)
    for chunk in response:
        if chunk.text:
            print(chunk.text, end="", flush=True)
            full += chunk.text
    return full


# ──────────────────────────────────────────────
# Startup — find first working model
# ──────────────────────────────────────────────
def print_help():
    print("""
+--------------------------------------------------+
|  COMMANDS                                        |
|  /models          List all models               |
|  /switch <name>   Switch model by name/keyword  |
|                   e.g. /switch llama             |
|                        /switch gemini-2.5-flash  |
|  /current         Show active model             |
|  /clear           Clear chat history            |
|  exit / quit      Exit                          |
+--------------------------------------------------+
""")

print()
print("=" * 52)
print("   MediVoice AI Agent  |  Multi-Provider")
print("=" * 52)
print("   Providers: Groq + Gemini")
print("   Finding best available model...\n")

current_index      = None
active_provider    = None
active_model_id    = None
active_gemini_obj  = None   # GenerativeModel instance (Gemini only)
chat_history       = []     # Shared history [{role, content}]
gemini_chat        = None   # Gemini chat session

for i, (provider, model_id, display) in enumerate(ALL_MODELS):
    print(f"   -> Testing {display}...", end=" ", flush=True)

    if provider == "groq" and not groq_client:
        print("skipped (no GROQ_API_KEY)")
        continue
    if provider == "gemini" and not GEMINI_KEY:
        print("skipped (no GEMINI_API_KEY)")
        continue

    try:
        if provider == "groq":
            test_groq_model(model_id)
        else:
            active_gemini_obj = test_gemini_model(model_id)
            gemini_chat = active_gemini_obj.start_chat(history=[])

        current_index   = i
        active_provider = provider
        active_model_id = model_id
        print("OK")
        print(f"\n   Active: {display}\n")
        break

    except Exception as e:
        err = str(e)
        if "429" in err or "quota" in err.lower() or "rate" in err.lower():
            print("quota exceeded")
        elif "403" in err or "denied" in err.lower() or "permission" in err.lower():
            print("access denied")
        elif "model" in err.lower() and ("not found" in err.lower() or "deprecated" in err.lower()):
            print("model unavailable")
        else:
            print(f"error")

if current_index is None:
    print("All models failed. Check your API keys.\n")
    sys.exit(1)

print("Type /help for commands or start chatting!")
print("-" * 52)


# ──────────────────────────────────────────────
# Chat Loop
# ──────────────────────────────────────────────
def switch_to(index: int):
    global current_index, active_provider, active_model_id
    global active_gemini_obj, gemini_chat, chat_history

    provider, model_id, display = ALL_MODELS[index]

    if provider == "groq":
        test_groq_model(model_id)          # raises on failure
        active_gemini_obj = None
        gemini_chat = None
    else:
        active_gemini_obj = test_gemini_model(model_id)
        # Rebuild chat with existing history
        gemini_chat = active_gemini_obj.start_chat(history=[
            {"role": h["role"], "parts": [h["content"]]} for h in chat_history
        ])

    current_index   = index
    active_provider = provider
    active_model_id = model_id
    return display


def auto_fallback(failed_index: int):
    """Try every model after failed_index. Returns True if switched."""
    global current_index, active_provider, active_model_id
    global active_gemini_obj, gemini_chat

    for i in range(failed_index + 1, len(ALL_MODELS)):
        provider, model_id, display = ALL_MODELS[i]
        if provider == "groq" and not groq_client:
            continue
        if provider == "gemini" and not GEMINI_KEY:
            continue
        try:
            print(f"\n   Auto-switching to {display}...", end=" ", flush=True)
            switch_to(i)
            print("OK")
            return True
        except Exception:
            print("failed")
    return False


while True:
    try:
        user_input = input("\nYou: ").strip()

        if not user_input:
            continue

        # ── Commands ────────────────────────────────
        if user_input.lower() in ["exit", "quit"]:
            print("\nMediVoice AI: Goodbye! Stay healthy.\n")
            break

        if user_input.lower() == "/help":
            print_help()
            continue

        if user_input.lower() == "/current":
            _, _, display = ALL_MODELS[current_index]
            print(f"\n   Active model: {display}  ({active_provider})\n")
            continue

        if user_input.lower() == "/clear":
            chat_history = []
            if gemini_chat and active_gemini_obj:
                gemini_chat = active_gemini_obj.start_chat(history=[])
            print("\n   Chat history cleared.\n")
            continue

        if user_input.lower() == "/models":
            print("\n   Available Models:")
            for i, (prov, mid, disp) in enumerate(ALL_MODELS):
                marker = " <-- active" if i == current_index else ""
                key_ok = (prov == "groq" and groq_client) or (prov == "gemini" and GEMINI_KEY)
                status = "" if key_ok else " [no key]"
                print(f"   {i+1:2}. [{prov:6}]  {disp}{marker}{status}")
            print()
            continue

        if user_input.lower().startswith("/switch "):
            keyword = user_input[8:].strip().lower()
            match = next(
                (i for i, (p, m, d) in enumerate(ALL_MODELS)
                 if keyword in m.lower() or keyword in d.lower() or keyword in p.lower()),
                None,
            )
            if match is None:
                print(f"\n   No model matching '{keyword}'. Use /models to see options.\n")
                continue
            try:
                display = switch_to(match)
                chat_history = []  # clear history on manual switch
                print(f"\n   Switched to: {display}\n")
            except Exception as e:
                print(f"\n   Failed to switch: {e}\n")
            continue

        # ── Generate Response ────────────────────────
        _, _, display = ALL_MODELS[current_index]
        print(f"\nMediVoice AI ({display}): ", end="", flush=True)

        retry_needed = False
        response_text = ""

        try:
            if active_provider == "groq":
                response_text = send_groq(active_model_id, chat_history, user_input)
            else:
                if gemini_chat is None:
                    raise RuntimeError("Gemini chat session not initialized")
                response_text = send_gemini(gemini_chat, user_input)

            if not response_text.strip():
                raise RuntimeError("Empty response")

            print()
            # Save to history
            chat_history.append({"role": "user",      "content": user_input})
            chat_history.append({"role": "assistant",  "content": response_text})

        except Exception as e:
            err = str(e)
            print(f"\n   [{display}] error: {err[:80]}")
            retry_needed = True

        if retry_needed:
            failed_at = current_index
            switched  = auto_fallback(failed_at)
            if switched:
                _, _, new_display = ALL_MODELS[current_index]
                print(f"\nMediVoice AI ({new_display}): ", end="", flush=True)
                try:
                    if active_provider == "groq":
                        response_text = send_groq(active_model_id, chat_history, user_input)
                    else:
                        response_text = send_gemini(gemini_chat, user_input)
                    print()
                    chat_history.append({"role": "user",      "content": user_input})
                    chat_history.append({"role": "assistant",  "content": response_text})
                except Exception as e2:
                    print(f"\n   Retry also failed: {e2}\n")
            else:
                print("\n   All models exhausted. Check API keys and quotas.\n")

    except KeyboardInterrupt:
        print("\n\nSession ended. Goodbye!\n")
        break
    except Exception as e:
        print(f"\n   Unexpected error: {e}\n")
