

function isModalPresent(modalId) {
    return document.getElementById(modalId) !== null;
}

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
                    window.location.reload();
                    
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
                        window.location.reload();
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

function changeLanguageModal(){
    let selectedLanguage = document.getElementById('selectLanguage').value;
    $.ajax({
        url: '/change_language/',
        method: 'GET',
        data: { 'language': selectedLanguage },
        success: function() {
            showNotification("Language has been changed !", "rgb(81, 171, 81)");
            window.location.reload();
        },
        error: function(xhr, status, error) {
            console.error(error);
            showNotification("Error encountered while changing language.", "rgb(168, 64, 64)"); 
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

document.querySelector('.user-pfp').addEventListener('click', showUploadProfilePictureModal);
document.querySelector('.add-friend-button').addEventListener('click', showAddFriendModal);
document.querySelector('.change-username-button').addEventListener('click', showChangeUsernameModal);
document.querySelector('.logout-button').addEventListener('click', showLogoutModal);
document.querySelector('.change-language-button').addEventListener('click', changeLanguageModal);
