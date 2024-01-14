function genererCases() {
    var nombreJoueurs = document.getElementById("nombreJoueurs").value;
    var pseudosForm = document.getElementById("pseudosForm");

    // Réinitialiser le contenu du formulaire à chaque changement
    pseudosForm.innerHTML = "";

    if (nombreJoueurs > 0) {
      for (var i = 1; i <= nombreJoueurs; i++) {
        var label = document.createElement("label");
        label.textContent = "Joueur " + i + " Pseudo :";
        
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
  }





function startTournement(){

    var nombreJoueurs = document.getElementById("nombreJoueurs").value;

    if(nombreJoueurs > 0){
        for (var i = 1; i <= nombreJoueurs; i++) {
            pseudo = document.getElementById("pseudo" + i).value;
            console.log(pseudo);
            if(pseudo.length == 0){
                window.alert("Merci de renseigner les noms");
                return;
            }
        } 
        
    }
    else{
        window.alert("Merci de renseigner nombre de participants");
    }
    
}