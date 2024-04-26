function openGlobalChat() {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.id = NULL;
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
    messageElement.className = 'chat-message';

    const iconsHTML = message.senderId !== UserId ? `
        <i class="bi bi-caret-right-fill toggle-icons"></i>
        <div class="messageIcons" style="display: none;">
            <i class="bi bi-controller messageIcon"></i>
            <i class="bi bi-plus-circle messageIcon"></i>
            <i class="bi bi-person messageIcon"></i>
        </div>
    ` : '';

    messageElement.innerHTML = `
        <div class="user-icon-container">
            <img src="${message.userIcon}" alt="User" class="user-icon">
        </div>
        <div class="message-details">
            <div class="nicknameAndIcon">
                <span class="nickname" data-user-id="${message.senderId}">${message.sender}</span>
                ${iconsHTML}
            </div>
            <div class="text-and-time">
                <div class="message-text">${message.text}</div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}
