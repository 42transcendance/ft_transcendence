function createPrivateGame() {
    Pong = new Game();

    hideButtons();

    Pong.createPrivateGame();

    checkGameState(Pong);
}

function joinPrivateGame(room_id) {
    Pong = new Game();

    hideButtons();

    Pong.joinPrivateGame(room_id);

    checkGameState(Pong);
}

// Event to create a private game
document.addEventListener('DOMContentLoaded', function () {

    var createPrivateGameButton = document.querySelector('.create-private-game-button');
    createPrivateGameButton.addEventListener('click', createPrivateGame);
});

// Function to show and hide the joing private game form
document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('join-private-game-div');
    const joinButton = document.querySelector('.join-private-game-form-button');

    function showPrivateForm() {
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