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
                    gameNotification(data);
                    break;
            case 'notification':
                displayNotification(data.message);
                break;
            case 'friendRequest':
                handleFriendRequest(data);
                break;
            case 'game.invite.recieve':
                gameNotification(data);
            break;
        }
    }
    window.chatSocket = chatSocket;
}

function gameNotification(data) {
    const username = data.source_user;
    const message = `${username} invited you to a game`;
    console.log(message);

    $.ajax({
        url: '/get_notif_translate/',
        method: 'GET',
        data: { 'message': message },
        success: function(response) {
            if (response && response.translations && response.translations.message) {
                const notification = document.createElement('div');
                notification.className = 'game-notification';
                notification.style.backgroundColor = "rgb(43, 142, 43)";
                notification.style.color = "white";
                notification.style.padding = "10px";
                notification.style.borderRadius = "5px";
                notification.style.marginBottom = "10px";
                notification.style.display = "flex";
                notification.style.alignItems = "center";
                notification.style.justifyContent = "space-between";
                notification.style.marginRight = "20px";
                // notification.style.position = "relative";

                const notificationMessage = document.createElement('span');
                notificationMessage.textContent = response.translations.message;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = "flex";
                buttonContainer.style.gap = "8px";
                buttonContainer.style.marginLeft = "10px";

                const acceptButton = document.createElement('button');
                acceptButton.className = 'btn btn-link p-0 accept-button';
                acceptButton.style.border = "none";
                acceptButton.style.background = "none";
                acceptButton.innerHTML = '<i class="bi bi-check-circle" style="color: white; font-size: 1.15rem;"></i>';
                acceptButton.onclick = () => {
                    acceptGameInvite(data.source_user_id);
                    notification.remove();
                    updateNotificationStyles();
                };

                const declineButton = document.createElement('button');
                declineButton.className = 'btn btn-link p-0 decline-button';
                declineButton.style.border = "none";
                declineButton.style.background = "none";
                declineButton.innerHTML = '<i class="bi bi-x-circle" style="color: red; font-size: 1.15rem;"></i>';
                declineButton.onclick = () => {
                    notification.remove();
                    updateNotificationStyles();
                };
                buttonContainer.appendChild(acceptButton);
                buttonContainer.appendChild(declineButton);
                
                notification.appendChild(notificationMessage);
                notification.appendChild(buttonContainer);

                const notifications = document.querySelectorAll('.game-notification');
                if (notifications.length >= 4) {
                    notifications[0].remove();
                }
                document.body.appendChild(notification);
                updateNotificationStyles();
                notification.style.display = 'flex';
                window.scrollTo(0, 0);
                setTimeout(function() {
                    notification.remove();
                    updateNotificationStyles();
                }, 8000);
            } else {
                console.error("Error: Invalid response from the server.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching translation:", error);
        }
    });
}

function acceptGameInvite(friendId) {
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        const inviteMessage = {
            type: 'game.invite.accept',
            inviter: friendId,
            invited: userId
        };
        window.chatSocket.send(JSON.stringify(inviteMessage));
    }
}

function updateNotificationStyles() {
    const notifications = document.querySelectorAll('.game-notification');
    let topPosition = 5;
    let opacity = 1;
    const opacityStep = 0.1;

    notifications.forEach((notification, index) => {
        notification.style.top = `${topPosition}px`;
        notification.style.opacity = opacity.toFixed(2);
        topPosition += notification.offsetHeight + 5;
        opacity -= opacityStep;
    });
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
