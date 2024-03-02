

function showNotification(message, color) {
	var notification = document.createElement('div');
	notification.className = 'notification';
	notification.textContent = message;
	notification.style.backgroundColor = color;
	document.body.appendChild(notification);

	// Show the notification
	notification.style.display = 'block';

	// Hide the notification after 2 seconds
	setTimeout(function() {
		notification.style.display = 'none';
		document.body.removeChild(notification);
	}, 2000);
}

function removeRequestFromUI(requestId) {
    // Assuming each request container has an ID or a way to uniquely identify it
    const requestElement = document.querySelector(`.friend-item[data-id="${requestId}"]`);
    if (requestElement) requestElement.remove();
}

function acceptFriendRequest(requestId) {
    // Optimistically update the UI
    removeRequestFromUI(requestId);
    showNotification("Friend request accepted", "rgb(81, 171, 81)");

    // Attempt to send the accept request to the server
    fetch('/api/friend-request/accept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: requestId }),
    })
    .then(response => {
        if (!response.ok) {
            // Handle response error (optional)
            console.error('Request failed', response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Additional actions upon successful server response (if needed)
        console.log('Request accepted:', data);
    })
    .catch(error => {
        // Handle network error
        console.error('Network error:', error);
    });
}

function declineFriendRequest(requestId) {
    console.log(`Declining friend request with ID: ${requestId}`);

    // Simulate backend response and remove the request from UI
    fetch('/api/declineFriendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: requestId }),
    })
    .then(response => {
        if (response.ok) {
            console.log("Friend request declined successfully");
            removeRequestFromUI(requestId); // Assuming you have a function to remove the request from the UI
            showNotification("Friend request declined", "rgb(168, 64, 64)"); // Display a notification for the declined request
        } else {
            console.error("Failed to decline friend request");
        }
    })
    .catch(error => console.error('Error:', error));

    removeRequestFromUI(requestId);
    showNotification("Friend request declined", "rgb(168, 64, 64)"); // Red color for decline
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
        fetch('/api/friends')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayFriends('friendsTabContent', data);
                } else {
                    displayEmpty('friendsTabContent');
                }
            })
            .catch(error => console.error('Error fetching friends:', error));
    }

    function fetchOutgoingRequests() {
        fetch('/api/friend-requests/outgoing')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayRequests('outgoingRequestsTabContent', data, 'outgoing');
                } else {
                    displayEmpty('outgoingRequestsTabContent');
                }
            })
            .catch(error => console.error('Error fetching outgoing requests:', error));
    }

    function fetchIncomingRequests() {
        fetch('/api/friend-requests/incoming')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayRequests('incomingRequestsTabContent', data, 'incoming');
                } else {
                    displayEmpty('incomingRequestsTabContent');
                }
            })
            .catch(error => console.error('Error fetching incoming requests:', error));
    }

    function fetchBlockedContacts() {
        fetch('/api/friends/blocked')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayBlocked('blockedTabContent', data);
                } else {
                    displayEmpty('blockedTabContent');
                }
            })
            .catch(error => console.error('Error fetching blocked contacts:', error));
    }

    function displayFriends(containerId, friends) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="friend-item">
                    <img src="${friend.image}" alt="${friend.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${friend.name}</div>
                    </div>
                    <i class="bi bi-chat icon-chat small-icons"></i>
                    <i class="bi bi-controller icon-controller small-icons"></i>
                    <i class="bi bi-x-circle icon-block small-icons"></i>
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
                    <i class="bi bi-check-circle accept-request" data-id="${request.id}" small-icons></i>
                    <i class="bi bi-x-circle decline-request" data-id="${request.id} small-icons"></i>
                `;
            }
            container.innerHTML += `
                <div class="friend-item">
                    <img src="${request.image}" alt="${request.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${request.name}</div>
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
                <div class="friend-item">
                    <img src="${block.image}" alt="${block.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${block.name}</div>
                    </div>
                    <i class="bi bi-x-circle icon-unblock small-icons" data-block-id="${block.id}"></i>
                </div>
            `;
        });
    }

    function displayEmpty(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div style='color: red;'>Empty</div>`;
    }

    // Handling click events for controller and block icons using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('accept-request')) {
			const friendItem = event.target.closest('.friend-item');
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			console.log("Accepting request with ID: " + requestId);
			if (requestId) {
				acceptFriendRequest(requestId);
			}
		}
		else if (event.target.classList.contains('decline-request')) {
			const friendItem = event.target.closest('.friend-item');
			const requestId = friendItem ? friendItem.getAttribute('data-id') : null;
			console.log("Declining request with ID: " + requestId);
			if (requestId) {
                declineFriendRequest(requestId);
			}
        }
		else if (event.target.classList.contains('icon-unblock')) {
            // Logic to unblock user here...
            showNotification("User unblocked", "rgb(81, 171, 81)"); // Green color
        }
		else if (event.target.classList.contains('icon-controller')) {
            showNotification("Invitation Sent", "rgb(81, 171, 81)"); // Green color
        }
		if (event.target.classList.contains('icon-block')) {
            const friendItem = event.target.closest('.friend-item');
            const userId = friendItem ? friendItem.getAttribute('data-id') : null;
            if (userId) {
                showConfirmBlockModal(userId);
            }
            else {
                console.error("User ID not found.");
            }
        }
    });

    function unblockModal(blockIcon) {
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
        addModalEventListeners(blockIcon);
    }

    function showConfirmBlockModal(userId) {
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
        addModalEventListeners(userId);
    }

    function addModalEventListeners(userId) {
        document.getElementById('btnConfirmBlock').addEventListener('click', function() {
            document.getElementById('confirmBlockModal').remove();
            blockUser(userId);
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
    

    function removeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.parentNode.removeChild(modal);
    }

});