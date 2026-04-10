const express = require('express');
const router = express.Router();

// Simple proxy / mock for the MediVoice Flask chatbot
// POST /api/chatbot
// Body: { message: string, session_id?: string }

const CHATBOT_URL = process.env.CHATBOT_URL || 'http://127.0.0.1:5001';

// Helper to build fallback response similar to Flask
function fallbackResponse(message, session_id = 'default') {
  const ts = Date.now();
  return {
    response: `(Offline) MediVoice is unavailable. Echo: ${String(message).slice(0,200)}`,
    user_message_id: `${session_id}_user_${ts}`,
    bot_message_id: `${session_id}_bot_${ts}`,
    user_message: message,
    session_id
  };
}

// Shared handler so both "/" and "/chat" work (frontend appends /chat)
async function handleChatbotProxy(req, res) {
  try {
    const { message, session_id } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'No message provided' });
    }

    // Try to forward to real chatbot if available
    try {
      const resp = await fetch(`${CHATBOT_URL.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id })
      });

      if (!resp.ok) {
        // If remote responds with error, return fallback with status
        const text = await resp.text().catch(() => '');
        console.warn('Chatbot upstream responded with', resp.status, text);
        return res.status(502).json(fallbackResponse(message, session_id));
      }

      const data = await resp.json();
      return res.json(data);
    } catch (err) {
      console.warn('Chatbot upstream unreachable:', err.message || err);
      // Return a graceful offline response
      return res.json(fallbackResponse(message, session_id));
    }

  } catch (error) {
    console.error('Chatbot proxy error:', error);
    res.status(500).json({ error: 'Chatbot proxy failed' });
  }
}

// Support both /api/chatbot and /api/chatbot/chat to match frontend calls
router.post('/', handleChatbotProxy);
router.post('/chat', handleChatbotProxy);

module.exports = router;
