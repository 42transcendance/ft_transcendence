
function hideButtons(){
    var duelButton = document.querySelectorAll('#button-container button')[0];
    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    duelButton.style.visibility = 'hidden';
    tournamentButton.style.visibility = 'hidden';
}

function showButtons(){
    var duelButton = document.querySelectorAll('#button-container button')[0];
    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    duelButton.style.visibility = 'visible';
    tournamentButton.style.visibility = 'visible';
}
function hideCanvas() {
    var pongGame = document.getElementById('gameCanvas');
    pongGame.style.visibility = 'hidden';
}

function winningMsg(Pong) {
    var message = document.createElement('div');
    message.className = 'winning-message';
    message.id = 'winning-message';
    message.style = "position : absolute; top : 50%; margin-left : 35%;";

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

    message.textContent = winnerName + ' wins with a score of ' + winnerScore + '-' + loserScore + ' against ' + loserName + '.';
    
    var principalContainer = document.getElementById('principal-container');
    principalContainer.appendChild(message);
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
    let message = document.createElement('div');
    message.className = 'winning-tournament';
    message.id = 'winning-tournament';
    message.style = "position : absolute; top : 40%; margin-left : 35%;";

    message.textContent = winner + " has won the tournament !";
    document.getElementById('principal-container').appendChild(message);
}

function winningMsgTournament(Pong) {
    var message = document.createElement('div');
    message.className = 'winning-message';
    message.id = 'winning-message';
    message.style = "position : absolute; top : 40%; margin-left : 35%;";

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

    message.textContent = winnerName + ' wins with a score of ' + winnerScore + '-' + loserScore + ' against ' + loserName + '.\n';
    document.getElementById('principal-container').appendChild(message);
}