document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
    fetchGameHistory();

    function fetchUserProfile() {
        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateProfilePage(data);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function fetchGameHistory() {
        // to be replaced with actual API endpoint
        fetch('/api/user/game-history') 
            .then(response => response.json())
            .then(data => {
                addGameHistoryItems(data.gameHistory);
            })
            .catch(error => console.error('Error:', error));
    }

    function updateProfilePage(data) {
        // Replacing keys with actual ones from our API response
        document.getElementById('username').textContent = data.user_details.username;
        document.getElementById('userPfp').src = data.user_details.userPfp || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.user_details.joinedDate}`;
        // document.getElementById('ranking').textContent = `Ranking: ${data.rank}`;
        // document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.gamesPlayed}`;
    }

    function addGameHistoryItems(gameHistory) {
        const gameHistoryContainer = document.querySelector('.game-history'); // Ensure you have this container in your HTML

        gameHistory.forEach(game => {
            addGameHistoryItem(game, gameHistoryContainer);
        });
    }

    function addGameHistoryItem(game, container) {
        // Creating a game history item element
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.classList.add(game.outcome); // 'win' or 'lose'

        // Adding game details to the game history item
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
});


// friends list 3rd container, profile page

document.addEventListener('DOMContentLoaded', function() {
    fetchFriendsList();

    function fetchFriendsList() {
        // Replace with our the actual API endpoint
        fetch('/api/user/friends-list') 
            .then(response => response.json())
            .then(data => {
                addFriendsListItems(data.friendsList);
            })
            .catch(error => console.error('Error:', error));
    }

    function addFriendsListItems(friendsList) {
        const friendsListContainer = document.querySelector('.friends-list-content');

        friendsList.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.classList.add('friend-item');

            friendItem.innerHTML = `
                <img src="${friend.profilePictureUrl || 'assets/pfp.png'}" alt="${friend.nickname}'s Name" class="friend-image">
                <div class="friend-info">
                    <div class="friend-nickname">${friend.nickname}</div>
                </div>
                <i class="bi bi-person icon-friend-profile"></i>
            `;
            friendsListContainer.appendChild(friendItem);
        });
    }
});


//Settings tab pfp load

document.addEventListener('DOMContentLoaded', function() {
    fetchUserSettings();

    function fetchUserSettings() {
        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateProfilePicture(data);
                updateSettingsUsername(data);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function updateProfilePicture(data) {
        document.querySelector('.pfp-container .user-pfp').src = data.user_details.userPfp;
        document.querySelector('.profile-pic').src = data.user_details.userPfp;
    }
    function updateSettingsUsername(data){
        document.querySelector('.current-username').textContent = data.user_details.username;
    }
});
//first tab - channels

document.addEventListener('DOMContentLoaded', function() {
    fetchChannels();

    function fetchChannels() {
        fetch('/api/channels') // Adjust
            .then(response => response.json())
            .then(data => displayChannels(data))
            .catch(error => console.error('Error fetching channels:', error));
    }

    function displayChannels(channels) {
        const container = document.getElementById('channelsTabContent');
        container.innerHTML = '';
        channels.forEach(channel => {
            const channelElement = `
                <div class="channel-item">
                    <img src="${channel.image || 'assets/pfp.png'}" alt="${channel.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${channel.name}</div>
                    </div>
                    <i class="bi bi-chat channels-icon"></i>
                    <i class="bi bi-gear channels-icon"></i>
                </div>
            `;
            container.innerHTML += channelElement;
        });

        if (channels.length === 0) {
            container.innerHTML = '<div style="color: red;">No channels found</div>';
        }
    }
});


