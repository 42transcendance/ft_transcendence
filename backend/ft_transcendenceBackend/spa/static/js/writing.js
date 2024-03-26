let currentChatContext = 'global';
let currentRecipientId = null;

document.addEventListener('DOMContentLoaded', function() {
    const sendMessageButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input');
    const chatMessagesDiv = document.querySelector('.chat-messages');

    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        addMessageToChatUI(messageText, 'You');
        if (currentChatContext === 'global') {
            sendMessage('global', messageText);
			console.log("global");
        } else if (currentChatContext === 'private' && currentRecipientId) {
            sendMessage('private', messageText, currentRecipientId);
			console,log("private");
		}

        messageInput.value = '';
        scrollToBottom(chatMessagesDiv);
    });

    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessageButton.click();
        }
    });
});

function addMessageToChatUI(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    const userIconHTML = `<div class="user-icon-container"><img src="static/assets/pfp.png" alt="${sender}" class="user-icon"></div>`;
    const messageDetailsHTML = `
        <div class="message-details">
            <span class="nickname">${sender}</span>
            <div class="text-and-time">
                <div class="message-text">${message}</div>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        </div>
    `;
    messageElement.innerHTML = userIconHTML + messageDetailsHTML;
    document.querySelector('.chat-messages').appendChild(messageElement);
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function sendMessage(type, message) {
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        const messageData = { type: type, message: message };
        window.chatSocket.send(JSON.stringify(messageData));
    } else {
        console.error("WebSocket is not connected.");
    }
}



// web socket version

// document.addEventListener('DOMContentLoaded', function() {
//     var sendMessageButton = document.querySelector('.send-button');
//     var messageInput = document.querySelector('.message-input');
//     var chatMessagesDiv = document.querySelector('.chat-messages');

//     var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/ROOM_NAME/'); //REPLACE BY OUR URL

//     sendMessageButton.addEventListener('click', function() {
//         var messageText = messageInput.value.trim();

//         if (messageText) {
//             chatSocket.send(JSON.stringify({ 'message': messageText }));
//             messageInput.value = '';
//         }
//     });

//     // Receive message from WebSocket server
//     chatSocket.onmessage = function(e) {
//         var data = JSON.parse(e.data);
//         addMessageToChat(data.message, 'Other');
//         scrollToBottom();
//     };

//     function addMessageToChat(text, sender = 'You') {
//         var newMessageDiv = document.createElement('div');
//         newMessageDiv.className = 'chat-message';

//         var messageContent = `
//         <span class="nickname">${sender}</span>
//             <div class="message-content">
//                 <img src="assets/pfp.png" alt="User" class="user-icon">
//                 <div class="text-and-time">
//                     <div class="message-text">${text}</div>
//                     <span class="message-time">${getCurrentTime()}</span>
//                 </div>
//                 <i class="bi bi-three-dots-vertical options-icon"></i>
//             </div>
//         `;

//         newMessageDiv.innerHTML = messageContent;
//         chatMessagesDiv.appendChild(newMessageDiv);
//     }

//     function getCurrentTime() {
//         var now = new Date();
//         return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
//     }

//     messageInput.addEventListener('keypress', function(event) {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//             sendMessageButton.click();
//         }
//     });

//     function scrollToBottom() {
//         chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
//     }
// });