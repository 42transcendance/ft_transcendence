// Function to check if a modal is already present
function isModalPresent(modalId) {
    return document.getElementById(modalId) !== null;
}

// ADD FRIEND
function showAddFriendModal() {
    if (isModalPresent('modalAddFriend')) return;

    const modalHtml = `
        <div id="modalAddFriend" class="modal-overlay">
            <div class="modal-content">
                <h3>Add Friend</h3>
                <p>Add a friend to your friend list</p>
                <input type="text" placeholder="Enter username" id="inputFriendUsername" class="modal-input">
                <div class="modal-buttons">
                    <button id="btnAddFriend" class="modal-button modal-button-add">Add</button>
                    <button id="btnCancelAddFriend" class="modal-button modal-button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnCancelAddFriend').addEventListener('click', () => closeModal('modalAddFriend'));
    document.getElementById('btnAddFriend').addEventListener('click', function() {
        let inputText = document.getElementById('inputFriendUsername').value;;
        $.ajax({
            url: '/send_friend_request/',
            method: 'GET',
            data: { 'search_term': inputText },
            success: function() {
                document.getElementById('inputFriendUsername').value = '';
                closeModal('modalAddFriend');
                showNotification("Friend request sent !", "rgb(81, 171, 81)");
                fetchOutgoingRequests();
            },
            error: function(xhr, status, error) {
                console.error(error);
                showNotification("Friend not found", "rgb(168, 64, 64)"); 
            }
        });
    });
}

// CREATE CHANNEL
function showCreateChannelModal() {
    if (isModalPresent('modalCreateChannel')) return;

    const modalHtml = `
        <div id="modalCreateChannel" class="modal-overlay">
            <div class="modal-content">
                <h2>Create Channel</h2>
                <p>Set up your new channel</p>
                <input type="text" placeholder="Channel Name" id="inputChannelName" class="modal-input">
                <div class="threeChanOptions">
                    <div class="radio-option">
                        <input type="radio" id="private" name="channelType" value="private">
                        <label for="private">Private</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="public" name="channelType" value="public" checked>
                        <label for="public">Public</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="protected" name="channelType" value="protected">
                        <label for="protected">Protected</label>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button id="btnCreateChannel" class="modal-button modal-button-add">Create</button>
                    <button id="btnCancelCreateChannel" class="modal-button modal-button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnCancelCreateChannel').addEventListener('click', () => closeModal('modalCreateChannel'));
}

// JOIN CHANNEL
function showJoinChannelModal() {
    if (isModalPresent('modalJoinChannel')) return;

    const modalHtml = `
        <div id="modalJoinChannel" class="modal-overlay">
            <div class="modal-content">
                <h2>Join Channel</h2>
                <p>Enter the channel name or ID to join</p>
                <input type="text" placeholder="Channel Name or ID" id="inputChannelId" class="modal-input">
                <div class="modal-buttons">
                    <button id="btnJoinChannel" class="modal-button modal-button-add">Join</button>
                    <button id="btnCancelJoinChannel" class="modal-button modal-button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnCancelJoinChannel').addEventListener('click', () => closeModal('modalJoinChannel'));
}

// CHANGE NICKNAME
function showChangeUsernameModal() {
    if (isModalPresent('modalChangeUsername')) return;

    const modalHtml = `
        <div id="modalChangeUsername" class="modal-overlay">
            <div class="modal-content">
                <h2>Change Username</h2>
                <p>Enter your new username</p>
                <input type="text" placeholder="New Username" id="inputNewUsername" class="modal-input">
                <div class="modal-buttons">
                    <button id="btnChangeUsername" class="modal-button modal-button-add">Change</button>
                    <button id="btnCancelChangeUsername" class="modal-button modal-button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnCancelChangeUsername').addEventListener('click', () => closeModal('modalChangeUsername'));
    document.getElementById('btnChangeUsername').addEventListener('click', function() {
        let inputText = document.getElementById('inputNewUsername').value;;
        console.log("click");
        $.ajax({
            url: '/update_username/',
            method: 'GET',
            data: { 'search_term': inputText },
            success: function() {
                document.getElementById('inputNewUsername').value = '';
                closeModal('modalChangeUsername');
                showNotification("Username has been changed !", "rgb(81, 171, 81)"); 
                location.reload();
            },
            error: function(xhr, status, error) {
                document.getElementById('inputNewUsername').value = '';
                closeModal('modalChangeUsername');
                showNotification("New username unvailble", "rgb(168, 64, 64)"); 
            }
        });
    });
    
}

function showLogoutModal() {
    if (isModalPresent('modalLogout')) return;

    const modalHtml = `
        <div id="modalLogout" class="modal-overlay">
            <div class="modal-content">
                <h3>Logout</h3>
                <p>Are you sure you want to logout?</p>
                <div class="modal-buttons">
                    <button id="btnConfirmLogout" class="modal-button modal-button-add">Yes</button>
                    <button id="btnCancelLogout" class="modal-button modal-button-cancel">No</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnConfirmLogout').addEventListener('click', function() {
        window.location.href = "/logout";
    });
    document.getElementById('btnCancelLogout').addEventListener('click', () => closeModal('modalLogout'));
}


// DELETE ACCOUNT
function showDeleteAccountModal() {
    if (isModalPresent('modalDeleteAccount')) return;

    const modalHtml = `
        <div id="modalDeleteAccount" class="modal-overlay">
            <div class="modal-content">
                <h3>Delete Account</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div class="modal-buttons">
                    <button id="btnConfirmDeleteAccount" class="modal-button modal-button-add">Yes</button>
                    <button id="btnCancelDeleteAccount" class="modal-button modal-button-cancel">No</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btnCancelDeleteAccount').addEventListener('click', () => closeModal('modalDeleteAccount'));
}

// Closing modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.parentNode.removeChild(modal);
    }
}

// Event Listeners
document.querySelector('.add-friend-button').addEventListener('click', showAddFriendModal);
document.querySelector('.create-channel-button').addEventListener('click', showCreateChannelModal);
document.querySelector('.join-channel-button').addEventListener('click', showJoinChannelModal);
document.querySelector('.change-username-button').addEventListener('click', showChangeUsernameModal);
document.querySelector('.logout-button').addEventListener('click', showLogoutModal);
document.querySelector('.delete-account-button').addEventListener('click', showDeleteAccountModal);

