// friends list 3rd container, profile page

document.addEventListener('DOMContentLoaded', function() {
    fetchFriendsList();

    function fetchFriendsList() {
        $.ajax({
            url: '/friends-list/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                addFriendsListItems3(data.friendsList);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function addFriendsListItems3(friendsList) {
        const friendsListContainer = document.querySelector('.friends-list-content');
        friendsListContainer.innerHTML = '';
    
        friendsList.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.classList.add('friend-item3');
            friendItem.innerHTML = `
                <img src="${friend.userPfp || 'assets/pfp.png'}" alt="${friend.username}'s Profile Picture" class="friend-image">
                <div class="friend-info">
                    <div class="friend-nickname" data-user-id="${friend.id}">${friend.username}</div>
                </div>
                <i class="bi bi-person icon-friend-profile"></i>
            `;
    
            friendsListContainer.appendChild(friendItem);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const friendsListContainer = document.querySelector('.friends-list-content');

    friendsListContainer.addEventListener('click', function(event) {
        const friendItem = event.target.closest('.friend-item3');

        if (friendItem) {
            const theUser = friendItem.querySelector('.friend-nickname').getAttribute('data-user-id');
            if (theUser) {
                console.log("Opening friend profile for user ID:", theUser);
                // fetchUserProfile(userId);
                // fetchGameHistory(userId);
                fetchUserData(theUser);

            }
        }
    });
});


///



