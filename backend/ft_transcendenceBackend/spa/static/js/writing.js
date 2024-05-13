let currentChatContext = 'global';
let currentRecipientId = null;
let userId = null;
let userUsername = null;

document.addEventListener('DOMContentLoaded', function() {
    const sendMessageButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input');
    const chatMessagesDiv = document.querySelector('.chat-messages');

    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        // addMessageToChatUI(messageText, 'You');
        if (currentChatContext === 'global') {
            sendMessage('global.message', messageText);
        } else if (currentChatContext === 'private' && currentRecipientId) {
            console.log("recep ID: ", currentRecipientId);
            sendMessage('private.message', messageText, currentRecipientId);
		}
        messageInput.value = '';
    });

    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessageButton.click();
        }
    });
});


function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}


function sendMessage(type, message, id=null) {
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        const messageData = { type, message };
        console.log("type: ", type);
        if (id) {
            console.log("id present: ", id);
            messageData.target_user_id = id;
        }
        window.chatSocket.send(JSON.stringify(messageData));
        console.log("sent successfully");
    } else {
        console.error("WebSocket is not connected.");
    }
}

function messageWith(mode, username) {
    console.log("LAWD HAVE MERCY IM BOUT TO BUST");
    let text = document.getElementById('social-text');
    if (mode == 'set')
        text.textContent = "Messages: " + username;
    else if (mode == 'reset')
        text.textContent = "Messages";
    else if (mode == 'general')
        text.textContent = "Messages" + ": General Chat";
}