const express = require('express');
const router = express.Router();
const chatWithGPT = require('../controllers/chatbotController');

// Chat route to handle user input and respond with ChatGPT
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  // Initialize the conversation history if not already in session
  if (!req.session.conversationHistory) {
    req.session.conversationHistory = [
      { role: 'system', content: 'You are S.T.A.R.C just like Jarvis, an intelligent, calm, and professional AI assistant. You provide efficient, concise, and informative responses. You are polite, respectful, and always aim to help with precision.' }
    ];
  }

  // Add user message to the conversation history
  req.session.conversationHistory.push({ role: 'user', content: message });

  try {
    // Pass the conversation history to the controller for ChatGPT response
    const reply = await chatWithGPT(req, message);

    // Send the bot's reply as a response
    res.json({ reply });

  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
