function showForm() {
    console.log("alo ?");
    var duelForm = document.getElementById('duel-form');
    duelForm.style.visibility = 'visible';
}

function startGame() {
    document.getElementById('duel-form').style.visibility = 'hidden';
}

document.addEventListener('DOMContentLoaded', function () {
    var duelButton = document.querySelector('#button-container button');
    duelButton.addEventListener('click', showForm);
});

document.addEventListener('DOMContentLoaded', function () {
    var duelButton = document.querySelector('#button-container button');
    duelButton.addEventListener('click', showForm);

    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    tournamentButton.addEventListener('click', showTournamentForm);

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

function startGame() {
    
}
