function connectWebSocket() {
    console.log("WebSocket log.");
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const webSocketURL = `${wsScheme}://${window.location.host}/ws/chat/`;

    const chatSocket = new WebSocket(webSocketURL);

    chatSocket.onopen = function(e) {
        console.log("WebSocket connection established.");
    };

    chatSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    chatSocket.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(connectWebSocket, 1000);
    };

    function handleWebSocketMessage(data) {
        switch(data.type) {
            case 'private.message':
                console.log("chan mess recieved");
                console.log(data.message);
                console.log(data.target_user_id);
                addMessageToChatUI(data.message, data.source_user, data.target_user_id);
                // displayPrivateMessage(data);
                break;
            case 'global.message':
                
                console.log("global mess recieved : ", data);
                addMessageToGlobalChatUI(data.message, data.source_user);
                // displayGlobalMessage(data);
                break;
            case 'notification':
                displayNotification(data.message);
                break;
            case 'friendRequest':
                handleFriendRequest(data);
                break;
        }
    }
    window.chatSocket = chatSocket;
}

function addMessageToGlobalChatUI(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';

    const userIconHTML = `<div class="user-icon-container"><img src="static/assets/pfp.png" alt="${sender}" class="user-icon"></div>`;
    let messageDetailsHTML1;
    if(sender !== userId)
        messageDetailsHTML1 = `
        <div class="message-details">
            <div class="nicknameAndIcon">
                <span class="nickname" data-user-id="${sender}">${sender}</span>
            </div>
            <div class="text-and-time">
            <div class="message-text">${message}</div>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        </div>
        `;
    else
    messageDetailsHTML1 = `
    <div class="message-details">
        <div class="nicknameAndIcon">
            <span class="nickname" data-user-id="${sender}">${sender}</span>
            <i class="bi bi-caret-right-fill toggle-icons"></i>
            <div class="messageIcons">
                <i class="bi bi-controller messageIcon"></i>
                <i class="bi bi-plus-circle messageIcon"></i>
                <i class="bi bi-person messageIcon"></i>
            </div>
        </div>
        <div class="text-and-time">
            <div class="message-text">${message}</div>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    </div>
    `;
    const messageDetailsHTML = messageDetailsHTML1;

    messageElement.innerHTML = userIconHTML + messageDetailsHTML;
    document.querySelector('.chat-messages').appendChild(messageElement);
    scrollToBottom(document.querySelector('.chat-messages'));
}

function addMessageToChatUI(message, sender, id) {
    console.log("in add ui");
    console.log(id);
    // if (!id || document.querySelector('.chat-messages').id !== `chat-with-${id}`) {
    //     console.log("NO ID");
    //     return;
    // }

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
    scrollToBottom(document.querySelector('.chat-messages'));
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', connectWebSocket);

function displayPrivateMessage(data) {
    console.log(`Private message from ${data.sender}: ${data.message}`);
}

function displayGlobalMessage(data) {
    console.log(`Global message: ${data.message}`);
}

function displayNotification(message) {
    console.log(`Notification: ${message}`);
}

function handleFriendRequest(data) {
    console.log(`Friend request from ${data.sender}: ${data.message}`);
}


// function sendMessage(type, message, id=null) {
//     if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
//         const messageData = { type, message };
//         if (id) messageData.id = id;

//         window.chatSocket.send(JSON.stringify(messageData));
//     } else {
//         console.error("WebSocket is not connected.");
//     }
// }
