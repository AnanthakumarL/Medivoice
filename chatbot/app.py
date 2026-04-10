import os

# Disable TensorFlow to avoid NumPy compatibility issues
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging
os.environ['TRANSFORMERS_NO_TF'] = '1'  # Disable TensorFlow in transformers
os.environ['USE_TF'] = '0'  # Disable TensorFlow usage

import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

# LangGraph and Langchain imports
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq

# Prefer the new langchain-huggingface package (removes deprecation warning) with graceful fallback
try:  # New recommended package
    from langchain_huggingface import HuggingFaceEmbeddings  # type: ignore
except ImportError:  # Fallback to deprecated location if not installed yet
    from langchain_community.embeddings import HuggingFaceEmbeddings

# Gemini imports
import google.generativeai as genai

from config import config

load_dotenv()
app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])

# --- API Keys ---
api_key = os.getenv("GROQ_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not api_key or not gemini_api_key:
    raise ValueError("API keys not found in environment")

# --- Gemini Config ---
genai.configure(api_key=gemini_api_key)
gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")

# --- Embeddings + Vector DB ---
embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL_NAME)
vectordb = Chroma(
    persist_directory=config.CHROMA_PERSIST_DIRECTORY,
    embedding_function=embeddings
)

# --- Feedback Storage ---
feedback_storage = []
def store_feedback(session_id, message_id, feedback_type, message_type, content, comment=None):
    feedback_entry = {
        'session_id': session_id,
        'message_id': message_id,
        'feedback_type': feedback_type,
        'message_type': message_type,
        'content': content,
        'comment': comment,
        'timestamp': datetime.now().isoformat()
    }
    feedback_storage.append(feedback_entry)
    return feedback_entry

# --- Intent Classification ---
# --- Updated Intent Classification ---
def classify_intent(message):
    user_lower = message.lower()

    # Predefined intents
    intents = {
        'emergency': ['emergency', 'urgent', 'critical', 'chest pain', 'stroke', "can't breathe"],
        'medication_request': ['suggest', 'medicine', 'tablet', 'drug', 'dose'],
        'symptom_check': ['i feel', 'i have', 'my symptoms', 'experiencing'],
        'disease_info': ['what is', 'tell me about', 'explain', 'information about'],
        'disease_management': ['how to manage', 'how to treat', 'how to prevent'],
        'side_effects': ['side effect', 'reaction to', 'after taking']
    }

    # 1️⃣ Check predefined intents first
    for intent, keywords in intents.items():
        if any(k in user_lower for k in keywords):
            return intent

    # 2️⃣ Check for general medical keywords if no intent matched
    medical_keywords = [
        "fever", "pain", "ache", "cough", "cold", "flu",
        "nausea", "vomit", "diarrhea", "constipation", "dizzy",
        "fatigue", "weakness", "rash", "itch", "burn", "stomach",
        "throat", "nose", "ear", "eye", "chest", "breathing",
        "diabetes", "blood pressure", "hypertension", "asthma",
        "arthritis", "cholesterol", "thyroid", "heart", "cardiac",
        "cancer", "stroke", "kidney", "liver", "infection", "migraine",
        "anemia", "hepatitis", "allergy", "allergic", "symptom",
        "treatment", "medication", "medicine", "tablet", "pill",
        "capsule", "drug", "dose", "dosage", "prescription", "disease"
    ]
    if any(keyword in user_lower for keyword in medical_keywords):
        return "medical_general"

    # 3️⃣ Default for non-medical queries
    return "general"


# --- Severity Assessment ---
def assess_severity(message):
    user_lower = message.lower()
    severity_map = {
        'critical': ['cannot breathe', 'unconscious', 'severe bleeding', 'heart attack', 'stroke', 'collapsed'],
        'high': ['severe', 'intense', 'excruciating', 'worsening', 'spreading fast'],
        'medium': ['moderate', 'persistent', 'frequent'],
        'low': ['mild', 'slight', 'occasional']
    }
    for level, indicators in severity_map.items():
        if any(i in user_lower for i in indicators):
            return level
    return 'unknown'

# --- Emergency Handler ---
def handle_emergency(message):
    return (
        "🚨 EMERGENCY DETECTED 🚨\nCall emergency services immediately!\n"
        "India: 108 | US: 911\n"
        "Stay calm, note symptoms, do NOT delay!"
    )

# --- Groq Chat Model ---
def get_chat_model():
    return ChatGroq(model="llama-3.1-8b-instant", temperature=0.2, max_tokens=400, api_key=api_key)
model = get_chat_model()

def call_groq(state: MessagesState):
    system_prompt = (
        "You are MEDIVOICE, a medical assistant. Provide short, accurate, evidence-based answers under 100 words."
    )
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = model.invoke(messages)
    return {"messages": response}

workflow = StateGraph(state_schema=MessagesState)
workflow.add_node("model", call_groq)
workflow.add_edge(START, "model")
memory = MemorySaver()
langgraph_app = workflow.compile(checkpointer=memory)

