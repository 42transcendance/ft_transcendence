

function isModalPresent(modalId) {
    return document.getElementById(modalId) !== null;
}

// ADD FRIEND
function showAddFriendModal() {
    if (isModalPresent('modalAddFriend')) return;

    $.ajax({
        url: '/get_translate_add_friend/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const modalHtml = `
            <div id="modalAddFriend" class="modal-overlay">
                <div class="modal-content">
                    <h3>${data.translations.add_friends}</h3>
                    <p>${data.translations.add_text}</p>
                    <input type="text" placeholder="${data.translations.username}" id="inputFriendUsername" class="modal-input">
                    <div class="modal-buttons">
                        <button id="btnAddFriend" class="modal-button modal-button-add">${data.translations.add_btn}</button>
                        <button id="btnCancelAddFriend" class="modal-button modal-button-cancel">${data.translations.cnl_btn}</button>
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
                showNotification(xhr.responseJSON.message, "rgb(168, 64, 64)");
            }
        });
         });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
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

    $.ajax({
        url: '/get_change_username_translate/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const modalHtml = `
            <div id="modalChangeUsername" class="modal-overlay">
                <div class="modal-content">
                    <h2>${ data.translations.change_usr}</h2>
                    <p>${data.translations.usr_text}</p>
                    <input type="text" placeholder="${data.translations.username}" id="inputNewUsername" class="modal-input">
                    <div class="modal-buttons">
                        <button id="btnChangeUsername" class="modal-button modal-button-add">${data.translations.change_btn}</button>
                        <button id="btnCancelChangeUsername" class="modal-button modal-button-cancel">${data.translations.cnl_btn}</button>
                    </div>
                </div>
            </div>
        `;
    
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('btnCancelChangeUsername').addEventListener('click', () => closeModal('modalChangeUsername'));
        document.getElementById('btnChangeUsername').addEventListener('click', function() {
            let inputText = document.getElementById('inputNewUsername').value;;
            userUsername = document.getElementById('inputNewUsername').value;
            $.ajax({
                url: '/update_username/',
                method: 'GET',
                data: { 'search_term': inputText },
                success: function() {
                    document.getElementById('inputNewUsername').value = '';
                    closeModal('modalChangeUsername');
                    showNotification("Username has been changed !", "rgb(81, 171, 81)"); 
                    fetchUserProfile();
                    fetchUserSettings();
                },
                error: function(xhr, status, error) {
                    document.getElementById('inputNewUsername').value = '';
                    closeModal('modalChangeUsername');
                    showNotification("New username unvailble", "rgb(168, 64, 64)"); 
                }
            });
        });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
    
}

function showLogoutModal() {
    if (isModalPresent('modalLogout')) return;
    $.ajax({
        url: '/get_logout_translate/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
        const modalHtml = `
            <div id="modalLogout" class="modal-overlay">
                <div class="modal-content">
                    <h3>${data.translations.logout}</h3>
                    <p>${ data.translations.logout_text}</p>
                    <div class="modal-buttons">
                        <button id="btnConfirmLogout" class="modal-button modal-button-add">${data.translations.yes_btn}</button>
                        <button id="btnCancelLogout" class="modal-button modal-button-cancel">${data.translations.no_btn}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('btnConfirmLogout').addEventListener('click', function() {
            window.location.href = "/logout";
        });
        document.getElementById('btnCancelLogout').addEventListener('click', () => closeModal('modalLogout'));

        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}


//CHANGE THE PROFILE PICTURE
function showUploadProfilePictureModal() {

    $.ajax({
        url: '/get_pfp_translate/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const modalHtml = `
            <div id="modalUploadProfilePicture" class="modal-overlay">
                <div class="modal-content">
                    <h3>${data.translations.upload}</h3>
                    <input type="file" id="inputProfilePicture" accept="image/*" class="modal-input">
                    <div class="modal-buttons">
                        <button id="btnUploadPicture" class="modal-button modal-button-add">${data.translations.upload_btn}</button>
                        <button id="btnCancelUpload" class="modal-button modal-button-cancel">${data.translations.cnl_btn}</button>
                    </div>
                </div>
            </div>
            `;
    
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('btnCancelUpload').addEventListener('click', () => closeModal('modalUploadProfilePicture'));
    
        document.getElementById('btnUploadPicture').addEventListener('click', function() {
            const fileInput = document.getElementById('inputProfilePicture');
            const file = fileInput.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('profile_picture', file);
                
                $.ajax({
                    url: '/upload_profile_picture/',
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function(response) {
                        closeModal('modalUploadProfilePicture');
                        showNotification("Profile picture has been changed !", "rgb(81, 171, 81)");
                        fetchUserProfile();
                        fetchUserSettings();
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                        showNotification("Error encountered while uploading a user profile picture.", "rgb(168, 64, 64)"); 
                    }
                });
            }
        });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
   
}

// Function to close the modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Event Listeners
document.querySelector('.user-pfp').addEventListener('click', showUploadProfilePictureModal);
document.querySelector('.add-friend-button').addEventListener('click', showAddFriendModal);
// document.querySelector('.create-channel-button').addEventListener('click', showCreateChannelModal);
// document.querySelector('.join-channel-button').addEventListener('click', showJoinChannelModal);
document.querySelector('.change-username-button').addEventListener('click', showChangeUsernameModal);
document.querySelector('.logout-button').addEventListener('click', showLogoutModal);
document.querySelector('.user-pfp').addEventListener('click', showUploadProfilePictureModal);
