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
    function updateProfilePage(data) {

        document.getElementById('username').textContent = data.user_details.username;
        document.getElementById('userPfp').src = data.user_details.userPfp || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.user_details.joinedDate}`;
        document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.user_details.gamesPlayed}`;
    }

    function fetchGameHistory() {
        $.ajax({
            url: '/get_game_history/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.gameHistory.length > 0) {
                    addGameHistoryItems(data.gameHistory, data.currentUser);
                } else {
                    displayEmpty('.game-history', '.user-stats');
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function displayEmpty(historycontainer, statcontainer) {
        const container = document.querySelector(historycontainer);
        container.innerHTML = '<div class="section-heading">Game History</div>';
        container.innerHTML += `<div class="empty-message">No game played online.</div>`;
        container.classList.add('centered');

        const stat = document.querySelector(statcontainer);
        stat.innerHTML += `  <div class="section-heading">Statistics</div><div class="empty-message">Need 1 game to see stats.</div>`;
        stat.classList.add('centered');
    }



    function addGameHistoryItems(gameHistory, currentUser) {
        const gameHistoryContainer = document.querySelector('.game-history'); 
        gameHistoryContainer.innerHTML = '<div class="section-heading">Game History</div>';

        gameHistory.forEach(game => {
            addGameHistoryItem(game, gameHistoryContainer);
        });

        let totalGames = gameHistory.length;
        let wins = gameHistory.filter(game => game.outcome === 'Win').length;
        let losses = totalGames - wins;
        let winRate = (totalGames > 0) ? ((wins / totalGames) * 100).toFixed(2) : 0;
        let lossRate = 100 - winRate;

        let greenLength = (winRate / 100) * (2 * Math.PI * 70);
        let redLength = (lossRate / 100) * (2 * Math.PI * 70);

        let totalScore = 0;
        for (let i = 0; i < gameHistory.length; i++) {
            const game = gameHistory[i];
            if (game.player1_username === currentUser) {
                totalScore += parseInt(game.score.split('-')[0]);
            } else if (game.player2_username === currentUser) {
                totalScore += parseInt(game.score.split('-')[1]);
            }
        }  

        let avgScore = (totalGames > 0) ? (totalScore / totalGames).toFixed(2) : 0;

        let winStreak = 0;
        for (let i = 0; i < gameHistory.length; i++) {
            if (gameHistory[i].outcome === 'Win') {
                winStreak++;
            } else {
                break;
            }
        }

        const statsContainer = document.querySelector('.user-stats');
        statsContainer.innerHTML = `
        <div class="section-heading">Statistics</div>
            <div class="donut-chart-container">
                <svg width="200" height="200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#ddd" stroke-width="15"></circle>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#4CAF50" stroke-width="15" stroke-dasharray="${greenLength} ${redLength}" transform="rotate(-90 100 100)"></circle>
                    <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="26">${winRate}%</text>
                </svg>
            </div>
            <div class="avg-score">Average Score: <span style="color: ${avgScoreColor(avgScore)};">${avgScore}</span></div>
            <div class="win-streak">Win Streak: <span style="color: ${winStreakColor(winStreak)};">${winStreak}</span></div>
        `;
    }


    function avgScoreColor(avgScore) {
        let red = 255 * (1 - avgScore / 5);
        let green = 255 * (avgScore / 5);

        let redHex = Math.round(red).toString(16).padStart(2, '0');
        let greenHex = Math.round(green).toString(16).padStart(2, '0');

        return `#${redHex}${greenHex}00`;
    }

    function winStreakColor(winStreak) {
        if (winStreak === 0) {
            return 'black';
        } else {
            let green = Math.round((winStreak / 15) * 255);
            return `rgb(0, ${green}, 0)`;
        }
    }
    function addGameHistoryItem(game, container) {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.classList.add(game.outcome);

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
                if (data.user_details.userid) {
                    console.log("HEREEEEEEEEEEEEEEEEE");
                    userId = data.user_details.userid;
                    userUsername = data.user_details.username;
                }
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
        const container = document.getElementById('chatsTabContent');
        container.innerHTML = '';
        channels.forEach(channel => {
            const channelElement = `
                <div class="chats-item">
                    <img src="${channel.image || 'assets/pfp.png'}" alt="${channel.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${channel.name}</div>
                    </div>
                    <i class="bi bi-chat chats-icon"></i>
                    <i class="bi bi-gear chats-icon"></i>
                </div>
            `;
            container.innerHTML += channelElement;
        });

        if (channels.length === 0) {
            container.innerHTML = '<div style="color: red;">No channels found</div>';
        }
    }
});
