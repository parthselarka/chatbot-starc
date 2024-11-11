function appendMessage(role, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    
    // Different styling based on the role
    if (role === 'You') {
      messageElement.classList.add('message', 'user-message'); // Add a user-message class
      messageElement.innerHTML = `<div class="message-content user-content"> ${message}</div>`;
    } else {
      messageElement.classList.add('message', 'bot-message'); // Add a bot-message class
      messageElement.innerHTML = `<div class="message-content bot-content"><strong>S.T.A.R.C:</strong> ${message}</div>`;
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
  }

  // Function to handle sending message
  async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return; // Prevent sending empty messages

    appendMessage('You', userInput);

    // Send message to the server
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      appendMessage('Bot', data.reply);

      // Clear input
      document.getElementById('user-input').value = '';
    } catch (error) {
      appendMessage('Bot', 'Sorry, an error occurred.');
      console.error('Error:', error);
    }
  }

  // Handling 'Enter' key to send message
  document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });