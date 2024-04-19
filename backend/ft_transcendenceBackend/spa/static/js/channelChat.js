function openChannelChat(channelId) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.id = `chat-with-${channelId}`;
    chatMessagesContainer.innerHTML = '';
    console.log(`Opening chat with channel ID: ${channelId}`);
    loadChannelChatHistory(channelId);
}

function loadChannelChatHistory(channelId) {
    fetch(`/api/channel-chat/history/${channelId}`)
    .then(response => response.json())
    .then(messages => {
        messages.forEach(message => {
            displayChannelMessage(message);
        });
    })
    .catch(error => console.error(`Failed to load history for channel ${channelId}:`, error));
}

function displayChannelMessage(message) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `
        <div class="user-icon-container">
            <img src="${message.userIcon}" alt="User" class="user-icon">
        </div>
        <div class="message-details">
            <span class="nickname"  data-user-id="${message.senderId}">${message.sender}</span>
            <div class="text-and-time">
                <div class="message-text">${message.text}</div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}
