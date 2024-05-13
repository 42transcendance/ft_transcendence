function startDuelGame() {
    Pong = new Game();
    hideButtons();

    Pong.joinMatchmaking();

    checkGameState(Pong);
}

function checkGameState(Pong) {
    const intervalId = setInterval(() => {
        if (Pong.over) {
            console.log("Test");
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