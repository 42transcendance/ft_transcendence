function startDuelGame() {
    var player1Input = document.getElementById('player1');
    var player2Input = document.getElementById('player2');

    var player1Name = player1Input.value.trim();
    var player2Name = player2Input.value.trim();
    player1Input.value = '';
    player2Input.value = '';


    if (player1Name !== '' && player2Name !== '' && player1Name !== player2Name) {
        document.getElementById('duel-form').style.visibility = 'hidden';

        Pong = new Game(player1Name, player2Name);
        hideButtons();

        var placeholderCanvas = document.getElementById('gameCanvas');
        placeholderCanvas.style.visibility = 'visible';
        var gameContainer = document.getElementById('pong-container');
        gameContainer.replaceChild(Pong.canvas, placeholderCanvas);

        Pong.connect();

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