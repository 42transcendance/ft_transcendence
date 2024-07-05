function updateUI(action, containerId, contentOrId, isId = false) {
    const container = isId ? document : document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Container with ID '${containerId}' not found.`);
        return;
    }

    switch (action) {
        case 'add':
            if (typeof contentOrId === 'string' || contentOrId instanceof HTMLElement) {
                const content = (typeof contentOrId === 'string') ? contentOrId : contentOrId.outerHTML;
                container.insertAdjacentHTML('beforeend', content);
            } else {
                console.warn(`Invalid content provided for addition.`);
            }
            break;
        case 'delete':
            const selector = isId ? `#${contentOrId}` : `[data-id="${contentOrId}"]`;
            const elementToRemove = container.querySelector(selector);
            if (elementToRemove) {
                elementToRemove.remove();
            } else {
                console.warn(`Element with ${isId ? 'ID' : 'data-id'} '${contentOrId}' not found.`);
            }
            break;
        default:
            console.warn(`Invalid action '${action}'. Use 'add' or 'delete'.`);
    }
}

function showNotification(message, color) {
    $.ajax({
        url: '/get_notif_translate/',
        method: 'GET',
        data: { 'message': message },
        success: function(data) {
            var notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = data.translations.message;
            notification.style.backgroundColor = color;
            document.body.appendChild(notification);
    
            notification.style.display = 'block';
    
            setTimeout(function() {
                notification.style.display = 'none';
                document.body.removeChild(notification);
            }, 2000);
        }
    });  
}

function sendGameInvite(friendId, friendUsername, roomId) {
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        const inviteMessage = {
            type: 'game.invite.send',
            target_user_id: friendId,
            target_user_name: friendUsername,
            room_id: roomId, 
        };
        window.chatSocket.send(JSON.stringify(inviteMessage));
    } else {
        console.error("WebSocket is not connected.");
        showNotification("Failed to send game request.", "rgb(255, 0, 0)");
    }
}




function removeRequestFromUI(requestId) {
    const requestElement = document.querySelector(`.friend-item[data-id="${requestId}"]`);
    if (requestElement) requestElement.remove();
}

