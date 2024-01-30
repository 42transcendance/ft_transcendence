import * as game from './game.js';
import * as reset from './reset.js';
import * as tournamentTable from './tournamentTable.js';

export var tournamentData = {
    name : "",
    semiFinal : [],
    final : [],
    winner : []
};


function displayTournamentForm()
{
    reset.resetFunction();

    var tournamentForm = document.getElementById("tournamentForm");
    tournamentForm.style.display = "block";

}

var tournamentButton = document.getElementById('tournamentButton');
tournamentButton.addEventListener('click', displayTournamentForm);


const tournamentForm = document.getElementById("tournamentForm");
tournamentForm.addEventListener("submit", function(event) {
    //reset tournamentData
    
    tournamentData = {
        name : "",
        semiFinal : [],
        final : [],
        winner : []
    }

    // Empêchez le formulaire de se soumettre normalement (rechargement de la page)
    event.preventDefault();

    const player1 = document.getElementById("player1_T").value;
    const player2 = document.getElementById("player2_T").value;
    const player3 = document.getElementById("player3_T").value;
    const player4 = document.getElementById("player4_T").value;

    reset.resetFunction();

    tournamentData.semiFinal = [player1,player2,player3,player4];
 
    tournamentTable.displayTournamentTable(440,300, tournamentData);

    // Réinitialise le formulaire
    this.reset();


    // Vous pouvez également envoyer les données au serveur via une requête AJAX
});


var nextMatchButton = document.getElementById('nextMatchButton');
nextMatchButton.addEventListener('click', nextMatch);

function nextMatch()
{
    reset.resetFunction();

    if(tournamentData.final[0] == undefined){
        game.game(tournamentData.semiFinal[0] , tournamentData.semiFinal[1], "T")
    }
    else if(tournamentData.final[1] == undefined){
        game.game(tournamentData.semiFinal[2] , tournamentData.semiFinal[3], "T")
    }
    else if(tournamentData.winner[0] == undefined){
        game.game(tournamentData.final[0] , tournamentData.final[1], "T")
    }
    return;
}