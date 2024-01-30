import * as tournament from './tournament.js';
import * as tournamentTable from './tournamentTable.js';

export function storageScoreDuel(pseudo1, pseudo2, winner){

    if(winner == 1)
    {
        console.log(pseudo1 + " win");
    }
    else{
        console.log(pseudo2 + " win");
    }

    //Ajax

}

export function storageScoreTournament(pseudo1, pseudo2, winner){
     
    if(winner == 1)
    {
        var pseudoWinner = pseudo1;
    }
    else{
        var pseudoWinner = pseudo2;
    }

    if(tournament.tournamentData.final[0] == undefined){

        tournament.tournamentData.final[0] = pseudoWinner;
    }
    else if(tournament.tournamentData.final[1] == undefined){
        tournament.tournamentData.final[1] = pseudoWinner;
    }
    else if(tournament.tournamentData.winner[1] == undefined){
        tournament.tournamentData.winner[0] = pseudoWinner;
    }

    tournamentTable.displayTournamentTable(440,300, tournament.tournamentData);

    //Ajax

}