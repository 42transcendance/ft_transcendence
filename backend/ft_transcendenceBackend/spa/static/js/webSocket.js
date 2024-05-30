function connectWebSocket() {
    console.log("WebSocket log.");
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const webSocketURL = `${wsScheme}://${window.location.host}/ws/chat/`;

    const chatSocket = new WebSocket(webSocketURL);

    chatSocket.onopen = function(e) {
        console.log("WebSocket connection established.");
    };

    chatSocket.onmessage = async function(e) {
        const data = JSON.parse(e.data);
        await handleWebSocketMessage(data);
    };

    chatSocket.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(connectWebSocket, 1000);
    };

    function msgFromBlocked(source_user_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get_block_list/', 
                method: 'GET',
                dataType: 'json',
                success: function(block_list) {
                    if (block_list.length > 0) {
                        const isBlocked = block_list.some(block => source_user_id == block.userid);
                        resolve(isBlocked);
                    } else {
                        resolve(false);
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                    reject(error);
                }
            });
        });
    }       

    async  function handleWebSocketMessage(data) {
        switch(data.type) {
            case 'private.message':
                console.log("websocket: private message");
                console.log(data)
                addMessageToChatUI(data.message, data.source_user, data.source_user_id, data.target_user_id);
                // displayPrivateMessage(data);
                break;
                case 'global.message':
                    console.log("websocket: global message");
                    console.log(data.source_user);
                    try {
                        const isBlocked = await msgFromBlocked(data.source_user_id);
                        if (isBlocked) {
                            console.log("Message blocked.");
                            return;
                        }
                        addMessageToGlobalChatUI(data.message, data.source_user, data.source_user_id);
                    } catch (error) {
                        console.error("Error checking block list:", error);
                    }
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

function addMessageToGlobalChatUI(message, sender, sender_id) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    let userIconHTML = '';

    $.ajax({
        url: '/get_user_details/',
        method: 'GET',
        data: { 'profile_id': sender_id },
        dataType: 'json',
        success: function(data) {
            let pfp = data.user_details.userPfp || 'assets/pfp.png';
            userIconHTML = `<div class="user-icon-container"><img src="${pfp}" alt="${sender}" class="user-icon"></div>`;

            let messageDetailsHTML1;
            if (sender_id == userId) {
                messageDetailsHTML1 = `
                <div class="message-details">
                    <div class="nicknameAndIcon">
                        <span class="nickname" data-user-id="${sender_id}">${sender}</span>
                    </div>
                    <div class="text-and-time">
                        <div class="message-text">${message}</div>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                </div>
                `;
            } else {
                messageDetailsHTML1 = `
                <div class="message-details">
                    <div class="nicknameAndIcon">
                        <span class="nickname" data-user-id="${sender_id}">${sender}</span>
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
            }
            const messageDetailsHTML = messageDetailsHTML1;

            messageElement.innerHTML = userIconHTML + messageDetailsHTML;
            document.querySelector('.chat-messages').appendChild(messageElement);
            scrollToBottom(document.querySelector('.chat-messages'));
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch pfp:", error);
        }
    });
}


function addMessageToChatUI(message, sender, senderid, id) {
    let compareIdStr1 = "chat-with-" + senderid;
    let compareIdStr2 = "chat-with-" + id;

    if ((compareIdStr1 == document.querySelector('.chat-messages').id && userId == id) || 
        (compareIdStr2 == document.querySelector('.chat-messages').id && userId == senderid)) 
    {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            data: { 'profile_id': senderid },
            dataType: 'json',
            success: function(data) {
                let pfp = data.user_details.userPfp || 'static/assets/pfp.png';
                const userIconHTML = `<div class="user-icon-container"><img src="${pfp}" alt="${sender}" class="user-icon"></div>`;
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
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch pfp:", error);
            }
        });
    }
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
