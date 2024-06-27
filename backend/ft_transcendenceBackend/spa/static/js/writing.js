let currentChatContext = 'global';
let currentRecipientId = null;
let userId = null;
let userUsername = null;

document.addEventListener('DOMContentLoaded', async function() {
    const sendMessageButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input');

    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        if (currentChatContext === 'global') {
            sendMessage('global.message', messageText);
        } else if (currentChatContext === 'private' && currentRecipientId) {
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
    let timestamp = new Date().toISOString();
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        const messageData = { type, message, timestamp };
        if (id) {
            messageData.target_user_id = id;
        }
        window.chatSocket.send(JSON.stringify(messageData));
    } else {
        console.error("WebSocket is not connected.");
    }
}

function messageWith(mode, username=null) {
    let text = document.getElementById('social-text');
    if (mode == 'set')
        text.textContent = window.translatedMessages + ": " + username;
    else if (mode == 'reset')
        text.textContent = window.translatedMessages;
    else if (mode == 'general')
        text.textContent = window.translatedMessages + ": General Chat";
}
