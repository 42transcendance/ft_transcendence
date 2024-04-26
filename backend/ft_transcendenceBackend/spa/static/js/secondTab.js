// SECOND TAB :: PROFILES

function fetchUserData(theUsersId) {
    $.ajax({
        url: '/get_user_details/',
        method: 'GET',
        // data: { 'profile_id': theUsersId },
        dataType: 'json',
        success: function(data) {
            updateProfilePage(data);
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch user details:", error);
        }
    });

    $.ajax({
        url: '/get_game_history/',
        method: 'GET',
        // data: { 'profile_id': theUsersId },
        dataType: 'json',
        success: function(data) {
            if (data.gameHistory && data.gameHistory.length > 0) {
                addGameHistoryItems(data.gameHistory, theUsersId);
            } else {
                displayEmpty('.game-history', '.user-stats');
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch game history:", error);
        }
    });
}

function updateProfilePage(data) {
    document.getElementById('username').textContent = data.user_details.username;
    document.getElementById('userPfp').src = data.user_details.userPfp || 'assets/pfp.png';
    document.getElementById('joinedDate').textContent = `Joined: ${data.user_details.joinedDate}`;
    document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.user_details.gamesPlayed}`;
}

function addGameHistoryItems(gameHistory, theUsersId) {
    const gameHistoryContainer = document.querySelector('.game-history');
    gameHistoryContainer.innerHTML = '<div class="section-heading">Game History</div>';

    gameHistory.forEach(game => {
        addGameHistoryItem(game, gameHistoryContainer, theUsersId);
    });

    updateStatistics(gameHistory, theUsersId);
}

function addGameHistoryItem(game, container, theUsersId) {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item', game.outcome);

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

function displayEmpty(historyContainerSelector, statsContainerSelector) {
    const historyContainer = document.querySelector(historyContainerSelector);
    historyContainer.innerHTML = `
        <div class="section-heading">Game History</div>
        <div class="empty-message">No games played online.</div>
    `;
    historyContainer.classList.add('centered');

    const statsContainer = document.querySelector(statsContainerSelector);
    statsContainer.innerHTML = `
        <div class="section-heading">Statistics</div>
        <div class="empty-message">Need 1 game to see stats.</div>
    `;
    statsContainer.classList.add('centered');
}

function updateStatistics(gameHistory, theUsersId) {
    let totalGames = gameHistory.length;
    let wins = gameHistory.filter(game => game.outcome === 'Win').length;
    let winRate = (totalGames > 0) ? ((wins / totalGames) * 100).toFixed(2) : '0';
    let avgScore = calculateAverageScore(gameHistory, theUsersId);

    const statsContainer = document.querySelector('.user-stats');
    statsContainer.innerHTML = `
        <div class="section-heading">Statistics</div>
        <div class="statistic">Win Rate: ${winRate}%</div>
        <div class="statistic">Average Score: ${avgScore}</div>
    `;
}

function calculateAverageScore(gameHistory, theUsersId) {
    let totalScore = 0;
    gameHistory.forEach(game => {
        if (game.player1_username === theUsersId) {
            totalScore += parseInt(game.score.split('-')[0], 10);
        } else if (game.player2_username === theUsersId) {
            totalScore += parseInt(game.score.split('-')[1], 10);
        }
    });
    let avgScore = (gameHistory.length > 0) ? (totalScore / gameHistory.length).toFixed(2) : '0';
    return avgScore;
}


document.addEventListener('DOMContentLoaded', function() {
    fetchUserData(theUsersId);

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