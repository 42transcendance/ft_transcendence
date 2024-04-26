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
            console.log(data.gameHistory);
            if (data.gameHistory.length > 0) {
                addGameHistoryItems(data.gameHistory, data.currentUser, data.translations);
            } else {
                displayEmpty('.game-history', '.user-stats', data.translations);
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

function addGameHistoryItem(game, container, translations) {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item');
    gameItem.classList.add(game.outcome);
    let printoutcome;
    if (game.outcome === 'Win'){
        printoutcome = translations.win;
    }
    else{
        printoutcome = translations.defeat;
    }

    gameItem.innerHTML = `
        <div class="game-details">
            <div class="game-opponent">${translations.vs} ${game.opponent}</div>
            <div class="game-date">${game.date}</div>
        </div>
        <div class="game-info">
            <div class="game-result">${printoutcome}</div>
            <div class="game-score">${translations.score} ${game.score}</div>
        </div>
    `;
    container.appendChild(gameItem);
}

function addGameHistoryItems(gameHistory, currentUser, translations) {
    const gameHistoryContainer = document.querySelector('.game-history'); 
    gameHistoryContainer.innerHTML = '<div class="section-heading">' + translations.history+ '</div>';

    gameHistory.forEach(game => {
        addGameHistoryItem(game, gameHistoryContainer, translations);
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
    <div class="section-heading">${translations.stats}</div>
        <div class="donut-chart-container">
            <svg width="200" height="200">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#ddd" stroke-width="15"></circle>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#4CAF50" stroke-width="15" stroke-dasharray="${greenLength} ${redLength}" transform="rotate(-90 100 100)"></circle>
                <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="26">${winRate}%</text>
            </svg>
        </div>
        <div class="avg-score">${translations.avg} <span style="color: ${avgScoreColor(avgScore)};">${avgScore}</span></div>
        <div class="win-streak">${translations.win_str}  <span style="color: ${winStreakColor(winStreak)};">${winStreak}</span></div>
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

function displayEmpty(historycontainer, statcontainer, translations) {
    const container = document.querySelector(historycontainer);
    container.innerHTML = '<div class="section-heading">' + translations.history+ '</div>';
    container.innerHTML += `<div class="empty-message">${translations.history_empty}</div>`;
    container.classList.add('centered');

    const stat = document.querySelector(statcontainer);
    stat.innerHTML += `  <div class="section-heading">${translations.stats}</div><div class="empty-message">${translations.stats_empty}</div>`;
    stat.classList.add('centered');
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