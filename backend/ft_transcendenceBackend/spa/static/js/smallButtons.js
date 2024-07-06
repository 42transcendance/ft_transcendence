document.addEventListener('DOMContentLoaded', function() {
    var controllerIcons = document.querySelectorAll('.icon-controller');
    var blockIcons = document.querySelectorAll('.icon-block');

    controllerIcons.forEach(function(controller) {
        controller.addEventListener('click', function() {
            showNotification("Invitation Sent", "rgb(81, 171, 81)");
        });
    });

    blockIcons.forEach(function(blockIcon) {
        blockIcon.addEventListener('click', function() {
            showConfirmBlockModal();
        });
    });

    function showConfirmBlockModal() {
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
        addModalEventListeners();
    }

    function addModalEventListeners() {
        document.getElementById('btnConfirmBlock').addEventListener('click', function() {
            $.ajax({
                url: '/block_friend/',
                method: 'GET',
                data: { 'friend_userId': userId },
                success: function(data) {
                    showNotification("User Blocked", "rgb(168, 64, 64");
                    removeModal('confirmBlockModal');
                }
            });
            
        });

        document.getElementById('btnCancelBlock').addEventListener('click', function() {
            removeModal('confirmBlockModal');
        });
    }

    function removeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.parentNode.removeChild(modal);
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
});

document.addEventListener('DOMContentLoaded', function() {
    const chatMessagesContainer = document.querySelector('.chat-messages');

    chatMessagesContainer.addEventListener('click', function(event) {
        const target = event.target;

        if (target.closest('.messageIcon')) {
            const parentContainer = target.closest('.nicknameAndIcon');
            if (parentContainer) {
                const senderId = parentContainer.querySelector('.nickname').getAttribute('data-user-id');
                const senderNickname = parentContainer.querySelector('.nickname').textContent;
                handleIconClick(senderId, senderNickname, target);
            }
        }
    });
});

function handleIconClick(senderId, senderNickname, iconElement) {
    switch (iconElement.classList[1]) {
        case 'bi-controller':
            document.querySelector('.nav-button.play').click();

            createPrivateGame(true, function(roomId) {
                sendGameInvite(senderId, senderNickname, roomId);
            });
            break;
        case 'bi-plus-circle':
            addFriend(senderId);
            break;
        case 'bi-person':
            history.pushState(null, null, `#${"profile"}`);
            var chatTab = document.querySelector('.chat-tab');
            var settingsTab = document.querySelector('.settings-tab');
            var profileTab = document.querySelector('.profile-tab');
            var gameTab = document.querySelector('.game-container');

            var firstTab = document.querySelector('.first-tab');
            var secondTab = document.querySelector('.second-tab');
            var thirdTab = document.querySelector('.third-tab');

            const gameContainer = document.getElementById('inner-container2');

            var navButtons = document.querySelectorAll('.nav-button');
            navButtons.forEach(function(button) {
                button.classList.remove('active');
                if (button.getAttribute('data-button') === "profile") {
                    button.classList.add('active');
                }
            });
            gameContainer.style.height = "75vh";
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            profileTab.style.display = 'block';
            gameTab.style.display = 'none';
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, true, 'right-slide-out', 'right-slide-in');
            fetchUserData(senderId);
            break;
        case 'bi-slash-circle':
            blockUser(senderId)
            break;
        default:
            console.error("Unknown icon clicked for user:", senderId);
    }
}

function addFriend(user_id) {
    $.ajax({
        url: '/send_friend_request/',
        method: 'GET',
        data: { 'user_id': user_id},
        success: function() {
            showNotification("Friend request sent to user", "rgb(81, 171, 81)");
        },
        error: function(xhr) {
            showNotification("Failed to send friend request: " + xhr.responseJSON.message, "rgb(168, 64, 64)");
        }
    });
}

function blockUser(senderId) {
    $.ajax({
        url: '/block_friend/',
        method: 'GET',
        data: { 'friend_userId': senderId },
        success: function(data) {
            fetchFriends();
            fetchBlockedContacts();
            showNotification("User Blocked", "rgb(168, 64, 64");
        }
    });
}

function simulateProfileTabClick(senderId) {
    navbarPressed('profile');
    fetchUserData(senderId);

}


// game instructions
function injectBlock() {
    let message = "W and S to play. (+ arrows for tournament).";
    $.ajax({
        url: '/get_notif_translate/',
        method: 'GET',
        data: { 'message': message },
        success: function(data) {
            injectBlock1(data.translations.message);
        }
    });    
}

function injectBlock1(message) {
    if (!document.getElementById('mon-bloc')) {
        var block = document.createElement('div');
        block.id = 'mon-bloc';
        block.className = 'mon-bloc';
        block.textContent = message;

        document.body.insertBefore(block, document.body.firstChild);

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .mon-bloc {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 300px;
                padding: 16px;
                background-color: rgba(255, 255, 255, 0.5);
                border: 1px solid #ff18c5;
                border-radius: 15px;
                text-align: center;
                font-size: 16px;
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

// Function to remove the block
function removeBlock() {
    var block = document.getElementById('mon-bloc');
    if (block) {
        block.parentNode.removeChild(block);
    }
}
