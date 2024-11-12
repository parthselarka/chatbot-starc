function appendMessage(role, message) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('div');

  if (role === 'You') {
    messageElement.classList.add('message', 'user-message');
    messageElement.innerHTML = `<div class="message-content user-content">${message}</div>`;
  } else {
    messageElement.classList.add('message', 'bot-message');
    messageElement.innerHTML = `<div class="message-content bot-content"><strong>S.T.A.R.C:</strong> ${message}</div>`;
  }

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Helper function to display or remove "S.T.A.R.C is listening..."
function setListeningStatus(isListening) {
  const listeningMessage = document.getElementById('listening-message');
  if (isListening) {
    if (!listeningMessage) {
      const messagesContainer = document.getElementById('messages');
      const messageElement = document.createElement('div');
      messageElement.id = 'listening-message';
      messageElement.classList.add('message', 'bot-message');
      messageElement.innerHTML = `<div class="message-content bot-content"><strong>S.T.A.R.C:</strong> is listening...</div>`;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  } else if (listeningMessage) {
    listeningMessage.remove();
  }
}

// Helper function to display or remove "S.T.A.R.C is typing..."
function setTypingStatus(isTyping) {
  const typingMessage = document.getElementById('typing-message');
  if (isTyping) {
    if (!typingMessage) {
      const messagesContainer = document.getElementById('messages');
      const messageElement = document.createElement('div');
      messageElement.id = 'typing-message';
      messageElement.classList.add('message', 'bot-message');
      messageElement.innerHTML = `<div class="message-content bot-content"><strong>S.T.A.R.C:</strong> is typing...</div>`;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  } else if (typingMessage) {
    typingMessage.remove();
  }
}

// Function to handle sending message
async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput.trim()) return;

  // Clear input box and remove the listening status
  document.getElementById('user-input').value = '';
  setListeningStatus(false);
  appendMessage('You', userInput);

  // Show "S.T.A.R.C is typing..." status
  setTypingStatus(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();

    // Remove "S.T.A.R.C is typing..." status
    setTypingStatus(false);
    appendMessage('Bot', data.reply);

  } catch (error) {
    // Remove "S.T.A.R.C is typing..." status
    setTypingStatus(false);
    appendMessage('Bot', 'Sorry, an error occurred.');
    console.error('Error:', error);
  }
}

// Handling 'Enter' key to send message
document.getElementById('user-input').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

const voiceInputBtn = document.getElementById('voice-input-btn');

// Voice recognition setup with Annyang
if (annyang) {
  // Add wildcard command to capture user input
  annyang.addCommands({
    '*userInput': function (input) {
      const userInputField = document.getElementById('user-input');
      userInputField.value = input;
      sendMessage();
    },
  });

  // Start/stop listening with visual feedback
  voiceInputBtn.addEventListener('click', () => {
    if (annyang.isListening()) {
      annyang.abort();
      setListeningStatus(false);
    } else {
      setListeningStatus(true);
      annyang.start({ autoRestart: false });
    }
  });

  // Event listeners for listening status
  annyang.addCallback('start', () => setListeningStatus(true));
  annyang.addCallback('end', () => setListeningStatus(false));
  annyang.addCallback('error', () => setListeningStatus(false));
} else {
  console.warn('Annyang is not supported in this browser.');
}
