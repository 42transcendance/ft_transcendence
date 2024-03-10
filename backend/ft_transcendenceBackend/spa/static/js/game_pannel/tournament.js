function startTournament(){
    var players = collectPlayerInputs();
    removeTournamentForm();
    if (players !== null){
        tournamentMatchmaking(players);
    }
}


function tournamentMatchmaking(players){
    players= shuffleArray(players);
    annonceNextMatch(players[0], players[1],players);
}

function annonceNextMatch(player1, player2,players){
    hideButtons();
    var message = document.createElement('div');
    message.className = 'annonce-message';
    message.id = 'annonce-message';
    message.style = "position : absolute; top : 50%; margin-left : 35%;";

    message.textContent = "Next match will be " + player1 + " against " + player2 + " .";
    
    var principalContainer = document.getElementById('principal-container');
    principalContainer.appendChild(message);
    var nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.textContent = "Start next match !";
    nextButton.style.left = "40%";
    nextButton.style.position = "relative";
    nextButton.id = "next-match";
    nextButton.addEventListener('click', function() {
        startNextMatch(player1, player2,players);
    });

    document.getElementById('bottom-container').append(nextButton);
}

function startNextMatch(player1Name, player2Name,players){
    var annonceMessage = document.getElementById('annonce-message');
    if (annonceMessage) {
        var principalContainer = document.getElementById('principal-container');
        principalContainer.removeChild(annonceMessage);
    }
    removeWinningMessage();
    var nextButton = document.getElementById('next-match');
    if (nextButton){
        document.getElementById('bottom-container').removeChild(nextButton);
    }
    Pong = new Game(920, 600, player1Name, player2Name);

    var placeholderCanvas = document.getElementById('gameCanvas');
    placeholderCanvas.style.visibility = 'visible';
    var gameContainer = document.getElementById('pong-container');
    gameContainer.replaceChild(Pong.canvas, placeholderCanvas);

    Pong.canvas.width = gameContainer.clientWidth;
    Pong.canvas.height = gameContainer.clientHeight;

    Pong.start();

    checkTournamentState(Pong,players);
}


function checkTournamentState(Pong,players) {
    const intervalId = setInterval(() => {
        if (Pong.over) {
            endTournamentDuel(Pong,players);
            clearInterval(intervalId);
        }
    }, 1000);
}


function endTournamentDuel(Pong,players){
    hideCanvas();
    let remove = Pong.opponent;
    if (Pong.opponent.score === 5)
        remove = Pong.player;
    console.log(remove.name);
    players = players.filter(e => e !== remove.name);
    var i =0;
    for (; i < players.length; i++){
        if (Pong.opponent.name === players[i] || Pong.player.name === players[i])
            break;
    }
    if (players.length === 1){
        showButtons();
        winTheTournament(players[0]);
    }
    else {
        winningMsgTournament(Pong);
        if (players[i+1] && players[i+2]){
            annonceNextMatch(players[i+1], players[i+2], players);
        }else{
            players = shuffleArray(players);
            annonceNextMatch(players[0],players[1],players);
        }
    }
}

function collectPlayerInputs() {
    var players = [];

    var inputContainer = document.getElementById("tournament-input-container");
    var gridItems = inputContainer.getElementsByClassName("grid-item");
    var playerNames = new Set();

    for (var i = 0; i < gridItems.length; i++) {
        var inputField = gridItems[i].querySelector('input');
        if (inputField) {
            var playerName = inputField.value;

            if (playerName.trim() === "") {
                alert("Please enter a name for Player " + (i + 1));
                return null;
            }
            if (playerNames.has(playerName)) {
                alert("Player " + (i + 1) + " cannot have the same username as another player.");
                return null;
            }
            playerNames.add(playerName);
            players.push(playerName);
        }
    }
    return players;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}