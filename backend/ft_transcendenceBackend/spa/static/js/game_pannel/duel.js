function startDuelGame() {
    removeTournamentForm()
    Pong = new Game();
    hideButtons();

    Pong.start();

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
    winningMsg(Pong);
}