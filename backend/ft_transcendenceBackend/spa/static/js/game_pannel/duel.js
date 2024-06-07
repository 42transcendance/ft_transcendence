let Pong = null;

function startDuelGame() {

    if (Pong) {
        Pong = null; // Remove the reference to the old game
    }

    removeTournamentForm();
    removeWinTournament();
    showCanvas();
    Pong = new Game();
    hideButtons();

    Pong.joinMatchmaking();

    checkGameState(Pong);
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
    // winningMsg(Pong);
}