function createPrivateGame(isInvite = false, callback = null) {

    if (Pong) {
        Pong = null;
    }

    removeTournamentForm();
    removeWinTournament();
    showCanvas();
    Pong = new Game();
    hideButtons();

    Pong.createPrivateGame(isInvite);

    if (isInvite) {
        let waitTime = 0;
        const interval = setInterval(() => {
            if (Pong.room_id) {
                clearInterval(interval);
                if (callback) {
                    callback(Pong.room_id);
                }
            } else {
                waitTime += 100;
                if (waitTime >= 5000) {
                    clearInterval(interval);
                    console.error("Failed to get room_id within 5 seconds.");
                }
            }
        }, 100);
    }

    var cancelButton = document.getElementById('cancel-game-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            Pong.endGame();
        });
    }
    checkGameState(Pong);
}


function joinPrivateGame(room_id) {

    if (Pong) {
        Pong = null;
    }

    removeTournamentForm();
    
    
    showCanvas();
    Pong = new Game();
    hideButtons();

    Pong.joinPrivateGame(room_id);

    checkGameState(Pong);
}

document.addEventListener('DOMContentLoaded', function () {
    
    var createPrivateGameButton = document.querySelector('.create-private-game-button');
    createPrivateGameButton.addEventListener('click', function() {
        createPrivateGame(false);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('join-private-game-div');
    const joinButton = document.querySelector('.join-private-game-form-button');

    function showPrivateForm() {
        removeTournamentForm();
        removeWinTournament();
        formContainer.style.visibility = 'visible';
    }

    function hidePrivateForm(event) {
        if (!formContainer.contains(event.target) && !joinButton.contains(event.target)) {
            formContainer.style.visibility = 'hidden';
        }
    }

    joinButton.addEventListener('click', showPrivateForm);

    document.addEventListener('click', hidePrivateForm);
});

function logInputValue() {
    var inputElement = document.querySelector('.input-private-game-id');
    var inputValue = inputElement.value;
    const formContainer = document.getElementById('join-private-game-div');
    
    joinPrivateGame(inputValue);
    formContainer.style.visibility = 'hidden';
}

document.querySelector('.send-button.join').addEventListener('click', logInputValue);