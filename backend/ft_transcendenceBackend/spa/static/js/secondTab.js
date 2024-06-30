
function  fetchUserData(theUsersId) {
    $.ajax({
        url: '/get_user_details/',
        method: 'GET',
        data: { 'profile_id': theUsersId },
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
        data: { 'profile_id': theUsersId },
        dataType: 'json',
        success: function(data) {
           
            if (data.gameHistory.length > 0) {
                addGameHistoryItems(data.gameHistory, data.currentUser, data.translations);
            } else {
                displayEmptyT(data.translations);
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch game history:", error);
        }
    });
}

function updateProfilePage(data) {
    document.getElementById('username').textContent = data.user_details.username;
    document.getElementById('joinedDate').textContent = `${data.translations.join} ${data.user_details.joinedDate}`;
    document.getElementById('matchesPlayed').textContent = `${data.translations.nb_match} ${data.user_details.gamesPlayed}`;
    const container = document.getElementById('profile-pfp');
    container.innerHTML = '';
    let statusClass = '';
        let statusText = '';
        if (data.user_details.is_ingame) {
            statusClass = 'ingame-status';
            statusText = data.translations.ingame;
        } else if (data.user_details.is_online) {
            statusClass = 'online-status';
            statusText = data.translations.online;
        } else {
            if (data.user_details.myid == data.user_details.userid){
                statusClass = 'online-status';
                statusText = data.translations.online;
            }else {
                statusClass = 'offline-status';
                statusText = data.translations.offline;
            }
            
        }

        container.innerHTML += `
                <div class="profile-picture-container">
                    <img src="${data.user_details.userPfp || 'static/assets/pfp.png'}"alt="User" class="user-pfp">
                    <div class="${statusClass} status-pellet">
                        <div class="status-tooltip">${statusText}</div>
                    </div>
                </div>
        `;

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

function displayEmptyT(translations) {
    const container = document.querySelector('.game-history');
    container.innerHTML = '';
    container.innerHTML = '<div class="section-heading">' + translations.history+ '</div>';
    container.innerHTML += `<div class="empty-message">${translations.history_empty}</div>`;
    container.classList.add('centered');

    const stat = document.querySelector('.user-stats');
    stat.innerHTML = '';
    stat.innerHTML += `  <div class="section-heading">${translations.stats}</div><div class="empty-message">${translations.stats_empty}</div>`;
    stat.classList.add('centered');
}

document.addEventListener('authenticated', function() {
    fetchUserSettings();
});

function fetchUserSettings() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                document.getElementById("selectLanguage").value = data.user_details.language;
                updateProfilePicture(data);
                updateSettingsUsername(data);
                if (data.user_details.userid) {
                    userId = data.user_details.userid;
                    userUsername = data.user_details.username;
                }
                resolve();
            },
            error: function(xhr, status, error) {
                console.error(error);
                reject(error);
            }
        });
    });
}

function updateProfilePicture(data) {
    document.querySelector('.pfp-container .user-pfp').src = data.user_details.userPfp || '/static/assets/default-pfp.png';
    document.querySelector('.profile-pic').src = data.user_details.userPfp;
}
function updateSettingsUsername(data){
    document.querySelector('.current-username').textContent = data.user_details.username;
}

document.addEventListener('authenticated', async function() {
    await initializeChatDivs();
});

async function initializeChatDivs() {
    try {
        const response = await fetch('/get_chat_users/');
        const data = await response.json();

        if (data.chat_users) {
            for (const user of data.chat_users) {
                const userId = user[0];
                const userName = user[1];
                const userPfp = user[2];
                createChatDiv(userId, userName);
                await loadChatHistory(userId, 'private');
            }
        }

        createChatDiv('global', 'Global Chat');
        await loadChatHistory('global', 'global');

    } catch (error) {
        console.error('Error initializing chat divs:', error);
    }
}

async function loadChatHistory(userId, chatType) {
    let requestData = { 'chat_type': chatType };
    if (chatType === 'private') {
        requestData['target_user_id'] = userId;
    }

    try {
        const response = await fetch(`/get_chat_history/?chat_type=${chatType}&target_user_id=${userId}`);
        const data = await response.json();
        if (data.chat_history) {
            const chatMessagesDiv = document.querySelector(`.chat-messages[data-id='${userId}']`);
            updateChatInterface(chatMessagesDiv, data.chat_history);
        }
    } catch (error) {
        console.error('Error fetching chat history:', error);
    }
}

function createChatDiv(userId, userName) {
    let chatDiv = document.querySelector(`.chat-messages[data-id='${userId}']`);
    if (!chatDiv) {
        chatDiv = document.createElement('div');
        chatDiv.className = 'chat-messages';
        chatDiv.setAttribute('data-id', userId);
        chatDiv.setAttribute('data-username', userName);
        chatDiv.style.display = 'none';
        document.querySelector('.chat-tab').insertBefore(chatDiv, document.querySelector('.message-input-area'));
    }
}

async function loadChatItems() {
    try {
        const response = await fetch('/get_chat_users/');
        const data = await response.json();

        if (data.chat_users) {
            const chatsTabContent = document.getElementById('chatsTabContent2');

            for (const user of data.chat_users) {
                const userId = user[0];
                const userName = user[1];
                const userPfp = user[2] ? `data:image/png;base64,${user[2]}` : '/static/assets/default-pfp.png';

                const chatItem = createChatItem(userId, userName, userPfp);
                chatsTabContent.appendChild(chatItem);
            }
        }
    } catch (error) {
        console.error('Error loading chat items:', error);
    }
}

function createChatItem(userId, userName, userPfp) {
    const chatItem = document.createElement('div');
    chatItem.className = 'chats-item';
    chatItem.setAttribute('data-id', userId);
    chatItem.setAttribute('data-username', userName);

    const img = document.createElement('img');
    img.src = userPfp;
    img.alt = userName;
    img.className = 'friend-image';

    const friendInfo = document.createElement('div');
    friendInfo.className = 'friend-info';
    friendInfo.innerHTML = `<div>${userName}</div>`;

    const chatIcon = document.createElement('i');
    chatIcon.className = 'bi bi-chat channels-chat icon-chat';

    chatItem.appendChild(img);
    chatItem.appendChild(friendInfo);
    chatItem.appendChild(chatIcon);

    return chatItem;
}