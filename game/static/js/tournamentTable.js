
export function tournamentTableElement(message, top, left) {
  var el = document.createElement("div");
  el.className = "tournamentTableElement";
  el.style.display = "flex";
  el.innerHTML = message;
  el.style.top = top + "px";
  el.style.left = left + "px";
  document.body.appendChild(el);
}



export function drawline(type, top, left) {
  var line = document.createElement("div");
  line.className = type;
  line.style.display = "flex";
  line.style.top = top + "px";
  line.style.left = left + "px";
  document.body.appendChild(line);
}


export function displayTournamentTable(x, y, tournamentData)
{

  for (let i = 0; i<= 3; i+=1){
    tournamentTableElement(tournamentData.semiFinal[i], y, x + 150 * i);
    drawline("horizontalline", y + 37 , x + 150 * i + 60);
    if(i!= 3){
      drawline("verticalline", y + 68 , x + 150 * i + 60);
    }
  }
  //semi  final
  drawline("horizontalline", y + 68 , x + 135);
  drawline("horizontalline", y + 68 , x + 435);


  if(tournamentData.final[0] !== undefined){
    tournamentTableElement(tournamentData.final[0], y + 100, x + 75);}
  else{
    tournamentTableElement("à définir", y + 100, x + 75);}

  if(tournamentData.final[1] !== undefined){
    tournamentTableElement(tournamentData.final[1], y + 100, x +  375);}
  else{
    tournamentTableElement("à définir", y + 100, x +  375);}

  drawline("horizontalline", y + 137 , x + 135);
  drawline("horizontalline", y + 137, x + 435);

  drawline("verticalline", y + 168 ,x + 135);
  drawline("verticalline", y + 168 ,  x + 285);
  //final
  drawline("horizontalline", y + 168 ,  x + 285);
  if(tournamentData.winner[0] !== undefined){
    tournamentTableElement(tournamentData.winner[0], y + 200, x + 225 );}
  else{
    tournamentTableElement("à définir", y + 200, x + 225 );
    var nextMatchButton = document.getElementById('nextMatchButton');
    nextMatchButton.style.top =  y + 300  + "px";
    nextMatchButton.style.left = x + 160  +  "px";
    nextMatchButton.style.display = "flex";}
}

