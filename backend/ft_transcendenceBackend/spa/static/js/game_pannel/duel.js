function startDuelGame() {
    var player1Input = document.getElementById('player1');
    var player2Input = document.getElementById('player2');

    var player1Name = player1Input.value.trim();
    var player2Name = player2Input.value.trim();
    player1Input.value = '';
    player2Input.value = '';


    if (player1Name !== '' && player2Name !== '' && player1Name !== player2Name) {
        document.getElementById('duel-form').style.visibility = 'hidden';

        Pong = new Game();
        hideButtons();

        Pong.start();

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