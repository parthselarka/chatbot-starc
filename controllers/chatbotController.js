const axios = require('axios');

const chatWithGPT = async (req, message) => {
  try {
    // Initialize the conversation history if it doesn't exist in the session
    if (!req.session.conversationHistory) {
      req.session.conversationHistory = [
        { role: 'system', content: 'You are a helpful assistant.' }
      ];
    }

    // Add the user message to the conversation history
    req.session.conversationHistory.push({ role: 'user', content: message });

    // Create the conversation context by joining previous messages
    const messages = req.session.conversationHistory.map(entry => ({
      role: entry.role,
      content: entry.content
    }));

    // Send the conversation history to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // Make sure this matches the model you want to use
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get the bot reply from the API response
    const botReply = response.data.choices[0].message.content;

    // Add the bot reply to the conversation history
    req.session.conversationHistory.push({ role: 'assistant', content: botReply });

    return botReply;

  } catch (error) {
    console.error('Error with ChatGPT API:', error.message);
    return 'Sorry, there was an error processing your request.';
  }
};

module.exports = chatWithGPT;
