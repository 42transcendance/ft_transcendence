

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
            let inputText = document.getElementById('inputNewUsername').value;
            userUsername = document.getElementById('inputNewUsername').value;
            $.ajax({
                url: '/update_username/',
                method: 'GET',
                data: { 'search_term': inputText },
                success: function(data) {
                    document.getElementById('inputNewUsername').value = '';
                    closeModal('modalChangeUsername');
                    showNotification("Username has been changed !", "rgb(81, 171, 81)"); 
                    // document.querySelector('.current-username').textContent = data.username;
                    fetchUserSettings().then(() => {
                        fetchUserData(userId);
                        fetchFriendsList();
                        sendMessage('global.message', `I just changed my username to <b>${userUsername}</b>`);
                    }).catch(error => {
                        console.error('Error fetching user settings:', error);
                    });
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
                    <input type="file" id="inputProfilePicture" accept="image/jpeg" class="modal-input">
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
                    if (file.type !== 'image/jpeg') {
                        showNotification("Please upload a JPG file.", "rgb(168, 64, 64)");
                        return;
                    }
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
                            document.querySelector('.pfp-container .user-pfp').src = response.userPfp ;
                            document.querySelector('.profile-pic').src = response.userPfp || '/static/assets/pfp.png';
                            showNotification("Profile picture has been changed!", "rgb(81, 171, 81)");
                        },
                        error: function(xhr, status, error) {
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
            $.ajax({
                url: 'get_translations',
                method: 'GET',
                success: function(data) {
                    updateText(data.translations);
                }
            });
            showNotification("Language has been changed !", "rgb(81, 171, 81)");
            
        },
        error: function(xhr, status, error) {
            console.error(error);
            showNotification("Error encountered while changing language.", "rgb(168, 64, 64)"); 
        }
    });
}

function updateText(translations) {
    document.querySelector('.social-text').textContent = translations.social;
    document.getElementById('button1').textContent = translations.friends;
    document.getElementById('button2').textContent = translations.chats;
    document.querySelector('.add-friend-button').textContent = translations.add_friend;
    document.getElementById('friendsList').textContent = translations.frds;
    document.getElementById('outgoingRequestsTab').innerHTML = `<i class="bi bi-arrow-bar-right"></i> ${translations.out_req} <i class="bi bi-chevron-down arrow-icon"></i>`;
    document.getElementById('incomingRequestsTab').innerHTML = `<i class="bi bi-arrow-bar-left"></i> ${translations.inc_req} <i class="bi bi-chevron-down arrow-icon"></i>`;
    document.getElementById('blockedTab').innerHTML = `<i class="bi bi-slash-circle"></i> ${translations.blocked} <i class="bi bi-chevron-down arrow-icon"></i>`;
    document.querySelector('.global-chat-item .friend-info div').textContent = translations.glo_cha;
    document.querySelector('#social-text').textContent = translations.messages + ': ' + translations.genchat;
    document.querySelector('.message-input').setAttribute('placeholder', translations.message_ph);
    document.querySelector('.send-button').textContent = translations.send;
    document.querySelector('.settings-heading .social-text').textContent = translations.settings;
    document.querySelector('.username-label').textContent = translations.user_name;
    document.querySelector('.change-username-button').textContent = translations.change;
    document.querySelector('.language-label').textContent = translations.language;
    document.getElementById('selectLanguage').querySelector('option[value="en"]').textContent = translations.en;
    document.getElementById('selectLanguage').querySelector('option[value="fr"]').textContent = translations.fr;
    document.getElementById('selectLanguage').querySelector('option[value="it"]').textContent = translations.it;
    document.querySelector('.logout-button').textContent = translations.logout;
    document.getElementById('profile-pfp').querySelector('img').setAttribute('alt', translations.user_name);
    document.getElementById('joinedDate').textContent = translations.joined;
    document.getElementById('matchesPlayed').textContent = translations.mtch_plyd;
    document.querySelector('.career-text').textContent = translations.fp;
    document.querySelectorAll('.game-container .send-button')[0].textContent = translations.duel;
    document.querySelectorAll('.game-container .send-button')[1].textContent = translations.tourn;
    document.querySelectorAll('.game-container .send-button')[2].textContent = translations.crt_priv;
    document.querySelectorAll('.game-container .send-button')[3].textContent = translations.join_priv;
    document.getElementById('waiting-text').textContent  = translations.wfo;
    document.querySelector('.input-private-game-id').setAttribute('placeholder', translations.privid);
    document.getElementById('joinPrivGame').textContent = translations.join;
    document.getElementById('cancel-game-button').textContent = translations.cancel_game_text;
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
document.getElementById('selectLanguage').addEventListener('change', changeLanguageModal);
