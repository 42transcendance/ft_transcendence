

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
                    // window.location.reload();
                    fetchUserSettings().then(() => {
                        fetchUserData(userId);
                        fetchFriendsList();
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
        success: function(response) {
            showNotification("Language has been changed !", "rgb(81, 171, 81)");
            updateTranslationsInDOM(response.translations, "settings");
        },
        error: function(xhr, status, error) {
            console.error(error);
            showNotification("Error encountered while changing language.", "rgb(168, 64, 64)"); 
        }
    });
}

function updateLanguageModal(tab){
    let selectedLanguage = document.getElementById('selectLanguage').value;
    $.ajax({
        url: '/change_language/',
        method: 'GET',
        data: { 'language': selectedLanguage },
        success: function(response) {
            updateTranslationsInDOM(response.translations, tab);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function updateTranslationsInDOM(translations, arg=null) {
    // switch(arg) {
    //     case 'chat':
    //         document.getElementById('socialText').textContent = translations.social;
    //         document.getElementById('button1').textContent = translations.friends;
    //         document.getElementById('button2').textContent = translations.chats;
    //         document.getElementById('friendsList').textContent = translations.frds;
    //         document.getElementById('outgoingRequestsTab').textContent = translations.out_req;
    //         document.getElementById('incomingRequestsTab').textContent = translations.inc_req;
    //         document.getElementById('blockedTab').textContent = translations.blocked;
    //         document.getElementById('glo_cha').textContent = translations.glo_cha;
    //         document.getElementById('social-text').textContent = `${translations.messages}: ${translations.genchat}`;
    //         document.getElementById('send-button').textContent = translations.send;
    //         break;
    //     case 'settings':
    //         document.getElementById('settingsText').textContent = translations.settings;
    //         document.getElementById('username-labelId').textContent = translations.user_name;
    //         document.getElementById('change-username-button').textContent = translations.change;
    //         document.getElementById('language-label').textContent = translations.language;
    //         document.getElementById('enVal').textContent = translations.en;
    //         document.getElementById('frVal').textContent = translations.fr;
    //         document.getElementById('itVal').textContent = translations.it;
    //         // document.getElementById('changeLanguageButton').textContent = translations.change;
    //         document.getElementById('logout-button').textContent = translations.logout;
    //         break;
    //     case 'profile':
    //         document.getElementById('joinedDate').textContent = translations.joined;
    //         document.getElementById('matchesPlayed').textContent = translations.mtch_plyd;
    //         document.getElementById('career-text').textContent = translations.carrer;
    //         break;
    //     case 'game':
    //         document.getElementById('duelId').textContent = translations.duel;
    //         document.getElementById('tournId').textContent = translations.tourn;
    //         document.getElementById('crt_priv').textContent = translations.crt_priv;
    //         document.getElementById('join_priv').textContent = translations.join_priv;
    //         document.getElementById('joinPrivGame').textContent = translations.join;
    //         document.getElementById('waiting-text').textContent = translations.wfo;
    //         break;
    //     default:
    //         break;
    // }
    document.getElementById('socialText').textContent = translations.social;
            document.getElementById('button1').textContent = translations.friends;
            document.getElementById('button2').textContent = translations.chats;
            document.getElementById('friendsList').textContent = translations.frds;
            document.getElementById('outgoingRequestsTab').textContent = translations.out_req;
            document.getElementById('incomingRequestsTab').textContent = translations.inc_req;
            document.getElementById('blockedTab').textContent = translations.blocked;
            document.getElementById('glo_cha').textContent = translations.glo_cha;
            document.getElementById('social-text').textContent = `${translations.messages}: ${translations.genchat}`;
            document.getElementById('send-button').textContent = translations.send;
            document.getElementById('settingsText').textContent = translations.settings;
            document.getElementById('username-labelId').textContent = translations.user_name;
            document.getElementById('change-username-button').textContent = translations.change;
            document.getElementById('language-label').textContent = translations.language;
            document.getElementById('enVal').textContent = translations.en;
            document.getElementById('frVal').textContent = translations.fr;
            document.getElementById('itVal').textContent = translations.it;
            // document.getElementById('changeLanguageButton').textContent = translations.change;
            document.getElementById('logout-button').textContent = translations.logout;
            document.getElementById('joinedDate').textContent = translations.joined;
            document.getElementById('matchesPlayed').textContent = translations.mtch_plyd;
            document.getElementById('career-text').textContent = translations.carrer;
            document.getElementById('duelId').textContent = translations.duel;
            document.getElementById('tournId').textContent = translations.tourn;
            document.getElementById('crt_priv').textContent = translations.crt_priv;
            document.getElementById('join_priv').textContent = translations.join_priv;
            document.getElementById('joinPrivGame').textContent = translations.join;
            document.getElementById('waiting-text').textContent = translations.wfo;
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
// document.querySelector('.change-language-button').addEventListener('click', changeLanguageModal);
document.getElementById('selectLanguage').addEventListener('change', changeLanguageModal);
