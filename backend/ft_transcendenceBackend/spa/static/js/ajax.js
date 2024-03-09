document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
    fetchGameHistory();
    fetchGameLocal();

    function fetchUserProfile() {
        fetch('/get-user-data/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        })
            .then(response => {
                updateProfilePage(data.user_data);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchGameHistory() {
        $.ajax({
            url: '/get-game-history/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateGameHistory(data.games);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
    function fetchGameLocal() {
        $.ajax({
            url: '/get_game_local/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateGameLocal(data.games);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
    function updateProfilePage(data) {
        document.getElementById('username').textContent = data.username;
        document.getElementById('userPfp').src = data.profilePictureUrl || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.joinedDate}`;
        document.getElementById('ranking').textContent = `Ranking: ${data.rank}`;
        document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.gamesPlayed}`;
    }

    function updateGameHistory(games) {
        const gameHistoryContainer = document.querySelector('.game-history');
        gameHistoryContainer.innerHTML = '';

        games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.innerHTML = `
                <div class="game-details">
                    <div class="game-opponent">Versus: ${game.opponent}</div>
                    <div class="game-result">${game.date}</div>
                </div>
                <div class="game-info">
                    <div class="game-date">${game.result}</div>
                    <div class="game-score">Score: ${game.score}</div>
                </div>
            `;
            gameHistoryContainer.appendChild(gameItem);
        });
    }
    function updateGameLocal(games) {
        const gameHistoryContainer = document.querySelector('.game-history');
        gameHistoryContainer.innerHTML = '';

        games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = `game-item ${game.result}`;
            gameItem.innerHTML = `
                <div class="game-details">
                    <div class="game-opponent">Versus: ${game.opponent}</div>
                    <div class="game-result">${game.date}</div>
                </div>
                <div class="game-info">
                    <div class="game-date">${game.result}</div>
                    <div class="game-score">Score: ${game.score}</div>
                </div>
            `;
            gameHistoryContainer.appendChild(gameItem);
        });
    }
});
