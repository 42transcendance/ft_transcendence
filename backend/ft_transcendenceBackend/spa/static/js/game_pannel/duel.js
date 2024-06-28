let Pong = null;

function startDuelGame() {

    if (Pong) {
        Pong = null;
    }

    removeTournamentForm();
    removeWinTournament();
    showCanvas();
    Pong = new Game();
    hideButtons();

    Pong.joinMatchmaking();

    var cancelButton = document.getElementById('cancel-game-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            Pong.endGame();
        });
    }
    
    checkGameState(Pong);
}

function checkGameState(Pong) {
    const intervalId = setInterval(() => {
        if (Pong.over) {
            endGameDuel(Pong);
            clearInterval(intervalId);
        }
    }, 200);
}

function endGameDuel(Pong){
    showButtons();
    hideCanvas();
}