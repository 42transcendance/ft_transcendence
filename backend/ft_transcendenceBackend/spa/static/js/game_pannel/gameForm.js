function showTournamentForm() {
    $.ajax({
        url: "get_user_details",
        method: "GET",
        success: function(data) {
        removeTournamentForm();
        removeWinTournament();
        createTournamentForm(data);
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
        removeWinningMessage() ;
    },
        error: function(xhr, status, error) {
            console.error("Failed to fetch user details:", error);
        }
    });
    document.addEventListener('click', hideTournamentFormOnClickOutside);
}

function hideTournamentFormOnClickOutside(event) {
    var tournamentForm = document.getElementById('tournament-form');
    if (tournamentForm.style.visibility === 'visible') {
        var tournamentButton = document.querySelectorAll('#button-container button')[1];
        if (!tournamentForm.contains(event.target) && !tournamentButton.contains(event.target)) {
            tournamentForm.style.visibility = 'hidden';
            document.removeEventListener('click', hideTournamentFormOnClickOutside);
        }
    }
}

function removeTournamentForm() {
    var tournamentInputContainer = document.getElementById('tournament-game-form');
    var tournamentForm = document.getElementById('tournament-form');
    if (tournamentInputContainer) {
        tournamentForm.removeChild(tournamentInputContainer);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var tournamentButton = document.querySelectorAll('#button-container button')[1];
    tournamentButton.addEventListener('click', showTournamentForm);

    var duelButton = document.querySelector('#button-container button');
    duelButton.addEventListener('click', startDuelGame);
});

function addPlayerInput() {
    $.ajax({
        url: "tournament_form_translate",
        method: "GET",
        success: function(data) {
            var tournamentInputContainer = document.getElementById('tournament-input-container');
            var playerCount = tournamentInputContainer.querySelectorAll('.player-input').length;
        
            if (playerCount < 8) {
                var newPlayerLabel = document.createElement('label');
                newPlayerLabel.textContent = data.translations.player + (playerCount + 1) + ':';
        
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

    },
        error: function(xhr, status, error) {
            console.error("Failed to fetch user details:", error);
        }
    });
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

function createTournamentForm(data) {
    var form = document.createElement("form");
    form.id = "tournament-game-form";

    var disclaimer = document.createElement("p");
    disclaimer.textContent = data.translations.note;
    disclaimer.style.color = "grey";
    disclaimer.style.fontSize = "0.6em";
    disclaimer.style.textAlign = "center";
    disclaimer.style.fontStyle = "italic";

    form.appendChild(disclaimer);

    var inputContainer = document.createElement("div");
    inputContainer.id = "tournament-input-container";
    inputContainer.className = "grid-container";

    for (var i = 1; i <= 3; i++) {
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";

        var label = document.createElement("label");
        label.setAttribute("for", "player" + i);
        label.textContent = data.translations.player + i + ":";

        var input = document.createElement("input");
        input.type = "text";
        input.className = "player-input";
        input.name = "player" + i;
        input.required = true;
        if (i === 1) {
            input.value = data.user_details.username;
            input.readOnly = true;
            input.style.color = "grey";
        }

        gridItem.appendChild(label);
        gridItem.appendChild(input);

        inputContainer.appendChild(gridItem);
    }

    var ButtonDiv = document.createElement("div");

    var startButton = document.createElement("button");
    ButtonDiv.style.display = "flex";
    ButtonDiv.style.justifyContent = "center";
    ButtonDiv.appendChild(startButton);
    startButton.type = "button";
    startButton.textContent = data.translations.start_tournament;
    startButton.classList = "send-button";
    
    startButton.addEventListener('click', startTournament);

    form.appendChild(inputContainer);
    form.appendChild(ButtonDiv);

    document.getElementById("tournament-form").appendChild(form);
}