const DIRECTION = {

	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4,
};

let Paddle = {

	new: function (side, username) {

		return {
			username: username,
			width: null,
			height: null,
			x: null,
			y: null,
			move: DIRECTION.IDLE,
			speed: null,
		};
	},
};

class Game {
	constructor() {		
		this.principalContainer = document.getElementById('principal-container');
		this.buttonContainer = document.getElementById('button-container');
		this.waitingOverlay = document.getElementById('waitingOverlay');
		this.cancelGameButton = document.getElementById('cancel-game-button');
		this.waitingText = document.querySelector('.waiting-text');

		this.buttonContainer.style.display = 'none';

		this.over = false;
		this.game_running = false
		
		this.canvas = document.getElementById('gameCanvas');
		this.context = this.canvas.getContext('2d');
		
		this.canvas.width = this.principalContainer.clientWidth;
		this.canvas.height = this.principalContainer.clientWidth * 0.67;

		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';

		this.color = '#1f2938';
		this.playerPaddle = null;

		this.setPaddle = 0;

		this.room_id = null;
		
		this.lastFrameTime = performance.now();
		this.frameRate = 60;
		this.frameInterval = 1000 / this.frameRate;
	}

	displayGameId(gameId) {
		$.ajax({
            url: '/invite_code_translate/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
				this.waitingText = document.querySelector('.waiting-text');
				this.waitingText.textContent = data.translations.inv_code + gameId;
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });

	}

	joinMatchmaking() {
		this.pongSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/');
	
		this.pongSocket.onopen = () => {
			this.connected = true;

			this.pongSocket.send(JSON.stringify({ 
				'type':'join.matchmaking',
			}));
		};
		this.wsListen(false);
		this.animate();
	}

	createPrivateGame(isInvite) {
		this.pongSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/');
		
		this.pongSocket.onopen = () => {
			this.connected = true;

			this.pongSocket.send(JSON.stringify({ 
				'type':'create.private.game',
			}));
		};
		this.wsListen(isInvite);
		this.animate();
	}

	joinPrivateGame(room_id) {
		this.pongSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/');
	
		this.pongSocket.onopen = () => {
			this.connected = true;

			this.pongSocket.send(JSON.stringify({ 
				'type':'join.private.game',
				'room_id': room_id,
			}));
		};
		this.wsListen(false);
		this.startAnimation();
	}

