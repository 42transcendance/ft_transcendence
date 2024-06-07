function openGlobalChat() {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.id = '';
    chatMessagesContainer.innerHTML = '';

    fetchChatHistory("global");
    // loadGlobalChatHistory();
    messageWith("general");

}

function fetchChatHistory(chatType, targetUserId = null) {
    // console.log("Fetching general");
    let requestData = { 'chat_type': chatType };
    if (chatType === 'private' && targetUserId) {
        requestData['target_user_id'] = targetUserId;
    }

    $.ajax({
        url: '/get_chat_history/',
        method: 'GET',
        data: requestData,
        success: function(data) {
            console.log('Chat history:', data); 
            if (data.chat_history) {
                updateChatInterface(data.chat_history);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching chat history:', error);
        }
    });
}

async function updateChatInterface(chatHistory) {
    const chatMessagesDiv = document.querySelector('.chat-messages');
    chatMessagesDiv.innerHTML = ''; // Clear current messages

    // Sort the chat history by timestamp before rendering
    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const chat of chatHistory) {
        if (chat.recipient === 'global') {
            await addMessageToGlobalChatUI(chat.message, chat.sender, chat.sender_id);
        } else {
            await addMessageToChatUI(chat.message, chat.sender, chat.sender_id, chat.recipient_id);
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

                messageElement.innerHTML = userIconHTML + messageDetailsHTML;
                document.querySelector('.chat-messages').appendChild(messageElement);
                scrollToBottom(document.querySelector('.chat-messages'));
                resolve(); // Resolve the promise after the message is added
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch pfp:", error);
                reject(error); // Reject the promise in case of an error
            }
        });
    });
}

function addMessageToChatUI(message, sender, senderid, id) {
    return new Promise((resolve, reject) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            data: { 'profile_id': senderid },
            dataType: 'json',
            success: function(data) {
                let pfp = data.user_details.userPfp || 'assets/pfp.png';
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
                resolve(); // Resolve the promise after the message is added
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch pfp:", error);
                reject(error); // Reject the promise in case of an error
            }
        });
    });
}



// function loadGlobalChatHistory() {
//     console.log(`loading global chat`);
//     fetch(`/api/global-chat/history`)
//     .then(response => response.json())
//     .then(messages => {
//         messages.forEach(message => {
//             displayChatMessage(message);
//         });
//     })
//     .catch(error => console.error('Failed to load Global Chat history:', error));
// }

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
