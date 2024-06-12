function openGlobalChat() {
    document.querySelectorAll('.chat-messages').forEach(chatDiv => {
        chatDiv.style.display = 'none';
    });

    const globalChatDiv = document.querySelector(`.chat-messages[data-id='global']`);
    if (globalChatDiv) {
        globalChatDiv.style.display = 'block';
    }

    messageWith('general');
}


async function updateChatInterface(chatMessagesDiv, chatHistory) {
    chatMessagesDiv.innerHTML = '';

    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const chat of chatHistory) {
        if (chat.recipient === 'global') {
            await addMessageToGlobalChatUI(chat.message, chat.sender, chat.sender_id, chatMessagesDiv);
        } else {
            await addMessageToChatUI(chat.message, chat.sender, chat.sender_id, chat.recipient_id, chatMessagesDiv);
        }
    }

    scrollToBottom(chatMessagesDiv);
}

function addMessageToGlobalChatUI(message, sender, sender_id) {
    return new Promise((resolve, reject) => {
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

                const globalChatDiv = document.querySelector(`.chat-messages[data-id='global']`);
                messageElement.innerHTML = userIconHTML + messageDetailsHTML;
                globalChatDiv.appendChild(messageElement);
                scrollToBottom(globalChatDiv);
                resolve();
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch pfp:", error);
                reject(error);
            }
        });
    });
}


function addMessageToChatUI(message, sender, senderid, recipientid) {
    return new Promise((resolve, reject) => {
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
                const chatDivId = senderid == userId ? recipientid : senderid;
                // console.log(`sender: ${senderid}  userID: ${userId}  recipientid: ${recipientid}`);
                // console.log(chatDivId);
                const chatDiv = document.querySelector(`.chat-messages[data-id='${chatDivId}']`);
                chatDiv.appendChild(messageElement);
                scrollToBottom(chatDiv);
                resolve();
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch pfp:", error);
                reject(error);
            }
        });
    });
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
