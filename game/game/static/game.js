
        
// Use the variable in JavaScript
console.log(pseudo1 );
// VAR
let ball_color = "#98FB98";
let board_color = "#40E0D0";
let paddle_color = "#98FB98"; 
let text_color = "WHITE"
const framePerSecond = 50;
const winnigPoint = 3;
let intervalId;
const canvas = document.getElementById("gameBoard");
const context = canvas.getContext("2d");

const scorecanvas = document.getElementById("scoreGame");
const scoreCtx = scorecanvas.getContext("2d");


var bouton = document.getElementById('startButon');



function drawRect(x,y,w,h,color){

    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircule(x, y, r, color){

    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI *2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color){

    context.fillStyle = color;
    context.textAlign = 'center';
    context.font = "75px fantasy";
    context.fillText(text, x, y);
}

const net =
{
    x : canvas.width/2 - 2/2,
    y : 0,
    width : 2,
    height : 10,
    color : text_color,
}

function drawNet()
{
    for (let i = 0; i<= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

let  ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : ball_color
 
}

let user1 = {

    name : pseudo1,
    x : 5,
    y : canvas.height/2 - 100/2, 
    width : 10,
    height : 100,
    color : paddle_color,
    score : 0,
    move_up : 0,
    move_down : 0,
    speed : 5

}

let user2 = {

    name : pseudo2,
    x : canvas.width - 15,
    y : canvas.height/2 - 100/2, 
    width : 10,
    height : 100,
    color : paddle_color,
    score : 0,
    move_up : 0,
    move_down : 0,
    speed : 5

}

function drawScore(){

    scoreCtx.fillStyle = board_color;
    scoreCtx.fillRect(0, 0, 400, 25);

    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = "black";
    scoreCtx.textAlign = "center";
    scoreCtx.textBaseline = "middle";
    txt = user1.name + "        " + user1.score + " - " + user2.score + "        " + user2.name;
    scoreCtx.fillText(txt, 200, 13);

}

function render(){

    drawRect(0, 0, canvas.width, canvas.height, board_color);

    drawNet();
    drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
    drawCircule(ball.x, ball.y, ball.radius, ball.color);

    if (user1.score == 3){
        drawText("Player 1 win",canvas.width/2 ,canvas.height/2 + 20  , text_color);
        clearInterval(intervalId);
    }
    if (user2.score == 3){
        drawText("Player 2 win",canvas.width/2 ,canvas.height/2 + 20  , text_color);
        clearInterval(intervalId);
    }

}


function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    speed = 5;
    ball.velocityX = -ball.velocityX;
    drawScore();
}


function startMovePlayer(e)
{
    //player1
    if(e.code == "KeyW")
    {
        user1.move_up  = 1;
    }
    else if (e.code == "KeyS")
    {
        user1.move_down = 1;
    }


    //player2
    if(e.code == "ArrowUp")
    {
        user2.move_up  = 1;
    }
    else if (e.code == "ArrowDown")
    {
        user2.move_down  = 1;
    }
}


function stopMovePlayer(e)
{
    //player1
    if(e.code == "KeyW")
    {
        user1.move_up  = 0;
    }
    else if (e.code == "KeyS")
    {
        user1.move_down = 0;
    }


    //player2
    if(e.code == "ArrowUp")
    {
        user2.move_up  = 0;
    }
    else if (e.code == "ArrowDown")
    {
        user2.move_down  = 0;
    }
}




function updatePayerPosition(){

    let user1NewPosition = user1.y + ((-user1.move_up * user1.speed) + (user1.move_down *user1.speed));
    let user2NewPosition = user2.y + ((-user2.move_up * user2.speed) + (user2.move_down *user2.speed));

    if(user1NewPosition < 0){
        user1.y = 0;
    }else if(user1NewPosition > canvas.height - 100){
        user1.y = canvas.height - 100;
    }else{
        user1.y = user1NewPosition;
    }

    if(user2NewPosition < 0){
        user2.y = 0;
    }else if(user2NewPosition > canvas.height - 100){
        user2.y = canvas.height - 100;
    }else{
        user2.y = user2NewPosition;
    }
}



function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if(ball.x - ball.radius < 0){
        user2.score++;
        resetBall();
        if(user2 == winnigPoint){
            clearInterval(intervalId);
        }
    }else if(ball.x - ball.radius > canvas.width){
        user1.score++;
        resetBall();
        if(user1 == winnigPoint){
            clearInterval(intervalId);
        }
    }

    if(ball.y + ball.radius > canvas.height ||
        ball.y - ball.radius < 0){
            ball.velocityY = -ball.velocityY;
        }

    let player = (ball.x < canvas.width/2) ? user1 : user2;

    if (collision(ball, player)){
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY =  ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }

    document.addEventListener("keydown" , startMovePlayer);
    document.addEventListener("keyup" , stopMovePlayer);

    // update player position 
    updatePayerPosition();
}

function game(){
    update();
    render();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reset(){
    clearInterval(intervalId);
    ball = {
        x : canvas.width/2,
        y : canvas.height/2,
        radius : 10,
        speed : 5,
        velocityX : 5,
        velocityY : 5,
        color : ball_color
     
    };

    user1 = {

        name : pseudo1,
        x : 5,
        y : canvas.height/2 - 100/2, 
        width : 10,
        height : 100,
        color : paddle_color,
        score : 0,
        move_up : 0,
        move_down : 0,
        speed : 5
    
    };

    user2 = {
        name : pseudo2,
        x : canvas.width - 15,
        y : canvas.height/2 - 100/2, 
        width : 10,
        height : 100,
        color : paddle_color,
        score : 0,
        move_up : 0,
        move_down : 0,
        speed : 5
    
    };
    

}
async function start(){

    bouton.disabled = true;
    reset();
    drawScore();
    for (let i = 3; i>= 0; i--){
        render();
        drawText(i,canvas.width/2 ,canvas.height/2 + 20  , text_color);
        await sleep(1000); 
    }
    render();
    drawText("GO",canvas.width/2 ,canvas.height/2 + 20  , text_color);
    await sleep(1000); 
    bouton.disabled = false;
    intervalId = setInterval(game, 1000/framePerSecond);
}
async function main(){
    bouton.addEventListener('click', start);
}
main();