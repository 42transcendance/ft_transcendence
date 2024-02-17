
console.log("chatting.js is loaded");
// messages sending
document.addEventListener('DOMContentLoaded', function() {
    var sendMessageButton = document.querySelector('.send-button');
    var messageInput = document.querySelector('.message-input');
    var chatMessagesDiv = document.querySelector('.chat-messages');

    sendMessageButton.addEventListener('click', function() {
        var messageText = messageInput.value.trim();

        if (messageText) {
            addMessageToChat(messageText);
            messageInput.value = '';
            scrollToBottom();
        }
    });

    function addMessageToChat(text) {
        var newMessageDiv = document.createElement('div');
        newMessageDiv.className = 'chat-message';
        
        var messageContent = `
            <span class="nickname">Your Nickname</span>
            <div class="message-content">
                <img src="assets/pfp.png" alt="User" class="user-icon">
                <div class="text-and-time">
                    <div class="message-text">${text}</div>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
                <i class="bi bi-three-dots-vertical options-icon"></i>
            </div>
        `;
        
        newMessageDiv.innerHTML = messageContent;
        chatMessagesDiv.appendChild(newMessageDiv);
    }

    function getCurrentTime() {
        var now = new Date();
        return now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    }
    
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            console.log("pressed");
            event.preventDefault();
            sendMessageButton.click();
        }
    });

    function scrollToBottom() {
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
});


// web socket version

document.addEventListener('DOMContentLoaded', function() {
    var sendMessageButton = document.querySelector('.send-button');
    var messageInput = document.querySelector('.message-input');
    var chatMessagesDiv = document.querySelector('.chat-messages');

    var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/ROOM_NAME/'); //REPLACE BY OUR URL

    sendMessageButton.addEventListener('click', function() {
        var messageText = messageInput.value.trim();

        if (messageText) {
            chatSocket.send(JSON.stringify({ 'message': messageText }));
            messageInput.value = '';
        }
    });

    // Receive message from WebSocket server
    chatSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        addMessageToChat(data.message, 'Other');
        scrollToBottom();
    };

    function addMessageToChat(text, sender = 'You') {
        var newMessageDiv = document.createElement('div');
        newMessageDiv.className = 'chat-message';

        var messageContent = `
            <span class="nickname">${sender}</span>
            <div class="message-content">
                <img src="assets/pfp.png" alt="User" class="user-icon">
                <div class="text-and-time">
                    <div class="message-text">${text}</div>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
                <i class="bi bi-three-dots-vertical options-icon"></i>
            </div>
        `;

        newMessageDiv.innerHTML = messageContent;
        chatMessagesDiv.appendChild(newMessageDiv);
    }

    function getCurrentTime() {
        var now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }

    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessageButton.click();
        }
    });

    function scrollToBottom() {
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
});


