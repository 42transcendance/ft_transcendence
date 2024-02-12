document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
    fetchGameHistory();
    fetchAchievements();

    function fetchUserProfile() {
        // to be replaced with actual API endpoint
        fetch('/api/user/profile') 
            .then(response => response.json())
            .then(data => {
                updateProfilePage(data);
            })
            .catch(error => console.error('Error:', error));
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

    function fetchAchievements() {
        // to be replaced with actual API endpoint
        fetch('/api/user/achievements') 
            .then(response => response.json())
            .then(data => {
                addAchievementItems(data.achievements);
            })
            .catch(error => console.error('Error:', error));
    }

    function updateProfilePage(data) {
        // Replacing keys with actual ones from our API response
        document.getElementById('username').textContent = data.username;
        document.getElementById('userPfp').src = data.profilePictureUrl || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.joinedDate}`;
        document.getElementById('ranking').textContent = `Ranking: ${data.rank}`;
        document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.gamesPlayed}`;
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

    function addAchievementItems(achievements) {
        const achievementsContainer = document.querySelector('.user-achievements'); 

        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.classList.add('achievement-item');

            achievementItem.innerHTML = `
                <img src="${achievement.iconUrl}" alt="Achievement" class="achievement-logo">
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            achievementsContainer.appendChild(achievementItem);
        });
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
