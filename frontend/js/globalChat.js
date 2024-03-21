function openGlobalChat() {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.innerHTML = '';

    loadGlobalChatHistory();
}

function loadGlobalChatHistory() {
    fetch(`/api/global-chat/history`)
    .then(response => response.json())
    .then(messages => {
        messages.forEach(message => {
            displayChatMessage(message);
        });
    })
    .catch(error => console.error('Failed to load Global Chat history:', error));
}

function displayChatMessage(message) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `
        <div class="user-icon-container">
            <img src="${message.userIcon}" alt="User" class="user-icon">
        </div>
        <div class="message-details">
            <span class="nickname">${message.sender}</span>
            <div class="text-and-time">
                <div class="message-text">${message.text}</div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to new message
}
