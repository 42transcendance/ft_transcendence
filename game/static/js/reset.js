import * as game from './game.js';

export function resetTournamentTable(){

var elements = document.getElementsByClassName('tournamentTableElement');
for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
}


var elementsHori = document.getElementsByClassName('horizontalline');
for (var i = 0; i < elementsHori.length; i++) {
    elementsHori[i].style.display = "none";
}


var elementsVer = document.getElementsByClassName('verticalline');
for (var i = 0; i < elementsVer.length; i++) {
    elementsVer[i].style.display = "none";
}

var nextMatchButton = document.getElementById('nextMatchButton');
nextMatchButton.style.display = "none";
}


export function resetFunction()
{
    clearInterval(game.intervalId);
    resetTournamentTable();

    var scoreGame = document.getElementById("scoreGame");
    scoreGame.style.display = "none";

    var gameBoard = document.getElementById("gameBoard");
    gameBoard.style.display = "none";

    var duelForm = document.getElementById("duelForm");
    duelForm.style.display = "none";

    var tournamentForm = document.getElementById("tournamentForm");
    tournamentForm.style.display = "none";
}

export function disableButtons()
{
    var duelButton = document.getElementById('duelButton');
    duelButton.disabled = true;


    var tournamentButton = document.getElementById('tournamentButton');
    tournamentButton.disabled = true;

}


export function activateButtons()
{
    var duelButton = document.getElementById('duelButton');
    duelButton.disabled = false;


    var tournamentButton = document.getElementById('tournamentButton');
    tournamentButton.disabled = false;

}