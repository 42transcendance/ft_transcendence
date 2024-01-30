import * as game from './game.js';
import * as reset from './reset.js';

function displayDuelForm()
{
    reset.resetFunction();
    
    var duelForm = document.getElementById("duelForm");
    duelForm.style.display = "block";

}

var duelButton = document.getElementById('duelButton');
duelButton.addEventListener('click', displayDuelForm);

const duelForm = document.getElementById("duelForm");
duelForm.addEventListener("submit", function(event) {
    // Empêchez le formulaire de se soumettre normalement (rechargement de la page)
    event.preventDefault();

    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    var duelForm = document.getElementById("duelForm");
    duelForm.style.display = "none";

    console.log(player1);
    console.log(player2);

    var scoreGame = document.getElementById("scoreGame");
    scoreGame.style.display = "block";

    var gameBoard = document.getElementById("gameBoard");
    gameBoard.style.display = "block";
    game.game(player1,player2, "D");

    console.log("end game");

});
