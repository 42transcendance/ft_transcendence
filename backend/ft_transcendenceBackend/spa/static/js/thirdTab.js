function fetchGameHistory(userId = '') {
    const url = userId ? `/api/user/${userId}/game-history` : '/api/user/game-history';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            addGameHistoryItems(data.gameHistory);
        })
        .catch(error => console.error('Error:', error));
}
function addGameHistoryItems(gameHistory) {
    const gameHistoryContainer = document.querySelector('.game-history');
    gameHistory.forEach(game => {
        addGameHistoryItem(game, gameHistoryContainer);
    });
}

function addGameHistoryItem(game, container) {
    const gameItem = document.createElement('div');
    gameItem.className = 'game-item ' + game.outcome; // Using template literal for class
    gameItem.innerHTML = `
        <div class="game-details">
            <div class="game-opponent">Versus: ${game.opponent}</div>
            <div class="game-result">${game.date}</div>
        </div>
        <div class="game-info">
            <div class="game-date">${game.outcome}</div>
            <div class="game-score">Score: ${game.score}</div>
        </div>
    `;
    container.appendChild(gameItem);
}


function fetchUserProfile(userId = '') {
    console.log("we here");
    const url = userId ? `/get_user_details/${userId}/` : '/get_user_details/';
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            updateProfilePage(data);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
    document.getElementById('username').textContent = "changed";
    document.getElementById('userPfp').src = 'assets/pfp.png';
    document.getElementById('joinedDate').textContent = `Joined: 00/00/0000`;
}

function updateProfilePage(data) {
    document.getElementById('username').textContent = data.user_details.username;
    document.getElementById('userPfp').src = data.user_details.userPfp || 'assets/pfp.png';
    document.getElementById('joinedDate').textContent = `Joined: ${data.user_details.joinedDate}`;
}


document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
    fetchGameHistory();
});

////

// friends list 3rd container, profile page

document.addEventListener('DOMContentLoaded', function() {
    fetchFriendsList();

    function fetchFriendsList() {
        $.ajax({
            url: '/api/user/friends-list',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                addFriendsListItems(data.friendsList);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function addFriendsListItems(friendsList) {
        const friendsListContainer = document.querySelector('.friends-list-content');
        friendsListContainer.innerHTML = '';
    
        friendsList.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.classList.add('friend-item3');
            friendItem.innerHTML = `
                <img src="${friend.profilePictureUrl || 'assets/pfp.png'}" alt="${friend.nickname}'s Profile Picture" class="friend-image">
                <div class="friend-info">
                    <div class="friend-nickname" data-user-id="${friend.id}">${friend.nickname}</div>
                </div>
                <i class="bi bi-person icon-friend-profile"></i>
            `;
    
            // friendItem.addEventListener('click', () => {
            //     const theUsersId = friendItem.querySelector('.friend-nickname').getAttribute('user-id');
            //     console.log("opening friend profile");
            //     fetchUserProfile(theUsersId);
            //     fetchGameHistory(theUsersId);
            // });
    
            friendsListContainer.appendChild(friendItem);
        });
    }
    
});

document.addEventListener('DOMContentLoaded', function() {
    const friendsListContainer = document.querySelector('.friends-list-content');

    friendsListContainer.addEventListener('click', function(event) {
        const friendItem = event.target.closest('.friend-item3');

        if (friendItem) {
            const userId = friendItem.querySelector('.friend-nickname').getAttribute('data-user-id');
            if (userId) {
                console.log("Opening friend profile for user ID:", userId);
                fetchUserProfile(userId);
                fetchGameHistory(userId);
            }
        }
    });
});


///



