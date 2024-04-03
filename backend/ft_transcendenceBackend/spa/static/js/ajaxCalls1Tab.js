function updateUI(action, containerId, contentOrId, isId = false) { //used to remove and add profiles in friends/requests/blocked
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
	var notification = document.createElement('div');
	notification.className = 'notification';
	notification.textContent = message;
	notification.style.backgroundColor = color;
	document.body.appendChild(notification);

	notification.style.display = 'block';

	setTimeout(function() {
		notification.style.display = 'none';
		document.body.removeChild(notification);
	}, 2000);
}

function removeRequestFromUI(requestId) {
    const requestElement = document.querySelector(`.friend-item[data-id="${requestId}"]`);
    if (requestElement) requestElement.remove();
}


function handleWebSocketMessage(data) {
    switch(data.type) {
        case 'friend_request_accepted':
            removeRequestFromUI(data.requestId);
            
            // Create HTML content for the new friend
            const newFriendHTML = `
                <div class="friend-item" data-id="${data.friendInfo.id}">
                    <img src="${data.friendInfo.image}" alt="${data.friendInfo.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${data.friendInfo.name}</div>
                    </div>
                    <i class="bi bi-chat icon-chat small-icons" data-id="${data.friendInfo.id}"></i>
                    <i class="bi bi-controller icon-controller small-icons" data-id="${data.friendInfo.id}"></i>
                    <i class="bi bi-x-circle icon-block small-icons" data-id="${data.friendInfo.id}"></i>
                </div>
            `;
            updateUI('add', 'friendsTabContent', newFriendHTML);
            break;
        case 'friend_request_declined':
            // Remove the request from UI
            removeRequestFromUI(data.requestId);
            break;
        // Add more cases as needed
    }
}

function loadChatWithFriend(friendId) {
    console.log("start here");    
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.innerHTML = '';

    // Fetch chat history
    fetch(`/api/chat/history/${friendId}`)
    .then(response => response.json())
        .then(data => {
            //  'data' is array of message objects
            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message');
                messageElement.innerHTML = `
                    <span class="nickname">${message.sender}</span>
                    <div class="message-content">
                        <div class="message-text">${message.text}</div>
                        <span class="message-time">${message.time}</span>
                    </div>
                `;
                chatMessagesContainer.appendChild(messageElement);
            });
        })
        .catch(error => console.error('Failed to load chat history:', error));
        console.log("done here");
}



