function fetchFriendsList() {
    $.ajax({
        url: '/get_friends/', 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.friends.length > 0) {
                addFriendsListItems3('friends-list-content3', data);
            } else {
                displayEmpty('friends-list-content3'); 
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}
function addFriendsListItems3(containerId, data) {
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
            <div class="friend-item3" data-id="${friend.userid}">
                <div class="profile-picture-container">
                    <img src="${friend.userPfp || 'static/assets/pfp.png'}" alt="${friend.username}'s Profile Picture" class="friend-image">
                    <div class="${statusClass}">
                        <div class="status-tooltip">${statusText}</div>
                    </div>
                </div>
                <div class="friend-info">
                    <div class="friend-nickname" data-user-id="${friend.userid}">${friend.username}</div>
                </div>
                <i class="bi bi-person icon-friend-profile"></i>
            </div>
        `;
    });
}

document.addEventListener('authenticated', function() {
    fetchFriendsList();
});

document.addEventListener('DOMContentLoaded', function() {
    const friendsListContainer = document.querySelector('.friends-list-content3');

    friendsListContainer.addEventListener('click', function(event) {
        const friendItem = event.target.closest('.friend-item3');

        if (friendItem) {
            const theUser = friendItem.querySelector('.friend-nickname').getAttribute('data-user-id');
            if (theUser) {
                fetchUserData(theUser);
            }
        }
    });
});



