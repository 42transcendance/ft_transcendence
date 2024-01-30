import * as duel from './duel.js';
import * as tournament from './tournament.js';




/*

function createTournement() {
    var nombreJoueurs = 4;
    var pseudosForm = document.getElementById("pseudosForm");

    // Réinitialiser le contenu du formulaire à chaque changement
    pseudosForm.innerHTML = "";

    var label = document.createElement("label");
    label.textContent = "Nom du tournoi :";
    
    var input = document.createElement("input");
    input.type = "text";
    input.id = "nomTournoi";

    var lineBreak = document.createElement("br");


    // Ajouter les éléments au formulaire
    pseudosForm.appendChild(label);
    pseudosForm.appendChild(input);
    pseudosForm.appendChild(lineBreak);


    if (nombreJoueurs > 0) {
      for (var i = 1; i <= nombreJoueurs; i++) {
        var label = document.createElement("label");
        label.textContent = "Joueur " + i + ":";
        
        var input = document.createElement("input");
        input.type = "text";
        input.id = "pseudo" + i;

        var lineBreak = document.createElement("br");
  

        // Ajouter les éléments au formulaire
        pseudosForm.appendChild(label);
        pseudosForm.appendChild(input);
        pseudosForm.appendChild(lineBreak);

      }
    }
    var submitbouton = document.getElementById('submit');
    submitbouton.style.display = 'block';

  }

function startTournement(){
    var nombreJoueurs = 4;

    var nomTournoi = document.getElementById("nomTournoi").value;

    if(nomTournoi.length > 0){
        for (var i = 1; i <= nombreJoueurs; i++) {
            var pseudo = document.getElementById("pseudo" + i).value;
            tournamentData.semiFinal.push(pseudo);
            if(pseudo.length == 0){
              window.alert("Merci de renseigner les differents champs");
                return;
            }
        } 
        
    }
    else{
      window.alert("Merci de renseigner les differents champs");
      return;
    }
    create_arbre(465,50);
}

function matchUp(){

  if(tournamentData.Final.length == 0){
    var p1 = tournamentData.semiFinal[0];
    var p2 = tournamentData.semiFinal[1]; 
  }
  else if (tournamentData.Final.length == 1)
  {

  }

}


function creerCarre(message, top, left) {
  var carre = document.createElement("div");
  carre.className = "monCarre";
  carre.innerHTML = message;
  carre.style.top = top + "px";
  carre.style.left = left + "px";
  document.body.appendChild(carre);
}


function drawline(type, top, left) {
  var line = document.createElement("div");
  line.className = type;
  line.style.top = top + "px";
  line.style.left = left + "px";
  document.body.appendChild(line);
}


function create_arbre(x, y)
{
  for (let i = 0; i<= 3; i+=1){
    creerCarre(tournamentData.semiFinal[i], y, x + 150 * i);
    drawline("horizontalline", y + 24 , x + 150 * i + 60);
    if(i!= 3){
      drawline("verticalline", y + 36 , x + 150 * i + 60);
    }
  }
  //semi  final
  drawline("horizontalline", y + 36 , x + 135);
  drawline("horizontalline", y + 36 , x + 435);

  creerCarre(tournamentData.final[0], y + 48, x + 75);
  creerCarre(tournamentData.final[1], y + 48, x +  375);

  drawline("horizontalline", y + 72 , x + 135);
  drawline("horizontalline", y + 72 , x + 435);

  drawline("verticalline", y + 84 ,x + 135);
  drawline("verticalline", y + 84 ,  x + 285);
  //final
  drawline("horizontalline", y + 84 ,  x + 285);
  creerCarre(tournamentData.winner[0], y + 96, x + 225 );
}

create_arbre(465,50);



var submitbouton = document.getElementById('submit');
submitbouton.addEventListener('click', startTournement);

var createTournementbutton = document.getElementById('createTournementbutton');
createTournementbutton.addEventListener('click', createTournement);
*/