document.addEventListener('DOMContentLoaded', function() {
    fetchAllData();

    function fetchAllData() {
        fetchFriends();
        fetchOutgoingRequests();
        fetchIncomingRequests();
        fetchBlockedContacts();
    }

    function fetchFriends() {
        $.ajax({
            url: '/get_friends/', 
            method: 'GET',
            dataType: 'json',
            success: function(friends) {
                if (friends.length > 0) {
                    displayFriends('friendsTabContent', friends);
                } else {
                    displayEmpty('friendsTabContent');
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
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

    function displayFriends(containerId, friends) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="friend-item" data-id="${friend.userid}">
                    <img src="${friend.userPfp}" alt="${friend.username}" class="friend-image">
                    <div class="friend-info">
                        <div>${friend.username}</div>
                    </div>
                    <i class="bi bi-chat icon-chat small-icons" data-id="${friend.userid}"></i>
                    <i class="bi bi-controller icon-controller small-icons" data-id="${friend.userid}"></i>
                    <i class="bi bi-x-circle icon-block small-icons" data-id="${friend.userid}"></i>
                </div>
            `;  
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
        const container = document.getElementById(containerId);
        container.innerHTML = `<div style='color: red;'>Empty</div>`;
    }

    function acceptFriendRequest(requestId, username) {
        removeRequestFromUI(requestId);
    
        $.ajax({
            url: '/accept_friend_request/',
            method: 'GET',
            data: { 'friend_username': username },
            success: function(data) {
                fetchIncomingRequests();
                fetchFriends();
                showNotification("Friend request accepted", "rgb(81, 171, 81)");
            }
        });
    }
    
    function declineFriendRequest(requestId,username) {
        removeRequestFromUI(requestId);
    
        $.ajax({
            url: '/decline_friend_request/',
            method: 'GET',
            data: { 'friend_username': username },
            success: function(data) {
                fetchIncomingRequests();
                showNotification("Friend request declined", "rgb(168, 64, 64)");
            }
        });
    }
    
    function unblockBlockedUser(username){
        $.ajax({
            url: '/unblock_friend/',
            method : 'GET',
            data : {'friend_username' : username},
            success: function(data){
                showNotification("User unblocked", "rgb(81, 171, 81)");
                fetchBlockedContacts();
            }
        });
    }

    // Handling click events for icons using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('accept-request')) {
			const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			console.log("Accepting request with ID: " + requestId);
			if (requestId) {
				acceptFriendRequest(requestId, username);
			}
		}
		else if (event.target.classList.contains('decline-request')) {
			const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			console.log("Declining request with ID: " + requestId + username);
			if (requestId) {
                declineFriendRequest(requestId,username);
			}
        }
		else if (event.target.classList.contains('icon-unblock')) {
            const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
            unblockBlockedUser(username);
        }
		else if (event.target.classList.contains('icon-controller')) {
            showNotification("Invitation Sent", "rgb(81, 171, 81)"); // Green color
        }
		else if (event.target.classList.contains('icon-block')) {
            const friendItem = event.target.closest('.friend-item');
            const usernameElement = friendItem.querySelector('.friend-info > div');
            const username = usernameElement.textContent.trim();
            const userId = friendItem ? friendItem.getAttribute('data-id') : null;
            if (userId) {
                showConfirmBlockModal(userId,username);
            }
            else {
                console.error("User ID not found.");
            }
        }
        if (event.target.classList.contains('icon-chat')) {
            const isChannel = event.target.closest('.channel-item');
            const isFriend = event.target.closest('.friend-item');
    
            if (isFriend) {
                const friendId = isFriend.getAttribute('data-id');
                if (friendId && !(currentChatContext === 'private' && currentRecipientId === friendId)) {
                    currentChatContext = 'private';
                    currentRecipientId = friendId;
                    console.log(`Opening chat with friend ID: ${friendId}`);
                    loadChatWithFriend(friendId);
                }
            }
            if (isChannel) {
                const channelId = isChannel.getAttribute('data-id');
                if (channelId && !(currentChatContext === 'channel' && currentRecipientId === channelId)) {
                    currentChatContext = 'channel';
                    currentRecipientId = channelId;
                    console.log(`Opening chat with channel ID: ${channelId}`);
                    openChannelChat(channelId);
                }
            }
        }
        else if (event.target.closest('.global-chat-item')) {
            if (currentChatContext === 'global') {
                console.log("Global chat is already open.");
                return; // Exit if the global chat is already being displayed
            }
            currentChatContext = 'global';
            currentRecipientId = null;
            console.log(`Opening chat with global: `);
            openGlobalChat();
        };
    });

    // function unblockModal(blockIcon) {
    //     const modalHtml = `
    //         <div id="confirmBlockModal" class="modal-overlay">
    //             <div class="modal-content">
    //                 <h3>Block User</h3>
    //                 <p>Are you sure you want to block this user?</p>
    //                 <div class="modal-buttons">
    //                     <button id="btnConfirmBlock" class="modal-button modal-button-add">Yes</button>
    //                     <button id="btnCancelBlock" class="modal-button modal-button-cancel">No</button>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
        
    //     document.body.insertAdjacentHTML('beforeend', modalHtml);
    //     addModalEventListeners(blockIcon);
    // }

    function showConfirmBlockModal(userId,username) {
        const modalHtml = `
            <div id="confirmBlockModal" class="modal-overlay">
                <div class="modal-content">
                    <h3>Block User</h3>
                    <p>Are you sure you want to block this user?</p>
                    <div class="modal-buttons">
                        <button id="btnConfirmBlock" class="modal-button modal-button-add">Yes</button>
                        <button id="btnCancelBlock" class="modal-button modal-button-cancel">No</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        addModalEventListeners(userId, username);
    }

    function addModalEventListeners(userId, username) {
        document.getElementById('btnConfirmBlock').addEventListener('click', function() {
            $.ajax({
                url: '/block_friend/',
                method: 'GET',
                data: { 'friend_username': username },
                success: function(data) {
                    fetchFriends();
                    fetchBlockedContacts();
                    showNotification("User Blocked", "rgb(168, 64, 64"); // Red color
                    removeModal('confirmBlockModal');
                }
            });
        });
        document.getElementById('btnCancelBlock').addEventListener('click', function() {
            document.getElementById('confirmBlockModal').remove();
        });
    }
    

    function blockUser(userId) {
        console.log(`Blocking user: ${userId}`);
        //placeholder
        let userImage = '/assets/pfp.png';
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
        //  DATA. IMPLEMENTED

        // const blockedUserHTML = `
        //     <div class="friend-item" data-id="${userId}">
        //         <img src="${data.userImage}" alt="${data.userName}" class="friend-image">
        //         <div class="friend-info">
        //             <div>${data.userName}</div>
        //         </div>
        //         <i class="bi bi-x-circle icon-unblock" data-id="${userId}"></i>
        //     </div>
        // `;

        updateUI('add', 'blockedTabContent', blockedUserHTML);
        updateUI('delete', null, 'confirmBlockModal', true);
        showNotification("User blocked", "rgb(168, 64, 64)");
        //after connectiong to backend
        // fetch('/api/block-user', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ userId: userId })
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     updateUI('delete', 'friendsContainer', userId);
        //     const blockedUserHTML = `
        //         <div class="friend-item" data-id="${userId}">
        //             <img src="${data.userImage}" alt="${data.userName}" class="friend-image">
        //             <div class="friend-info">
        //                 <div>${data.userName}</div>
        //             </div>
        //             <i class="bi bi-x-circle icon-unblock" data-id="${userId}"></i>
        //         </div>
        //     `;
        //     updateUI('add', 'blockedContainer', blockedUserHTML);
        //     updateUI('delete', null, 'confirmBlockModal', true);
        //     showNotification("User blocked", "rgb(168, 64, 64)");
        // })
        // .catch(error => {
        //     console.error('Error blocking user:', error);
        // });
    }
    

    function removeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.parentNode.removeChild(modal);
    }

});