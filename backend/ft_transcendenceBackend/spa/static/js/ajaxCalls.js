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
        stat.innerHTML += `<div class="empty-message">Need 1 game to see stats.</div>`;
        stat.classList.add('centered');
    }

    
    
    function addGameHistoryItems(gameHistory,currentUser) {

        let totalGames = gameHistory.length;
        let wins = gameHistory.filter(game => game.outcome === 'Win').length;
        let losses = totalGames - wins;
        let winRate = (totalGames > 0) ? ((wins / totalGames) * 100).toFixed(2) : 0;
        let lossRate = 100 - winRate;
        
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
        
        // Calculate win streak
        let winStreak = 0;
        for (let i = 0; i < gameHistory.length; i++) {
            if (gameHistory[i].outcome === 'Win') {
                winStreak++;
            } else {
                break;
            }
        }

        // Display the circle
        const statsContainer = document.querySelector('.user-stats');
        statsContainer.innerHTML = `
            <div class="section-heading">Statistics</div>
            <div class="bar" style="position: relative; width: 200px; height: 30px; border: 1px solid #000;">
                <div class="loss" style="position: absolute; top: 0; left: 0; height: 100%; width: ${lossRate}%; background-color: red;"></div>
                <div class="win" style="position: absolute; top: 0; left: ${lossRate}%; height: 100%; width: ${winRate}%; background-color: green;"></div>
                <div class="win-rate-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: black;">${winRate}% Win</div>
            </div>
            <div class="avg-score" style="color: ${avgScoreColor(avgScore)};">Average Score: ${avgScore}</div>
            <div class="win-streak" style="color: ${winStreakColor(winStreak)};">Win Streak: ${winStreak}</div>
        `;
    }
    

    function avgScoreColor(avgScore) {
        if (avgScore >= 3) {
            return 'green';
        } else {
            return 'red';
        }
    }
    
    function winStreakColor(winStreak) {
        if (winStreak === 0) {
            return 'black';
        } else {
            let blue = Math.round((winStreak / 15) * 255);
            return `rgb(0, 0, ${blue})`;
        }
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