# --- Gemini Helper ---
def call_gemini(prompt: str, intent: str = "general") -> str:
    try:
        guardrail = (
            "You are MEDIVOICE, a medical assistant. Answer short, clear, evidence-based.\n"
            "Include dosages for medications with disclaimers. Ask follow-ups if needed. "
            "If not health-related, respond: 'I only answer health questions.'\n"
            f"User intent: {intent}"
        )
        response = gemini_model.generate_content(f"{guardrail}\n\nUser query: {prompt}")
        return response.text
    except:
        return "I'm having trouble processing your request. Please try again! 😊"

# --- Medication Dose Parser ---
def extract_medication_context(message):
    """
    Extract medicine, symptom, or disease from user message for dynamic suggestions.
    """
    meds = re.findall(r'\b(?:tablet|capsule|syrup|pill|drug|medication|medicine)\b', message.lower())
    return meds if meds else []

# --- Session Management ---
user_sessions = {}
def get_or_create_session(session_id):
    if session_id not in user_sessions:
        user_sessions[session_id] = {
            'messages': [],
            'thread_id': f"chat_{session_id}",
            'context': {'last_symptom': None, 'last_disease': None, 'last_intent': None, 'turn': 0}
        }
    return user_sessions[session_id]

# --- Process User Message ---
def process_user_message(user_message, session_id="default"):
    session = get_or_create_session(session_id)
    session['context']['turn'] += 1

    try:
        intent = classify_intent(user_message)
        severity = assess_severity(user_message)

        # EMERGENCY OVERRIDE
        if intent == "emergency" or severity == "critical":
            return handle_emergency(user_message)

        # Extract medication context if applicable
        meds_context = extract_medication_context(user_message)

        # Check RAG Knowledge Base
        docs = vectordb.similarity_search_with_score(user_message, k=5)
        context_text = "\n".join([doc[0].page_content for doc in docs[:3]]) if docs else ""

        # Prepare enhanced prompt for Groq
        enhanced_prompt = (
            f"Medical Context: {context_text}\n"
            f"Question: {user_message}\n"
            f"Intent: {intent}\n"
            f"Severity: {severity}\n"
            f"Medication Context: {', '.join(meds_context) if meds_context else 'None'}\n"
            "Give concise, evidence-based response. Include medicine dosages if applicable. Add disclaimer."
        )
        current_turn_message = HumanMessage(content=enhanced_prompt)

        try:
            # Attempt Groq first
            result = langgraph_app.invoke({"messages": [current_turn_message]}, config={"configurable": {"thread_id": session['thread_id']}})
            response = result['messages'][-1].content
            if not response.strip():
                # Fallback to Gemini
                response = call_gemini(user_message, intent)
        except:
            response = call_gemini(user_message, intent)

        # Append follow-up question for symptoms or meds
        followups = {
            'symptom_check': "\n\n🤔 How long have you had these symptoms? Severity?",
            'medication_request': "\n\n⚠ Any allergies or other medications?"
        }
        if intent in followups and 'thank' not in user_message.lower():
            response += followups[intent]

        # Store conversation
        session['messages'].append({"role": "user", "content": user_message})
        session['messages'].append({"role": "assistant", "content": response})

        return response
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I couldn't understand. Could you rephrase? 😊"

# --- Flask Routes ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    session_id = data.get('session_id', 'default')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    bot_response = process_user_message(user_message, session_id)
    timestamp = datetime.now().timestamp()
    return jsonify({
        'response': bot_response,
        'user_message_id': f"{session_id}user{timestamp}",
        'bot_message_id': f"{session_id}bot{timestamp}",
        'user_message': user_message
    })

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    session_id = data.get('session_id', 'default')
    message_id = data.get('message_id')
    feedback_type = data.get('feedback_type')
    message_type = data.get('message_type')
    content = data.get('content', '')
    comment = data.get('comment')
    if not message_id or feedback_type not in ['thumbs_up', 'thumbs_down'] or message_type not in ['user_message', 'bot_response']:
        return jsonify({'error': 'Invalid feedback'}), 400
    feedback_entry = store_feedback(session_id, message_id, feedback_type, message_type, content, comment)
    return jsonify({'success': True, 'feedback_id': len(feedback_storage)-1, 'message': 'Thank you for your feedback!'})

@app.route('/feedback/stats', methods=['GET'])
def feedback_stats():
    total = len(feedback_storage)
    thumbs_up = sum(f['feedback_type']=='thumbs_up' for f in feedback_storage)
    thumbs_down = sum(f['feedback_type']=='thumbs_down' for f in feedback_storage)
    return jsonify({'total_feedback': total, 'thumbs_up': thumbs_up, 'thumbs_down': thumbs_down})

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == "__main__":
    print("🏥 Starting MediVoice - Fully Enhanced Medical Assistant")
    app.run(debug=True, host='0.0.0.0', port=5001)
