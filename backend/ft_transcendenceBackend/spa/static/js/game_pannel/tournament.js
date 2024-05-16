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
    $.ajax({
        url: "tournament_next_translate",
        method: "GET",
        success: function(data) {
            hideButtons();
            var message = document.createElement('div');
            message.className = 'annonce-message';
            message.id = 'annonce-message';
            message.style = "position : absolute; top : 50%;left: 50%;transform: translateX(-50%);";
        
            message.textContent = data.translations.next + player1 + data.translations.against + player2 + " .";
            
            var principalContainer = document.getElementById('principal-container');
            principalContainer.appendChild(message);
            var nextButton = document.createElement("button");
            nextButton.type = "button";
            nextButton.textContent = data.translations.snm;
            nextButton.style.left = "40%";
            nextButton.style.position = "relative";
            nextButton.id = "next-match";
            nextButton.addEventListener('click', function() {
                startNextMatch(player1, player2,players);
            });
        
            document.getElementById('bottom-container').append(nextButton);
        },
        error: function(xhr, status, error) {
            console.error("Error", error);
        }
    });
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
    Pong = new LocalGame(player1Name, player2Name);

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
                showNotification("Please enter a name for every players.", "rgb(168, 64, 64)"); 
                return null;
            }
            if (playerNames.has(playerName)) {
                showNotification("Two Players cannot have the same username.", "rgb(168, 64, 64)"); 
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