//board 
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = {
    x : 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}

let player2= {
    x : boardWidth - playerWidth - 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x : boardWidth / 2,
    y : boardHeight / 2,
    width : ballWidth,
    height : ballHeight,
    velocityX : 1,
    velocityY : 2
}


//
let player1Score = 0;
let player2Score = 0;


window.onload = function()
{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial player1
    context.fillStyle = "#FF33C1";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);


    requestAnimationFrame(update)
    document.addEventListener("keyup" , movePlayer );
}

function update()
{
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width, board.height);

    //draw player1
    context.fillStyle = "#FF33C1";
    if(!outOfBounds(player1.y + player1.velocityY))
    {
        player1.y += player1.velocityY;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //draw player2
    if(!outOfBounds(player2.y + player2.velocityY))
    {
        player2.y += player2.velocityY;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //draw ball
    context.fillStyle = "#92FF46";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    //if ball touches top or bottom of convas
    if(ball.y <=0 || (ball.y + ball.height >= boardHeight))
    {
        ball.velocityY *= -1; // reverse direction
    }

    //bounce the ball back
    if(detectCollision(ball,player1))
    {
        if(ball.x <= player1.x + player1.width)
        {
            ball.velocityX *= -1;
        }
    }
    else if(detectCollision(ball , player2))
    {
        if(ball.x + ballWidth >= player2.x)
        {
            ball.velocityX *= -1;
        }
    }


    //game over 
    if(ball.x < 0)
    {
        player2Score += 1;
        resetGame(1);
    }
    else if(ball.x + ballWidth > boardWidth)
    {
        player1Score +=1;
        resetGame(-1);
    }

    // draw score 
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth * 4/5 - 45, 45);

    // dotted line 
    for (let i = 10; i < board.height; i += 25)
    {
        context.fillRect(board.width/2 - 10, i, 5, 5);
    }
}


function outOfBounds(yPosition)
{
    return(yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e)
{
    //player1
    if(e.code == "KeyW")
    {
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS")
    {
        player1.velocityY = 3;
    }


    //player2
    if(e.code == "ArrowUp")
    {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown")
    {
        player2.velocityY = 3;
    }
}

function detectCollision(a, b)
{
    return a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

function resetGame(direction)
{
    ball = {
        x : boardWidth / 2,
        y : boardHeight / 2,
        width : ballWidth,
        height : ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}