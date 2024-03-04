// const boardHeight = 600;
// const boardWidth = 925;

const DIRECTION = {

	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4,
};

// The paddle object (The two lines that move up and down)
let Paddle = {

	new: function (side, name) {

		return {
			name: name,
			width: 10,
			height: 80,
			x: side === 'left' ? 20 : this.canvas.width - 30,
			y: (this.canvas.height / 2) - 40,
			score: 0,
			move: DIRECTION.IDLE,
			speed: 5,
		};
	},
};

var Ball = {

	new: function () {

		return {
			radius: 8,
			x: (this.canvas.width / 2),
			y: (this.canvas.height / 2),
			direction: -1,
			speed: 5,
		};
	},
};

class Game {

	constructor(boardWidth, boardHeight, playerName, opponentName) {

		this.canvas = document.getElementById('gameCanvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = boardWidth;
		this.canvas.height = boardHeight;

		this.canvas.style.width = (this.canvas.width) + 'px';
		this.canvas.style.height = (this.canvas.height) + 'px';
		this.color = '#1f2938';

		this.player = Paddle.new.call(this, 'left', playerName || "Player 1");
		this.opponent = Paddle.new.call(this, 'right', opponentName || "Player 2");
		this.ball = Ball.new.call(this);

		this.running = this.over = false;
		this.scored = false;
	}

	startGame () {
		// this.ball.direction = Math.random() * Math.PI * 2;
		this.ball.direction = Math.PI;
		this.listen();
		this.endScreen();
	}

	drawBoard () {
		console.log("Drawing");
		this.context.clearRect(0 ,0 ,this.canvas.width,this.canvas.height);
		this.context.fillStyle = this.color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		//	Draw the dotted line in the middle of the board
		this.context.beginPath();
		this.context.setLineDash([7, 15]);
		this.context.moveTo((this.canvas.width / 2), 0);
		this.context.lineTo((this.canvas.width / 2), this.canvas.height);
		this.context.lineWidth = 4;
		this.context.strokeStyle = 'grey';
		this.context.stroke();

		// Draw Score
		this.context.font = "300px Arial";
		this.context.strokeText(this.player.score, 150, (this.canvas.height / 2) + 110);
		this.context.strokeText(this.opponent.score, 600, (this.canvas.height / 2) + 110);

		//Draw Names
		this.context.fillStyle = '#002f7a';
		this.context.font = "100px Arial";
		this.context.fillText(this.player.name, 30, 100);
		this.context.fillText(this.opponent.name, this.canvas.width / 2 + 30, this.canvas.height - 30);

		// Draw the ball
		this.context.fillStyle = 'white';
		this.context.setLineDash([]);
		this.context.beginPath();
		this.context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
		this.context.fill();

		// Draw the paddles
		this.context.fillStyle = '#ffffff';
		this.context.fillRect( this.player.x, this.player.y, this.player.width, this.player.height );
		this.context.fillRect( this.opponent.x, this.opponent.y, this.opponent.width, this.opponent.height );

	}

	update() {
		if (this.over === false) {

			// These handle the ball's movements and collisions
			if (this.running === true) {
				if (this.ball.direction != -1)
				{
					this.ball.x += Math.cos(this.ball.direction) * this.ball.speed;
					this.ball.y += Math.sin(this.ball.direction) * this.ball.speed;

					// Handles player's's paddle collision
					if (this.ball.y >= this.player.y && this.ball.y <= this.player.y + this.player.height && this.ball.x - this.ball.radius <= this.player.x + this.player.width) {
						// Calculate relative position of the ball to the center of the paddle
						let relativeIntersectY = (this.player.y + (this.player.height / 2)) - this.ball.y;
						let normalizedRelativeIntersectY = relativeIntersectY / (this.player.height / 2);
						let bounceAngle = normalizedRelativeIntersectY * (Math.PI / 3); // Max angle is 60 degrees
						this.ball.direction = Math.PI * 2 - bounceAngle; // Reflect the ball's direction
						if (this.ball.speed < 100) this.ball.speed += 0.2;
					}
					// Handles if the balls is scored on the player's goal
					else if (this.ball.x <= this.player.x + this.player.width - 2)
					{
						this.ball.x = (this.canvas.width / 2);
						this.ball.y = (this.canvas.height / 2);
						this.opponent.score++;
						this.ball.speed = 5;
						this.handleScore();
					}
					// Handles opponent's's paddle collisionw
					if ((this.ball.y >= this.opponent.y && this.ball.y <= this.opponent.y + this.opponent.height && this.ball.x + this.ball.radius >= this.opponent.x))
					{
						let relativeIntersectY = (this.opponent.y + (this.opponent.height / 2)) - this.ball.y; // =40
						let normalizedRelativeIntersectY = relativeIntersectY / (this.opponent.height / 2); // =1
						let bounceAngle = normalizedRelativeIntersectY * (Math.PI / 3); // Max angle is 60 degrees
						this.ball.direction = Math.PI + bounceAngle; // Reflect the ball's direction
						if (this.ball.speed < 100) this.ball.speed += 0.2;
					}
					// Handles if the balls is scored on the opponent's goal
					else if (this.ball.x >= this.opponent.x - 2)
					{
						this.ball.x = (this.canvas.width / 2);
						this.ball.y = (this.canvas.height / 2);
						this.player.score++;
						this.ball.speed = 5;
						this.handleScore();
					}

					// Top and Bottom walls collision
					if ((this.ball.y + this.ball.radius) >= this.canvas.height) this.ball.direction = Math.atan2(Math.sin(this.ball.direction) * -1, Math.cos(this.ball.direction));
					else if ((this.ball.y - this.ball.radius) <= 0) 			this.ball.direction = Math.atan2(Math.sin(this.ball.direction) * -1, Math.cos(this.ball.direction));
				}
			}
			
			// These handle the Player's paddle wall collisions and movements
			if (this.player.move === DIRECTION.UP) {
				if ((this.player.y - this.player.speed) <= 0) this.player.y = 0;
				else this.player.y -= this.player.speed;
			}
			else if (this.player.move === DIRECTION.DOWN) {
				if (((this.player.y + this.player.height) + this.player.speed) >= this.canvas.height) this.player.y = this.canvas.height - this.player.height;
				else this.player.y += this.player.speed;
			}
			// These handle the Opponent's paddle wall collisions and movements
			if (this.opponent.moveY === DIRECTION.UP) {
				if ((this.opponent.y - this.opponent.speed) <= 0) this.opponent.y = 0;
				else this.opponent.y -= this.opponent.speed;
			}
			else if (this.opponent.moveY === DIRECTION.DOWN) {
				if (((this.opponent.y + this.opponent.height) + this.opponent.speed) >= this.canvas.height) this.opponent.y = this.canvas.height - this.opponent.height;
				else this.opponent.y += this.opponent.speed;
			}
		}
	}

	gameLoop() {
		this.update();
		this.drawBoard();
		if (this.player.score >= 5 || this.opponent.score >= 5)
		{
			this.running = false;
			this.over = true;
			showButtons();
			hideCanvas();
			winningMsg(this);
		}
		if (!this.over) {
			window.requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	listen() {
		if (this.running === false) {
			this.running = true;
			window.requestAnimationFrame(this.gameLoop.bind(this))
		}
		// Those ensures that if you press 2 keys at the same time, the movement wont stop when you stop pressing one of them
		let wKeyPressed = false;
		let sKeyPressed = false;

		let ArrowUpKeyPressed = false;
		let ArrowDownKeyPressed = false;

		// Creating events for movements on keydown
		document.addEventListener('keydown', (key) => {		
			//console.log(key.key);	
			// Handle w key events
			if (key.key === 'w') {
				this.player.move = DIRECTION.UP;
				wKeyPressed = true;
			}
			// Handle s key events
			if (key.key === 's') {
				this.player.move = DIRECTION.DOWN;
				sKeyPressed = true;
			}
			
			// Opponent's movements
			if (key.key === 'ArrowUp') {
				this.opponent.moveY = DIRECTION.UP;
				ArrowUpKeyPressed = true;
			}
			if (key.key === 'ArrowDown') {
				this.opponent.moveY = DIRECTION.DOWN;
				ArrowDownKeyPressed = true;
			}
		});

		// Stop the player from moving when there are no keys being pressed.
		document.addEventListener('keyup', (key) => {
			// Player key realease
			if (key.key === 'w') {
				wKeyPressed = false;
				if (sKeyPressed === true) this.player.move = DIRECTION.DOWN;
			}
			if (key.key === 's') {
				sKeyPressed = false;
				if (wKeyPressed === true) this.player.move = DIRECTION.UP;
			}
			if (sKeyPressed === false && wKeyPressed === false) this.player.move = DIRECTION.IDLE;

			//Opponent key releases
			if (key.key === 'ArrowUp') {
				ArrowUpKeyPressed = false;
				if (ArrowDownKeyPressed === true) this.opponent.moveY = DIRECTION.DOWN;
			}
			if (key.key === 'ArrowDown') {
				ArrowDownKeyPressed = false;
				if (ArrowUpKeyPressed === true) this.opponent.moveY = DIRECTION.UP;
			}
			if (ArrowDownKeyPressed === false && ArrowUpKeyPressed === false) this.opponent.moveY = DIRECTION.IDLE;
		});
	}

	start() {
		this.drawBoard();
		let countdown = 5; // Initial countdown value
		const countdownInterval = setInterval(() => {
			this.drawBoard();
			this.context.fillStyle = '#38515e';
			this.context.font = "200px Arial";
			this.context.fillText(`${countdown}`, this.canvas.width / 2 - 50, this.canvas.height / 2 - 100);

			countdown--;

			if (countdown < 0) {
				clearInterval(countdownInterval); // Stop the countdown
				this.startGame(); // Start the game
			}
    	}, 	1000); // Update countdown every second
	}

	handleScore() {
		// Pause the game for 1 second
		this.running = false;
		setTimeout(() => {
			this.running = true;
		}, 1000);
	}

	endScreen() {
		this.drawBoard();
	}
};



