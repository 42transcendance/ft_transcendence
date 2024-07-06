function connectWebSocket() {
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const webSocketURL = `${wsScheme}://${window.location.host}/ws/chat/`;
    
    const chatSocket = new WebSocket(webSocketURL);

    chatSocket.onopen = function(e) {
    };

    chatSocket.onmessage = async function(e) {
        const data = JSON.parse(e.data);
        await handleWebSocketMessage(data);
    };
    chatSocket.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };

    chatSocket.onclose = function(e) {
        // setTimeout(connectWebSocket, 1000);
    };

    function msgFromBlocked(source_user_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/message_from_blocked/', 
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
                switchOrCreateChatDiv(data.source_user_id, data.source_user);
                await addMessageToChatUI(data.message, data.source_user, data.source_user_id, data.target_user_id, data.timestamp);
                break;
            case 'global.message':
                try {
                    const isBlocked = await msgFromBlocked(data.source_user_id);
                    if (isBlocked) {
                        return;
                    }
                    await addMessageToGlobalChatUI(data.message, data.source_user, data.source_user_id, data.timestamp);
                } catch (error) {
                    console.error("Error checking block list:", error);
                }
                break;
            case 'notification':
                break;
            case 'friendRequest':
                break;
            case 'game.invite.receive':
                gameNotification(data);
                break;
            case 'game.invite.send':
                showNotification(data.message, "rgb(81, 171, 81)");
                break;
            case 'ping':
                console.log("RECEIVED PING");
                break;
            break;
        }
    }
    window.chatSocket = chatSocket;
}

function gameNotification(data) {
    const username = data.source_user;
    const message = `invited you to a game`;

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

                const notificationMessage = document.createElement('span');
                notificationMessage.textContent = username + " " + response.translations.message;

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
                    document.querySelector('.nav-button.play').click();
                    acceptGameInvite(data.source_user_id, data.room_id);
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

function acceptGameInvite(friendId, roomId) {
    joinPrivateGame(roomId);
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

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

document.addEventListener('authenticated', connectWebSocket);
