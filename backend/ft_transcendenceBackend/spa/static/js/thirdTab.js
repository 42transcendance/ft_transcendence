// friends list 3rd container, profile page

document.addEventListener('DOMContentLoaded', function() {
    fetchFriendsList();

    function fetchFriendsList() {
        $.ajax({
            url: '/get_friends/', 
            method: 'GET',
            dataType: 'json',
            success: function(friends) {
                if (friends.length > 0) {
                    addFriendsListItems3('friendsListContent', friends);
                } else {
                    displayEmpty('friendsTabContent'); 
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    // <div class="friend-item3">
    //     <img src="{% static 'assets/pfp.png' %}" alt="Friend's Name" class="friend-image">
    //     <div class="friend-info">
    //         <div class="friend-nickname" data-user-id="someFriend1">Friend's Name</div>
    //     </div>
    //     <i class="bi bi-person icon-friend-profile"></i>
    // </div>

    // function displayFriends(containerId, friends) {
    //     const container = document.getElementById(containerId);
    //     container.innerHTML = '';
    //     friends.forEach(friend => {
    //         container.innerHTML += `
    //             <div class="friend-item" data-id="${friend.userid}">
    //                 <img src="${friend.userPfp}" alt="${friend.username}" class="friend-image">
    //                 <div class="friend-info">
    //                     <div>${friend.username}</div>
    //                 </div>
    //                 <i class="bi bi-chat icon-chat small-icons" data-id="${friend.id}"></i>
    //                 <i class="bi bi-controller icon-controller small-icons" data-id="${friend.id}"></i>
    //                 <i class="bi bi-x-circle icon-block small-icons" data-id="${friend.id}"></i>
    //             </div>
    //         `;  
    //     });
    // }


    function addFriendsListItems3(containerId, friendsList) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        // const friendsListContainer = document.querySelector('.friends-list-content');
        // friendsListContainer.innerHTML = '';
    
        friendsList.forEach(friend => {
            container.innerHTML += `
                <div class="friend-item3" data-id="${friend.userid}">
                    <img src="${friend.userPfp || 'assets/pfp.png'}" alt="${friend.username}'s Profile Picture" class="friend-image">
                    <div class="friend-info">
                        <div class="friend-nickname" data-user-id="${friend.userid}">${friend.username}</div>
                    </div>
                    <i class="bi bi-person icon-friend-profile"></i>
                </div>
            `;
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



