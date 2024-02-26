function showForm() {
    var duelForm = document.getElementById('duel-form');
    duelForm.style.visibility = 'visible';
}

function startDuelGame() {
    var player1Input = document.getElementById('player1');
    var player2Input = document.getElementById('player2');

    var player1Name = player1Input.value.trim();
    var player2Name = player2Input.value.trim();

    if (player1Name !== '' && player2Name !== '' && player1Name !== player2Name) {
        document.getElementById('duel-form').style.visibility = 'hidden';

        Pong = new Game(919, 600, player1Name, player2Name);

        var placeholderCanvas = document.getElementById('gameCanvas');
        var gameContainer = document.getElementById('game-container');
        gameContainer.replaceChild(Pong.canvas, placeholderCanvas);

        Pong.canvas.width = gameContainer.clientWidth;
        Pong.canvas.height = gameContainer.clientHeight;

        Pong.start();
    } else {
        alert('Please enter different names for both players.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var duelButton = document.querySelector('#button-container button');
    duelButton.addEventListener('click', showForm);

    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    tournamentButton.addEventListener('click', showTournamentForm);

    var startGameButton = document.querySelector('#duel-form button');
    startGameButton.addEventListener('click', startDuelGame);

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
});

function showTournamentForm() {
    var tournamentForm = document.getElementById('tournament-form');
    tournamentForm.style.visibility = 'visible';
}

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
