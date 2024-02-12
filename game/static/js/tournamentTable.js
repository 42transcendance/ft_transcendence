
export function tournamentTableElement(container, message, top, left) {
  var el = document.createElement("div");
  el.className = "tournamentTableElement";
  el.style.display = "flex";
  el.innerHTML = message;
  el.style.left = left + "px";
  el.style.top = top + "px";
  container.appendChild(el);
}

export function drawline(container, type, top, left) {
  var line = document.createElement("div");
  line.className = type;
  line.style.display = "flex";
  line.style.top = top + "px";
  line.style.left = left + "px";
  container.appendChild(line);
}

export function displayTournamentTable(tournamentData) {
  const gameContainer = document.getElementById('gameContainer');
  console.log(tournamentData.semiFinal[0])
  // Create a container div for the bracket
  var bracketContainer = document.getElementById("bracketContainer");
  bracketContainer.id = "bracketContainer"; // You can adjust the ID as needed
  bracketContainer.style.position = "absolute"; // or "relative", depending on your layout
  bracketContainer.style.left = "28%";
  bracketContainer.style.top = "35%";

  // Use bracketContainer as the parent for tournamentTableElement and drawline calls
  // Adjust the x and y coordinates accordingly based on the bracketContainer's position
  for (let i = 0; i <= 3; i += 1) {
    console.log(tournamentData.semiFinal[i])
    tournamentTableElement(bracketContainer, tournamentData.semiFinal[i],0, 150 * i);
    drawline(bracketContainer, "horizontalline", 37, 150 * i + 60);
    if (i !== 3 && i !== 1) {
      drawline(bracketContainer, "verticalline", 68, 150 * i + 60);
    }
  }

  //semi  final
  drawline(bracketContainer, "horizontalline", 68, 135);
  drawline(bracketContainer, "horizontalline", 68, 435);

  if (tournamentData.final[0] !== undefined) {
    tournamentTableElement(bracketContainer, tournamentData.final[0], 100, 75);
  } else {
    tournamentTableElement(bracketContainer, "à définir", 100, 75);
  }

  if(tournamentData.final[1] !== undefined){
    tournamentTableElement(bracketContainer, tournamentData.final[1], 100,  375);}
  else{
    tournamentTableElement(bracketContainer,"à définir",  100,  375);}

  drawline(bracketContainer,"horizontalline",  137 ,  135);
  drawline(bracketContainer,"horizontalline", 137,  435);

  drawline(bracketContainer,"verticalline",  168 , 135);
  drawline(bracketContainer,"verticalline", 168 ,  285);
  //final
  drawline(bracketContainer,"horizontalline",  168 ,  285);

  if (tournamentData.winner[0] !== undefined) {
    tournamentTableElement(bracketContainer, tournamentData.winner[0], 200, 225);
  } else {
    tournamentTableElement(bracketContainer,"à définir",  200, 225 );
    var nextMatchButton = document.getElementById('nextMatchButton');
    nextMatchButton.style.position = "absolute";
    nextMatchButton.style.display = "flex";
    nextMatchButton.style.marginTop = "40%";

  }
}
