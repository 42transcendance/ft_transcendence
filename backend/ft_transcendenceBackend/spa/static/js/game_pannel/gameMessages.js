
function hideButtons(){
    var duelButton = document.querySelectorAll('#button-container button')[0];
    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    var joinPrivateGameButton = document.querySelector('.join-private-game-form-button');
    var createPrivateGameButton = document.querySelector('.create-private-game-button');
    duelButton.style.visibility = 'hidden';
    tournamentButton.style.visibility = 'hidden';
    joinPrivateGameButton.style.visibility = 'hidden';
    createPrivateGameButton.style.visibility = 'hidden';
}

function showButtons(){
    var duelButton = document.querySelectorAll('#button-container button')[0];
    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    var joinPrivateGameButton = document.querySelector('.join-private-game-form-button');
    var createPrivateGameButton = document.querySelector('.create-private-game-button');
    duelButton.style.visibility = 'visible';
    tournamentButton.style.visibility = 'visible';
    joinPrivateGameButton.style.visibility = 'visible';
    createPrivateGameButton.style.visibility = 'visible';
}

function showCanvas() {
    var pongGame = document.getElementById('gameCanvas');
    pongGame.style.visibility = 'visible';
}


function hideCanvas() {
    var pongGame = document.getElementById('gameCanvas');
    pongGame.style.visibility = 'hidden';
}

function winningMsg(Pong) {
    $.ajax({
        url: "tournament_next_translate",
        method: "GET",
        success: function(data) {
            var message = document.createElement('div');
            message.className = 'winning-message';
            message.id = 'winning-message';
            message.style = "position : absolute; top : 50%;left: 50%;transform: translateX(-50%);";
        
            if (Pong.player.score > Pong.opponent.score){
                var winnerName = Pong.player.name;
                var loserName = Pong.opponent.name;
                var winnerScore = Pong.player.score;
                var loserScore = Pong.opponent.score;
            } else {
                var winnerName = Pong.opponent.name;
                var loserName = Pong.player.name;
                var winnerScore = Pong.opponent.score;
                var loserScore = Pong.player.score;
            }
            message.textContent = winnerName + data.translations.next + winnerScore + '-' + loserScore + data.translations.against + loserName + '.';
            
            var principalContainer = document.getElementById('principal-container');
            principalContainer.appendChild(message);
        },
        error: function(xhr, status, error) {
            console.error("Error", error);
        }
    });
   
}

function removeWinningMessage() {
    var winningMessage = document.getElementById('winning-message');
    if (winningMessage) {
        var principalContainer = document.getElementById('principal-container');
        principalContainer.removeChild(winningMessage);
    }
}

function removeWinTournament(){
    var winningMessage = document.getElementById('winning-tournament');
    if (winningMessage) {
        var principalContainer = document.getElementById('principal-container');
        principalContainer.removeChild(winningMessage);
    }
}

function winTheTournament(winner){
    $.ajax({
        url: "tournament_winmsg_translate",
        method: "GET",
        success: function(data) {
            let message = document.createElement('div');
            message.className = 'winning-tournament';
            message.id = 'winning-tournament';
            message.style = "position : absolute; top : 40%; left: 50%;transform: translateX(-50%);color : white;text-shadow: 2px 2px rgb(0, 0, 0);font-size: 1.5em";
        
            message.innerHTML = '<span style="color: #36FF00;">' + winner  + '</span>'+ data.translations.winmsg;
            document.getElementById('principal-container').appendChild(message);
            setTimeout(function() {
                message.remove();
            }, 5000);

    },
        error: function(xhr, status, error) {
            console.error("Error", error);
        }
    });
}

function winningMsgTournament(Pong) {
    $.ajax({
        url: "tournament_win_translate",
        method: "GET",
        success: function(data) {
            var message = document.createElement('div');
            message.className = 'winning-message';
            message.id = 'winning-message';
            message.style = "position : absolute; top : 40%;left: 50%; transform: translateX(-50%);color : white;text-shadow: 2px 2px rgb(0, 0, 0);font-size: 1.3em";

            if (Pong.player.score > Pong.opponent.score){
                var winnerName = Pong.player.name;
                var loserName = Pong.opponent.name;
                var winnerScore = Pong.player.score;
                var loserScore = Pong.opponent.score;
            } else {
                var winnerName = Pong.opponent.name;
                var loserName = Pong.player.name;
                var winnerScore = Pong.opponent.score;
                var loserScore = Pong.player.score;
            }

            message.innerHTML = '<span style="color: #36FF00;">' + winnerName  + '</span>' + data.translations.win + winnerScore + '-' + loserScore + data.translations.against+ '<span style="color: #FF0000;">' +loserName + '</span>.\n';
            document.getElementById('principal-container').appendChild(message);

    },
        error: function(xhr, status, error) {
            console.error("Error", error);
        }
    });
    
}