function showDuelForm() {
    var duelForm = document.getElementById('duel-form');
    duelForm.style.visibility = 'visible';
    removeTournamentForm();
    removeWinningMessage();
}

function showTournamentForm() {
    removeTournamentForm();
    createTournamentForm();
    var tournamentForm = document.getElementById('tournament-form');
    var tournamentInputContainer = document.getElementById('tournament-input-container');

    var addPlayerButtonContainer = createPlayerButtonContainer();
    tournamentInputContainer.appendChild(addPlayerButtonContainer);

    function createPlayerButtonContainer() {
        var container = document.createElement('div');
        container.className = 'grid-item';

        var addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'add-player-button';
        addButton.textContent = '+';
        addButton.addEventListener('click', addPlayerInput);

        container.appendChild(addButton);

        return container;
    }
    tournamentForm.style.visibility = 'visible';
    var duelForm = document.getElementById('duel-form');
    duelForm.style.visibility = 'hidden';
    removeWinningMessage() ;
}

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

function removeTournamentForm(){
    var tournamentInputContainer = document.getElementById('tournament-game-form');
    var tournamentForm = document.getElementById('tournament-form');
    if (tournamentInputContainer){
        tournamentForm.removeChild(tournamentInputContainer);
    }
}

function startDuelGame() {
    var player1Input = document.getElementById('player1');
    var player2Input = document.getElementById('player2');

    var player1Name = player1Input.value.trim();
    var player2Name = player2Input.value.trim();
    player1Input.value = '';
    player2Input.value = '';


    if (player1Name !== '' && player2Name !== '' && player1Name !== player2Name) {
        document.getElementById('duel-form').style.visibility = 'hidden';

        Pong = new Game(920, 600, player1Name, player2Name);
        hideButtons();

        var placeholderCanvas = document.getElementById('gameCanvas');
        placeholderCanvas.style.visibility = 'visible';
        var gameContainer = document.getElementById('pong-container');
        gameContainer.replaceChild(Pong.canvas, placeholderCanvas);

        Pong.canvas.width = gameContainer.clientWidth;
        Pong.canvas.height = gameContainer.clientHeight;

        Pong.start();

        checkGameState(Pong);
        
    } else {
        alert('Please enter different names for both players.');
    }
}
function checkGameState(Pong) {
    const intervalId = setInterval(() => {
        if (Pong.over) {
            endGameDuel(Pong);
            clearInterval(intervalId);
        }
    }, 1000);
}

function endGameDuel(Pong){
    showButtons();
    hideCanvas();
    winningMsg(Pong);
}

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
    console.log(players);
    winningMsgTournament(Pong);
    if (players[i+1] && players[i+2]){
        annonceNextMatch(players[i+1], players[i+2], players);
    }else{
        players = shuffleArray(players);
        annonceNextMatch(players[0],players[1],players);
    }
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

document.addEventListener('DOMContentLoaded', function () {
    var duelButton = document.querySelector('#button-container button');
    duelButton.addEventListener('click', showDuelForm);

    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    tournamentButton.addEventListener('click', showTournamentForm);

    var startGameButton = document.querySelector('#duel-form button');
    startGameButton.addEventListener('click', startDuelGame);

});

function addPlayerInput() {
    var tournamentInputContainer = document.getElementById('tournament-input-container');
    var playerCount = tournamentInputContainer.querySelectorAll('.player-input').length;

    if (playerCount < 8) {
        var newPlayerLabel = document.createElement('label');
        newPlayerLabel.textContent = 'Player ' + (playerCount + 1) + ':';

        var newPlayerInput = document.createElement('input');
        newPlayerInput.type = 'text';
        newPlayerInput.className = 'player-input';
        newPlayerInput.name = 'player' + (playerCount + 1);
        newPlayerInput.required = true;

        var newPlayerButtonContainer = createPlayerButtonContainer();

        var playerInputContainer = document.createElement('div');
        playerInputContainer.className = 'grid-item';
        playerInputContainer.appendChild(newPlayerLabel);
        playerInputContainer.appendChild(newPlayerInput);

        tournamentInputContainer.replaceChild(playerInputContainer, tournamentInputContainer.lastElementChild);
        tournamentInputContainer.appendChild(newPlayerButtonContainer);

        if (playerCount === 7) {
            newPlayerButtonContainer.style.display = 'none';
        }
    }
}

function createPlayerButtonContainer() {
    var container = document.createElement('div');
    container.className = 'grid-item';

    var addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-player-button';
    addButton.textContent = '+';
    addButton.addEventListener('click', addPlayerInput);

    container.appendChild(addButton);

    return container;
}

function createTournamentForm() {
    var form = document.createElement("form");
    form.id = "tournament-game-form";

    var inputContainer = document.createElement("div");
    inputContainer.id = "tournament-input-container";
    inputContainer.className = "grid-container";

    for (var i = 1; i <= 3; i++) {
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";

        var label = document.createElement("label");
        label.setAttribute("for", "player" + i);
        label.textContent = "Player " + i + ":";

        var input = document.createElement("input");
        input.type = "text";
        input.className = "player-input";
        input.name = "player" + i;
        input.required = true;

        gridItem.appendChild(label);
        gridItem.appendChild(input);

        inputContainer.appendChild(gridItem);
    }

    var startButton = document.createElement("button");
    startButton.type = "button";
    startButton.textContent = "Start Tournament";
    startButton.style.left = "35%";
    startButton.style.position = "relative";
    startButton.addEventListener('click', startTournament);

    form.appendChild(inputContainer);
    form.appendChild(startButton);

    document.getElementById("tournament-form").appendChild(form);
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