function fetchFriends() {
    $.ajax({
        url: '/get_friends/', 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.friends.length > 0) {
                displayFriends('friends-list-content', data);
            } else {
                displayEmpty('friends-list-content');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function displayFriends(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.friends.forEach(friend => {
        let statusClass = '';
        let statusText = '';
        if (friend.is_ingame) {
            statusClass = 'ingame-status';
            statusText = data.translations.ingame;
        } else if (friend.is_online) {
            statusClass = 'online-status';
            statusText = data.translations.online;
        } else {
            statusClass = 'offline-status';
            statusText = data.translations.offline;
        }
        container.innerHTML += `
            <div class="friend-item" data-id="${friend.userid}" data-username="${friend.username}">
                <div class="profile-picture-container">
                    <img src="${friend.userPfp}" alt="${friend.username}" class="friend-image">
                    <div class="${statusClass}">
                        <div class="status-tooltip">${statusText}</div>
                    </div>
                </div>
                <div class="friend-info">
                    <div>${friend.username}</div>
                </div>
                <i class="bi bi-chat icon-chat small-icons" data-id="${friend.id}"></i>
                <i class="bi bi-controller icon-controller small-icons" data-id="${friend.id}"></i>
                <i class="bi bi-x-circle icon-block small-icons" data-id="${friend.id}"></i>
            </div>
        `;  
        });
}  

function fetchOutgoingRequests() {
    $.ajax({
        url: '/get_outgoing_requests/', 
        method: 'GET',
        dataType: 'json',
        success: function(waiting_requests) {
            if (waiting_requests.length > 0) {
                displayRequests('outgoingRequestsTabContent', waiting_requests, 'outgoing');
            } else {
                displayEmpty('outgoingRequestsTabContent');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function fetchIncomingRequests() {
$.ajax({
    url: '/get_incoming_requests/', 
    method: 'GET',
    dataType: 'json',
    success: function(waiting_requests) {
        if (waiting_requests.length > 0) {
            displayRequests('incomingRequestsTabContent', waiting_requests, 'incoming');
        } else {
            displayEmpty('incomingRequestsTabContent');
        }
    },
    error: function(xhr, status, error) {
        console.error(error);
    }
});
}

function fetchBlockedContacts() {
    $.ajax({
        url: '/get_block_list/', 
        method: 'GET',
        dataType: 'json',
        success: function(block_list) {
            if (block_list.length > 0) {
                displayBlocked('blockedTabContent', block_list);
            } else {
                displayEmpty('blockedTabContent');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}



function displayRequests(containerId, requests, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    requests.forEach(request => {
        let actionIcons = '';
        if (type === 'incoming') {
            actionIcons = `
                <i class="bi bi-check-circle accept-request small-icons" data-id="${request.userid}"></i>
                <i class="bi bi-x-circle decline-request small-icons" data-id="${request.userid}"></i>
            `;
        }
        container.innerHTML += `
            <div class="friend-item" data-id="${request.userid}">
                <img src="${request.userPfp}" alt="${request.username}" class="friend-image">
                <div class="friend-info">
                    <div>${request.username}</div>
                </div>
                ${actionIcons}
            </div>
        `;
    });
}    

function displayBlocked(containerId, blocked) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    blocked.forEach(block => {
        container.innerHTML += `
            <div class="friend-item" data-id="${block.userid}">
                <img src="${block.userPfp}" alt="${block.username}" class="friend-image">
                <div class="friend-info">
                    <div>${block.username}</div>
                </div>
                <i class="bi bi-x-circle icon-unblock small-icons" data-id="${block.uesrid}"></i>
            </div>
        `;
    });
}    

function displayEmpty(containerId) {
    $.ajax({
        url: '/get_empty_translate/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const container = document.getElementById(containerId);
            container.innerHTML = `<div style='color: red;'>${data.translations.empty}</div>`;
        }
    });
}


document.addEventListener('authenticated', function() {
    fetchAllData();

    function fetchAllData() {
        fetchFriends();
        fetchOutgoingRequests();
        fetchIncomingRequests();
        fetchBlockedContacts();
    }

    function acceptFriendRequest(requestId, username) {
        removeRequestFromUI(requestId);
    
        $.ajax({
            url: '/accept_friend_request/',
            method: 'GET',
            data: { 'friend_userId': requestId },
            success: function(response) {
                if (response.status == 'success') {
                    fetchIncomingRequests();
                    fetchFriends();
                    fetchFriendsList();
                    showNotification(response.message, "rgb(81, 171, 81)");
                    switchOrCreateChatDiv(requestId, username)
                }
                else {
                    showNotification(response.message, "rgb(168, 64, 64)");
                }
            },
            error: function(xhr, status, error) {
                let response = xhr.responseJSON;
                if (response && response.message) {
                    showNotification(response.message, "rgb(168, 64, 64)");
                } else {
                    showNotification("An unexpected error occurred.", "rgb(168, 64, 64)");
                }
            }
        });
    }
    
    function declineFriendRequest(requestId, username) {
        removeRequestFromUI(requestId);
    
        $.ajax({
            url: '/decline_friend_request/',
            method: 'GET',
            data: { 'friend_userId': requestId },
            success: function(data) {
                fetchIncomingRequests();
                showNotification("Friend request declined", "rgb(168, 64, 64)");
            }
        });
    }
    
    function unblockBlockedUser(requestId){
        $.ajax({
            url: '/unblock_friend/',
            method : 'GET',
            data : {'friend_userId' : requestId},
            success: function(data){
                showNotification("User unblocked", "rgb(81, 171, 81)");
                fetchBlockedContacts();
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('accept-request')) {
			const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			if (requestId) {
				acceptFriendRequest(requestId, username);
			}
            fetchFriends();
		}
		else if (event.target.classList.contains('decline-request')) {
			const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			if (requestId) {
                declineFriendRequest(requestId,username);
			}
        }
		else if (event.target.classList.contains('icon-unblock')) {
            const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
            unblockBlockedUser(requestId);
        }
		else if (event.target.classList.contains('icon-controller')) {
            const friendItem = event.target.closest('.friend-item');
            const friendId = friendItem.getAttribute('data-id');
            const friendUsername = friendItem.getAttribute('data-username');
    
            document.querySelector('.nav-button.play').click();
    
            createPrivateGame(true, function(roomId) {
                sendGameInvite(friendId, friendUsername, roomId);
            });
        }
		else if (event.target.classList.contains('icon-block')) {
            const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
            const FriendUserId = friendItem ? friendItem.getAttribute('data-id') : null;
            if (userId) {
                showConfirmBlockModal(FriendUserId, username);
            }
            else {
                console.error("User ID not found.");
            }
        }
        if (event.target.classList.contains('chats-item')) {
            const iconChat = event.target.querySelector('.icon-chat');
            if (iconChat) {
                iconChat.click();
            }
        }
        if (event.target.classList.contains('icon-chat')) {
            const Friend = event.target.closest('.friend-item');
            const Chat = event.target.closest('.chats-item');
            let isFriend;
            if (Friend)
                isFriend = Friend;
            else if (Chat)
                isFriend = Chat;

            if (isFriend) {
                const friendId = isFriend.getAttribute('data-id');
                const friendName = isFriend.getAttribute('data-username');
                if (friendId && !(currentChatContext === 'private' && currentRecipientId === friendId)) {
                    currentChatContext = 'private';
                    currentRecipientId = friendId;
                    switchOrCreateChatDiv(friendId, friendName, 1);
                    messageWith("set", friendName);
                }
            }

        } else if (event.target.closest('.global-chat-item')) {
            currentChatContext = 'global';
            currentRecipientId = null;
            openGlobalChat();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {

        var friendTabs = document.querySelectorAll('.friend-tab-button');
    
        function fetchOutgoingRequests() {
            $.ajax({
                url: '/get_outgoing_requests/', 
                method: 'GET',
                dataType: 'json',
                success: function(waiting_requests) {
                    if (waiting_requests.length > 0) {
                        displayRequests('outgoingRequestsTabContent', waiting_requests, 'outgoing');
                    } else {
                        displayEmpty('outgoingRequestsTabContent');
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    
    function fetchIncomingRequests() {
        $.ajax({
            url: '/get_incoming_requests/', 
            method: 'GET',
            dataType: 'json',
            success: function(waiting_requests) {
                if (waiting_requests.length > 0) {
                    displayRequests('incomingRequestsTabContent', waiting_requests, 'incoming');
                } else {
                    displayEmpty('incomingRequestsTabContent');
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }
    
        function fetchBlockedContacts() {
            $.ajax({
                url: '/get_block_list/', 
                method: 'GET',
                dataType: 'json',
                success: function(block_list) {
                    if (block_list.length > 0) {
                        displayBlocked('blockedTabContent', block_list);
                    } else {
                        displayEmpty('blockedTabContent');
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    
    
    
        function displayRequests(containerId, requests, type) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            requests.forEach(request => {
                let actionIcons = '';
                if (type === 'incoming') {
                    actionIcons = `
                        <i class="bi bi-check-circle accept-request small-icons" data-id="${request.userid}"></i>
                        <i class="bi bi-x-circle decline-request small-icons" data-id="${request.userid}"></i>
                    `;
                }
                container.innerHTML += `
                    <div class="friend-item" data-id="${request.userid}">
                        <img src="${request.userPfp}" alt="${request.username}" class="friend-image">
                        <div class="friend-info">
                            <div>${request.username}</div>
                        </div>
                        ${actionIcons}
                    </div>
                `;
            });
        }    
    
        function displayBlocked(containerId, blocked) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            blocked.forEach(block => {
                container.innerHTML += `
                    <div class="friend-item" data-id="${block.userid}">
                        <img src="${block.userPfp}" alt="${block.username}" class="friend-image">
                        <div class="friend-info">
                            <div>${block.username}</div>
                        </div>
                        <i class="bi bi-x-circle icon-unblock small-icons" data-id="${block.uesrid}"></i>
                    </div>
                `;
            });
        }    
    
        function displayEmpty(containerId) {
            $.ajax({
                url: '/get_empty_translate/',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    const container = document.getElementById(containerId);
                    container.innerHTML = `<div style='color: red;'>${data.translations.empty}</div>`;
                }
            });
        }
    
        friendTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var contentId = this.id + 'Content';
                var contentDiv = document.getElementById(contentId);
                var isCurrentlyOpen = this.classList.contains('active-tab');
                
                function fetchTabData(tabId) {
                    switch(tabId) {
                        case 'friendsTab':
                            fetchFriends();
                            break;
                        case 'outgoingRequestsTab':
                            fetchOutgoingRequests();
                            break;
                        case 'incomingRequestsTab':
                            fetchIncomingRequests();
                            break;
                        case 'blockedTab':
                            fetchBlockedContacts();
                            break;
                        default:
                            console.error('Unknown tab');
                    }
                }
    
                friendTabs.forEach(function(t) {
                    t.classList.remove('active-tab');
                    var content = document.getElementById(t.id + 'Content');
                    if (content) {
                        content.style.display = 'none';
                    }
                    t.querySelector('.arrow-icon').classList.toggle('arrow-up', false);
                });
    
                if (!isCurrentlyOpen) {
                    this.classList.add('active-tab');
                    this.querySelector('.arrow-icon').classList.add('arrow-up');
                    if (contentDiv) {
                        contentDiv.style.display = 'block';
                        fetchTabData(this.id);
                    }
                }
            });
        });
    });
    function showConfirmBlockModal(userId,username) {
        $.ajax({
            url: '/get_block_translate/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const modalHtml = `
                <div id="confirmBlockModal" class="modal-overlay">
                    <div class="modal-content">
                        <h3>${data.translations.block}</h3>
                        <p>${data.translations.block_txt}</p>
                        <div class="modal-buttons">
                            <button id="btnConfirmBlock" class="modal-button modal-button-add">${data.translations.yes_btn}</button>
                            <button id="btnCancelBlock" class="modal-button modal-button-cancel">${data.translations.no_btn}</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            addModalEventListeners(userId, username);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function addModalEventListeners(userId, username) {
        document.getElementById('btnConfirmBlock').addEventListener('click', function() {
            $.ajax({
                url: '/block_friend/',
                method: 'GET',
                data: { 'friend_userId': userId },
                success: function(data) {
                    fetchFriends();
                    fetchBlockedContacts();
                    showNotification("User Blocked", "rgb(168, 64, 64");
                    removeModal('confirmBlockModal');
                }
            });
        });
        document.getElementById('btnCancelBlock').addEventListener('click', function() {
            document.getElementById('confirmBlockModal').remove();
        });
    }
    

    function blockUser(userId) {
        let userImage = 'static/assets/pfp.png';
        let userName = 'Blocked User';
        updateUI('delete', 'friendsContainer', userId);
        const blockedUserHTML = `
            <div class="friend-item" data-id="${userId}">
                <img src="${userImage}" alt="${userName}" class="friend-image">
                <div class="friend-info">
                    <div>${userName}</div>
                </div>
                <i class="bi bi-x-circle icon-unblock small-icons" data-id="${userId}"></i>
            </div>
        `;
        updateUI('add', 'blockedTabContent', blockedUserHTML);
        updateUI('delete', null, 'confirmBlockModal', true);
        showNotification("User blocked", "rgb(168, 64, 64)");
    }
    

    function removeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.parentNode.removeChild(modal);
    }

});

function switchOrCreateChatDiv(chatId, chatName, switchTab = null) {
    let chatDiv = document.querySelector(`.chat-messages[data-id='${chatId}']`);
    if (!chatDiv) {
        chatDiv = document.createElement('div');
        chatDiv.className = 'chat-messages';
        chatDiv.dataset.id = chatId;
        chatDiv.dataset.username = chatName;
        chatDiv.style.display = 'none';

        document.querySelector('.chat-tab').insertBefore(chatDiv, document.querySelector('.message-input-area'));
    }

    if (switchTab) {
        document.querySelectorAll('.chat-messages').forEach(chatDiv => {
            chatDiv.style.display = 'none';
        });
        chatDiv.style.display = 'block';
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
}



document.addEventListener('DOMContentLoaded', function() {

    var friendTabs = document.querySelectorAll('.friend-tab-button');

    friendTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var contentId = this.id + 'Content';
            var contentDiv = document.getElementById(contentId);
            var isCurrentlyOpen = this.classList.contains('active-tab');
            
            function fetchTabData(tabId) {
                switch(tabId) {
                    case 'friendsTab':
                        fetchFriends();
                        break;
                    case 'outgoingRequestsTab':
                        fetchOutgoingRequests();
                        break;
                    case 'incomingRequestsTab':
                        fetchIncomingRequests();
                        break;
                    case 'blockedTab':
                        fetchBlockedContacts();
                        break;
                    default:
                        console.error('Unknown tab');
                }
            }

            friendTabs.forEach(function(t) {
                t.classList.remove('active-tab');
                var content = document.getElementById(t.id + 'Content');
                if (content) {
                    content.style.display = 'none';
                }
                t.querySelector('.arrow-icon').classList.toggle('arrow-up', false);
            });

            if (!isCurrentlyOpen) {
                this.classList.add('active-tab');
                this.querySelector('.arrow-icon').classList.add('arrow-up');
                if (contentDiv) {
                    contentDiv.style.display = 'block';
                    fetchTabData(this.id);
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.refresh-icon').addEventListener('click', function() {
        fetchFriends();
    });
});