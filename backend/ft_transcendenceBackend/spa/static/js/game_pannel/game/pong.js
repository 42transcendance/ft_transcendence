class Game {
	constructor() {		
		this.principalContainer = document.getElementById('principal-container');
		this.canvas = document.getElementById('gameCanvas');
		this.context = this.canvas.getContext('2d');
		
		this.canvas.width = this.principalContainer.clientWidth;
		this.canvas.height = this.principalContainer.clientHeight;

		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';

		this.color = '#1f2938';
	}

	wsListen() {
        this.pongSocket.onmessage = (event) => {
            const wsData = JSON.parse(event.data);
			switch (wsData.type) {
				case ('game.starting'):
					this.game_running = true
					this.inputsListen();
					break ;
				case ('game.state'):
					this.lastGameState = wsData;
					break ;
				case ('countdown'):
					this.countdown = wsData.countdown;
					break ;
				case ('ending.game'):
					this.game_running = false;

					this.stopAnimation(this.animationId);
					this.context.clearRect(0 ,0 ,this.canvas.width,this.canvas.height);
					
					break;
				default:
					console.log("Unrecognised type message : " + wsData.type)
			}
			
        };

        this.pongSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
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

		//Draw the dotted line in the middle of the board
		this.context.beginPath();
		this.context.setLineDash([7, 17]);
		this.context.moveTo((this.canvas.width / 2), 0);
		this.context.lineTo((this.canvas.width / 2), this.canvas.height);
		this.context.lineWidth = 4;
		this.context.strokeStyle = 'grey';
		this.context.stroke();
		
		//Draw The paddle
		this.context.fillStyle = '#ffffff';
		this.context.fillRect( (wsData.leftPlayerPaddle.x * diff), (wsData.leftPlayerPaddle.y * diff), (wsData.leftPlayerPaddle.width * diff), (wsData.leftPlayerPaddle.height * diff));
		this.context.fillRect( (wsData.rightPlayerPaddle.x * diff), (wsData.rightPlayerPaddle.y * diff), (wsData.rightPlayerPaddle.width * diff), (wsData.rightPlayerPaddle.height * diff));

		//Draw The Score
		this.context.setLineDash([]);
		this.context.font = (wsData.defaultFontSize * diff) + "px " + wsData.defaultFont;
		this.context.strokeText(wsData.leftPlayerScore, this.canvas.width / 8, ((wsData.defaultFontSize) * diff));
		this.context.strokeText(wsData.rightPlayerScore, this.canvas.width * 0.6, ((wsData.defaultFontSize) * diff));

		// Draw the ball
		this.context.fillStyle = 'white';
		this.context.setLineDash([]);
		this.context.beginPath();
		this.context.arc((wsData.ball.x * diff), (wsData.ball.y * diff), (wsData.ball.radius * diff), 0, 2 * Math.PI);
		this.context.fill();
	}

	connect() {
		this.pongSocket = new WebSocket('ws://' + window.location.host + '/ws/pong/');
	
		this.pongSocket.onopen = () => {
			this.connected = true;

			this.pongSocket.send(JSON.stringify({ 
				'type':'join.matchmaking',
			}));
		};
		this.wsListen();
	}

	inputsListen() {
		// Creating events for movements on keydown
		let wkeypressed = false
		let skeypressed = false

		document.addEventListener('keydown', (key) => {
			if (key.key === 'w') {
				if (wkeypressed == false) {
					this.pongSocket.send(JSON.stringify({ 
						'type':'user.input',
						'message':'wPress',
					}));
					wkeypressed = true
				}
			}

			if (key.key === 's') {
				if (skeypressed == false) {
					this.pongSocket.send(JSON.stringify({ 
						'type':'user.input',
						'message':'sPress',
					}));
					skeypressed = true
				}
			}
		});

		document.addEventListener('keyup', (key) => {
			// Player key realease
			if (key.key === 'w') {
				this.pongSocket.send(JSON.stringify({ 
					'type':'user.input',
					'message':'wRelease',
				}));
				wkeypressed = false
			}
			if (key.key === 's') {
				this.pongSocket.send(JSON.stringify({ 
					'type':'user.input',
					'message':'sRelease',
				}));
				skeypressed = false
			}
		});
	}

	animate() {
		console.log("Animating");
		this.draw();
    	this.animationId = requestAnimationFrame(() => this.animate());
	}

	stopAnimation() {
		cancelAnimationFrame(this.animationId);
	}

	draw() {
		if (!this.lastGameState) return;

		this.drawBoard(this.lastGameState);
		if (this.countdown > 0) this.drawCountdown(this.lastGameState, this.countdown);
	}

	start() {
		this.connect();
		//this.animate();
	}
}