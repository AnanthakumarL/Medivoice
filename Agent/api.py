import os
import io
import base64
import mimetypes
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from groq import Groq
from pymongo import MongoClient
from PIL import Image

# ──────────────────────────────────────────────
# Load environment
# ──────────────────────────────────────────────
load_dotenv()

GEMINI_KEY  = os.getenv("GEMINI_API_KEY")
GROQ_KEY    = os.getenv("GROQ_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
PORT        = int(os.getenv("PORT", 8000))

# ──────────────────────────────────────────────
# MongoDB Setup
# ──────────────────────────────────────────────
mongo_client = None
db           = None
chat_col     = None

def init_mongo():
    global mongo_client, db, chat_col
    try:
        mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        mongo_client.server_info()  # force connect
        db       = mongo_client["medihub"]
        chat_col = db["ai_chat_history"]
        # Index for fast queries by session / timestamp
        chat_col.create_index([("session_id", 1), ("timestamp", -1)])
        print(f"[DB] Connected to MongoDB Atlas — collection: ai_chat_history")
    except Exception as e:
        print(f"[DB] MongoDB connection failed: {e}")
        print("[DB] Chat history will NOT be saved.")
        chat_col = None

def save_to_db(session_id: str, user_msg: str, ai_msg: str, model_used: str):
    if chat_col is None:
        return
    try:
        chat_col.insert_one({
            "session_id":   session_id,
            "user_message": user_msg,
            "ai_response":  ai_msg,
            "model":        model_used,
            "timestamp":    datetime.utcnow(),
        })
    except Exception as e:
        print(f"[DB] Failed to save message: {e}")

# ──────────────────────────────────────────────
# AI Provider Setup
# ──────────────────────────────────────────────
SYSTEM_PROMPT = """You are MediVoice AI — an advanced, empathetic healthcare assistant.

Your capabilities:
- Answer patient queries about symptoms, medications, and general health
- Assist doctors with clinical summaries and treatment suggestions
- Help medical staff with scheduling, prescriptions, and patient notes
- Explain lab results in simple, non-technical language
- Provide emergency guidance and recommend when to seek care

Guidelines:
- Always be compassionate, clear, and professional
- Never diagnose definitively — always recommend seeing a licensed physician for serious concerns
- Keep responses concise and helpful
- For emergency symptoms (chest pain, difficulty breathing), always advise calling emergency services immediately"""

ALL_MODELS = [
    ("groq",   "llama-3.3-70b-versatile"),
    ("groq",   "llama-3.1-8b-instant"),
    ("groq",   "mixtral-8x7b-32768"),
    ("groq",   "gemma2-9b-it"),
    ("gemini", "gemini-2.5-pro"),
    ("gemini", "gemini-2.5-flash"),
    ("gemini", "gemini-2.0-flash"),
    ("gemini", "gemini-1.5-flash"),
]

if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

groq_client    = Groq(api_key=GROQ_KEY) if GROQ_KEY else None
active_model   = {"provider": None, "model_id": None}

def try_models_and_activate():
    """Try each model in order; activate the first working one."""
    for provider, model_id in ALL_MODELS:
        if provider == "groq" and not groq_client:
            continue
        if provider == "gemini" and not GEMINI_KEY:
            continue
        try:
            if provider == "groq":
                r = groq_client.chat.completions.create(
                    model=model_id,
                    messages=[{"role": "user", "content": "Hi"}],
                    max_tokens=5,
                )
                _ = r.choices[0].message.content
            else:
                m = genai.GenerativeModel(model_name=model_id)
                r = m.generate_content("Hi", stream=False)
                _ = r.text
            active_model["provider"] = provider
            active_model["model_id"] = model_id
            print(f"[AI] Active model: {model_id} ({provider})")
            return True
        except Exception as e:
            print(f"[AI] {model_id} failed: {str(e)[:60]}")
    return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_mongo()
    ok = try_models_and_activate()
    if not ok:
        print("[AI] WARNING: No working model found. Requests will fail.")
    yield
    if mongo_client:
        mongo_client.close()

# ──────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────
app = FastAPI(title="MediVoice AI Agent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Request / Response models
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    model:    str
    session_id: str

class HistoryResponse(BaseModel):
    session_id:   str
    user_message: str
    ai_response:  str
    model:        str
    timestamp:    datetime

# ──────────────────────────────────────────────
# Helper — send message to active model
# ──────────────────────────────────────────────
def call_ai(message: str, history: list[dict]) -> str:
    provider = active_model["provider"]
    model_id = active_model["model_id"]

    if provider == "groq":
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for h in history[-10:]:   # last 10 turns for context
            messages.append({"role": "user",      "content": h["user_message"]})
            messages.append({"role": "assistant",  "content": h["ai_response"]})
        messages.append({"role": "user", "content": message})

        resp = groq_client.chat.completions.create(
            model=model_id,
            messages=messages,
            max_tokens=2048,
        )
        return resp.choices[0].message.content

    else:  # gemini
        m = genai.GenerativeModel(
            model_name=model_id,
            system_instruction=SYSTEM_PROMPT,
        )
        # Build history for Gemini
        gemini_history = []
        for h in history[-10:]:
            gemini_history.append({"role": "user",  "parts": [h["user_message"]]})
            gemini_history.append({"role": "model", "parts": [h["ai_response"]]})
        chat = m.start_chat(history=gemini_history)
        resp = chat.send_message(message)
        return resp.text

# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":  "ok",
        "model":   active_model["model_id"],
        "provider": active_model["provider"],
        "db":      "connected" if chat_col is not None else "disconnected",
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not active_model["provider"]:
        # Try to re-initialize
        if not try_models_and_activate():
            raise HTTPException(status_code=503, detail="No AI model available. Check API keys.")

    # Fetch recent history for this session
    history = []
    if chat_col is not None:
        cursor = chat_col.find(
            {"session_id": req.session_id},
            sort=[("timestamp", 1)],
            limit=10,
        )
        history = list(cursor)

    # Generate response with fallback
    response_text = None
    model_used    = active_model["model_id"]

    for i, (provider, model_id) in enumerate(ALL_MODELS):
        if provider == active_model["provider"] and model_id == active_model["model_id"]:
            start_idx = i
            break
    else:
        start_idx = 0

    for provider, model_id in ALL_MODELS[start_idx:]:
        if provider == "groq" and not groq_client:
            continue
        if provider == "gemini" and not GEMINI_KEY:
            continue
        try:
            # Temporarily set active model
            prev = dict(active_model)
            active_model["provider"] = provider
            active_model["model_id"] = model_id
            response_text = call_ai(req.message, history)
            model_used    = model_id
            break
        except Exception as e:
            active_model.update(prev)
            print(f"[AI] {model_id} failed on request: {str(e)[:80]}")

    if not response_text:
        raise HTTPException(status_code=503, detail="All AI models failed. Please try again later.")

    # Save to MongoDB
    save_to_db(req.session_id, req.message, response_text, model_used)

    return ChatResponse(
        response=response_text,
        model=model_used,
        session_id=req.session_id,
    )


# ──────────────────────────────────────────────
# Multimodal Route — image / file + text
# ──────────────────────────────────────────────
@app.post("/api/chat/multimodal")
async def chat_multimodal(
    message: str = Form(default=""),
    session_id: str = Form(default="default"),
    file: UploadFile = File(...),
):
    """Process text + image/file through Gemini Vision or text extraction."""
    file_bytes = await file.read()
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0] or "application/octet-stream"
    filename = file.filename or "upload"

    # ── Image → Gemini Vision ──────────────────
    if mime.startswith("image/"):
        if not GEMINI_KEY:
            raise HTTPException(status_code=400, detail="Image analysis requires Gemini API key.")

        prompt_text = message.strip() or "Analyze this medical image. Describe what you see, any abnormalities, and potential health implications."

        # Try Gemini vision models in priority order
        vision_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        response_text = None
        model_used = None

        for vm in vision_models:
            try:
                m = genai.GenerativeModel(
                    model_name=vm,
                    system_instruction=SYSTEM_PROMPT,
                )
                img = Image.open(io.BytesIO(file_bytes))
                resp = m.generate_content([prompt_text, img])
                response_text = resp.text
                model_used = vm
                # Update global active model to this working one
                active_model["provider"] = "gemini"
                active_model["model_id"] = vm
                break
            except Exception as e:
                print(f"[Vision] {vm} failed: {str(e)[:60]}")

        if not response_text:
            raise HTTPException(status_code=503, detail="Image analysis failed. All Gemini vision models unavailable.")

        save_to_db(session_id, f"[Image: {filename}] {prompt_text}", response_text, model_used)
        return {"response": response_text, "model": model_used, "session_id": session_id, "file_type": "image"}

    # ── PDF → extract text → send to AI ───────
    elif mime == "application/pdf" or filename.lower().endswith(".pdf"):
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            extracted = ""
            for page in doc:
                extracted += page.get_text()
            doc.close()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not read PDF: {e}")

        if not extracted.strip():
            raise HTTPException(status_code=400, detail="PDF appears to be empty or scanned (no text layer).")

        combined_message = f"""
The user uploaded a PDF document: \"{filename}\"

Document content:
{extracted[:6000]}{'... [truncated]' if len(extracted) > 6000 else ''}

User question: {message.strip() or 'Please summarize and analyze this document.'}
"""
        history = list(chat_col.find({"session_id": session_id}, sort=[("timestamp", 1)], limit=5)) if chat_col else []
        response_text = call_ai(combined_message, history)
        model_used = active_model["model_id"]
        save_to_db(session_id, f"[PDF: {filename}] {message}", response_text, model_used)
        return {"response": response_text, "model": model_used, "session_id": session_id, "file_type": "pdf"}

    # ── Plain text / CSV / other text files ───
    else:
        try:
            text_content = file_bytes.decode("utf-8", errors="replace")
        except Exception:
            raise HTTPException(status_code=400, detail="Cannot read this file type. Please upload an image, PDF, or text file.")

        combined_message = f"""
The user uploaded a file: \"{filename}\"

File content:
{text_content[:6000]}{'... [truncated]' if len(text_content) > 6000 else ''}

User question: {message.strip() or 'Please analyze this file content.'}
"""
        history = list(chat_col.find({"session_id": session_id}, sort=[("timestamp", 1)], limit=5)) if chat_col else []
        response_text = call_ai(combined_message, history)
        model_used = active_model["model_id"]
        save_to_db(session_id, f"[File: {filename}] {message}", response_text, model_used)
        return {"response": response_text, "model": model_used, "session_id": session_id, "file_type": "text"}

@app.get("/api/history/{session_id}")
def get_history(session_id: str, limit: int = 50):
    if chat_col is None:
        return {"history": [], "note": "DB not connected"}
    cursor = chat_col.find(
        {"session_id": session_id},
        {"_id": 0},
        sort=[("timestamp", -1)],
        limit=limit,
    )
    return {"history": list(cursor)}

@app.delete("/api/history/{session_id}")
def clear_history(session_id: str):
    if chat_col is None:
        return {"deleted": 0, "note": "DB not connected"}
    result = chat_col.delete_many({"session_id": session_id})
    return {"deleted": result.deleted_count}

@app.get("/api/models")
def list_models():
    return {
        "active": active_model,
        "available": [
            {"provider": p, "model": m} for p, m in ALL_MODELS
        ]
    }

@app.post("/api/models/switch")
def switch_model(body: dict):
    target = body.get("model", "")
    match  = next(((p, m) for p, m in ALL_MODELS if target in m), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Model '{target}' not found")
    provider, model_id = match
    try:
        active_model["provider"] = provider
        active_model["model_id"] = model_id
        # Quick test
        call_ai("Hi", [])
        return {"switched_to": model_id, "provider": provider}
    except Exception as e:
        try_models_and_activate()
        raise HTTPException(status_code=400, detail=f"Switch failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=PORT, reload=True)
