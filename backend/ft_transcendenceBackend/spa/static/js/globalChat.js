function openGlobalChat() {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.id = '';
    chatMessagesContainer.innerHTML = '';

    loadGlobalChatHistory();
}

function loadGlobalChatHistory() {
    console.log(`loading global chat`);
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

    console.log("messages senders id: ", message.senderId)

    const iconsHTML = message.senderId != userId ? `
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


//overall messages in the chhat events

// document.addEventListener('DOMContentLoaded', function() {
//     const chatMessagesContainer = document.querySelector('.chat-messages');

//     chatMessagesContainer.addEventListener('click', function(event) {
//         console.log("clicked");
//         if (event.target.classList.contains('bi-person')) {
//             const nicknameElement = event.target.closest('.nicknameAndIcon').querySelector('.nickname');
//             const TheId = nicknameElement.getAttribute('data-user-id');

//             console.log('User ID:', TheId);

//             const profileTab = document.querySelector('.profile-tab');
//             profileTab.click();
//         }
//     });
// });

// function handleUserIconClick(TheId) {
//     console.log('Handling click for user:', TheId);
// }