	wsListen(isInvite) {
        this.pongSocket.onmessage = (event) => {
            const wsData = JSON.parse(event.data);
			switch (wsData.type) {

				case ('game.setup'):
					this.side = wsData.side;
					this.username = wsData.username;
					this.user_id = wsData.user_id;
					this.playerPaddle = Paddle.new.call(this, this.side, this.username);
					this.room_id = wsData.room_id;
					if (this.room_id != null) {
						if (this.room_id.includes("private") == true) {
							if (isInvite === false) {
								this.displayGameId(this.room_id);
							}
						}
					}
					else {	this.waitingText.textContent = "Waiting for opponent...";	}
					
					break ;

				case ('matchmaking'):
					this.waitingOverlay.style.visibility = 'visible';
					this.cancelGameButton.style.display = 'flex';
					break ;

				case ('game.starting'):
					this.waitingOverlay.style.visibility = 'hidden';
					this.cancelGameButton.style.display = 'none';
					this.game_running = true;
					this.inputsListen();
					break ;

				case ('game.state'):
					this.lastGameState = wsData;
					this.diff = this.canvas.width / wsData.width;
					if (this.setPaddle === 0) {
						if (this.side === 'left') {
							this.playerPaddle.x = wsData.leftPlayerPaddle.x * this.diff;
							this.playerPaddle.y = wsData.leftPlayerPaddle.y * this.diff;
							this.playerPaddle.width = wsData.leftPlayerPaddle.width * this.diff;
							this.playerPaddle.height = wsData.leftPlayerPaddle.height * this.diff;
							this.playerPaddle.speed = wsData.leftPlayerPaddle.speed * this.diff;
						}
						else if (this.side === 'right') {
							this.playerPaddle.x = wsData.rightPlayerPaddle.x * this.diff;
							this.playerPaddle.y = wsData.rightPlayerPaddle.y * this.diff;
							this.playerPaddle.width = wsData.rightPlayerPaddle.width * this.diff;
							this.playerPaddle.height = wsData.rightPlayerPaddle.height * this.diff;
							this.playerPaddle.speed = wsData.rightPlayerPaddle.speed * this.diff;
						}
						this.setPaddle = 1;
					}
					break ;

				case ('countdown'):
					this.countdown = wsData.countdown;
					break ;
				
				case ('notification'):
					break;

				case ('ending.game'):
					this.game_running = false;
					this.endGame(this.animationId);
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					break;

				case ('Error'):
					this.endGame();
					break;

				default:
					break;
			}
        };

        this.pongSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

	inputsListen() {
		let wKeyPressed = false;
		let sKeyPressed = false;

		document.addEventListener('keydown', (key) => {		
			if (key.key === 'w') {
				this.playerPaddle.move = DIRECTION.UP;
				wKeyPressed = true;
			}

			if (key.key === 's') {
				this.playerPaddle.move = DIRECTION.DOWN;
				sKeyPressed = true;
			}
		});

		document.addEventListener('keyup', (key) => {
			if (key.key === 'w') {
				wKeyPressed = false;
				if (sKeyPressed === true) this.playerPaddle.move = DIRECTION.DOWN;
			}
			if (key.key === 's') {
				sKeyPressed = false;
				if (wKeyPressed === true) this.playerPaddle.move = DIRECTION.UP;
			}
			if (sKeyPressed === false && wKeyPressed === false) this.playerPaddle.move = DIRECTION.IDLE;
		});
	}

	updatePaddlePosition() {
		if (this.playerPaddle.move === DIRECTION.UP) {
			if ((this.playerPaddle.y - this.playerPaddle.speed) <= 0) this.playerPaddle.y = 0;
			else this.playerPaddle.y -= this.playerPaddle.speed;
		}
		else if (this.playerPaddle.move === DIRECTION.DOWN) {
			if (((this.playerPaddle.y + this.playerPaddle.height) + this.playerPaddle.speed) >= this.canvas.height) this.playerPaddle.y = this.canvas.height - this.playerPaddle.height;
			else this.playerPaddle.y += this.playerPaddle.speed;
		}
	}

	startAnimation() {
		this.lastFrameTime = performance.now();
		this.animationId = requestAnimationFrame((currentTime) => this.animate(currentTime));
	}
	
	stopAnimation() {
		if (this.animationId !== null) {
		  cancelAnimationFrame(this.animationId);
		  this.animationId = null;
		}
	}

	animate(currentTime) {
		this.animationId = requestAnimationFrame((currentTime) => this.animate(currentTime));
	
		let deltaTime = currentTime - this.lastFrameTime;

		this.canvas.style.width = this.principalContainer.clientWidth + 'px';
		this.canvas.style.height = this.principalContainer.clientHeight + 'px';
		
		if (deltaTime >= this.frameInterval) {
			this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
	
			if (this.playerPaddle != null) {
				this.updatePaddlePosition();
	
				if (this.game_running === true) {
				  	this.pongSocket.send(JSON.stringify({ 
						'type': 'user.update',
						'paddleX': this.playerPaddle.x / this.diff,
						'paddleY': this.playerPaddle.y / this.diff,
				  	}));
				}
			}
			this.draw();
		}
	}

	draw() {
		if (!this.lastGameState) return;

		this.drawBoard(this.lastGameState);
		if (this.countdown > 0) this.drawCountdown(this.lastGameState, this.countdown);
	}

	endGame() {
		cancelAnimationFrame(this.animationId);
		this.over = true;
		this.cancelGameButton.style.display = 'none'
		this.buttonContainer.style.display = 'flex';
		this.waitingOverlay.style.visibility = 'hidden';
		this.pongSocket.close();
	}

	drawCountdown(wsData, count) {
		const diff = this.canvas.width / wsData.width;
		this.context.strokeStyle = 'white';
		this.context.setLineDash([])
		this.context.font = ((wsData.defaultFontSize * diff) / 2)+ "px " + wsData.defaultFont;
		this.context.strokeText(count, (this.canvas.width / 2) - wsData.defaultFontSize / 4, ((wsData.height / 3 * 2) * diff));
	}

	drawBoard(wsData) {
		const diff = this.canvas.width / wsData.width;
		this.context.clearRect(0 ,0 ,this.canvas.width,this.canvas.height);
		this.context.fillStyle = this.color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.beginPath();
		this.context.setLineDash([7, 17]);
		this.context.moveTo((this.canvas.width / 2), 0);
		this.context.lineTo((this.canvas.width / 2), this.canvas.height);
		this.context.lineWidth = 4;
		this.context.strokeStyle = 'grey';
		this.context.stroke();
		
		this.context.fillStyle = '#ffffff';
		this.context.fillRect( this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height );
		if (this.side == 'left') this.context.fillRect( (wsData.rightPlayerPaddle.x * diff), (wsData.rightPlayerPaddle.y * diff), (wsData.rightPlayerPaddle.width * diff), (wsData.rightPlayerPaddle.height * diff));
		else if (this.side == 'right') this.context.fillRect( (wsData.leftPlayerPaddle.x * diff), (wsData.leftPlayerPaddle.y * diff), (wsData.leftPlayerPaddle.width * diff), (wsData.leftPlayerPaddle.height * diff));

		this.context.setLineDash([]);
		this.context.font = (wsData.defaultFontSize * diff) + "px " + wsData.defaultFont;
		this.context.strokeText(wsData.leftPlayerScore, this.canvas.width / 8, ((wsData.defaultFontSize) * diff));
		this.context.strokeText(wsData.rightPlayerScore, this.canvas.width * 0.6, ((wsData.defaultFontSize) * diff));

		this.context.fillStyle = 'white';
		this.context.setLineDash([]);
		this.context.beginPath();
		this.context.arc((wsData.ball.x * diff), (wsData.ball.y * diff), (wsData.ball.radius * diff), 0, 2 * Math.PI);
		this.context.fill();
	}

}