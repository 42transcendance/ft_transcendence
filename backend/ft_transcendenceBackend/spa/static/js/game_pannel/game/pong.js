class Game {
	constructor() {		
		this.principalContainer = document.getElementById('principal-container');
		this.canvas = document.getElementById('gameCanvas');
		this.context = this.canvas.getContext('2d');
		
		this.canvas.width = 600;
		this.canvas.height = 400;

		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';

		this.color = '#1f2938';
	}

	wsListen() {
        this.pongSocket.onmessage = (event) => {
            const wsData = JSON.parse(event.data);
            if (wsData.type === 'game.starting') {
                this.game_running = true;
                // Start the game here
                this.drawFrame(); // Start the animation loop
            } else if (wsData.type === 'game.state') {
				console.log("Received update")
                this.lastGameState = wsData;
            }
        };

        this.pongSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

	drawBoard(wsData) {
		const diff = this.canvas.width / wsData.width;
		// console.log(wsData);
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
		
		//Draw The paddle
		this.context.fillStyle = '#ffffff';
		this.context.fillRect( (wsData.leftPlayer.x * diff), (wsData.leftPlayer.y * diff), (wsData.leftPlayer.width * diff), (wsData.leftPlayer.height * diff));
		this.context.fillRect( (wsData.rightPlayer.x * diff), (wsData.rightPlayer.y * diff), (wsData.rightPlayer.width * diff), (wsData.rightPlayer.height * diff));

		//Draw The Score
		this.context.font = (wsData.defaultFontSize * diff) + "px " + wsData.defaultFont;
		this.context.strokeText(wsData.player_score, this.canvas.width / 8, ((wsData.defaultFontSize) * diff));
		this.context.strokeText(wsData.opponent_score, this.canvas.width * 0.6, ((wsData.defaultFontSize) * diff));

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
				'type':'user.ready',
				'message':'This user is ready to start an online game.',
			}));

			this.waitForReadySignal();
		};

		this.wsListen();
	}
	
	waitForReadySignal() {
		const checkReady = () => {
			if (!this.game_running) {
				console.log("Waiting For Game start...");
				//Insert loading screen here
				setTimeout(checkReady, 1000); // Check every second
			}
		};
		checkReady();
	}

	drawFrame() {
        // This function will be called recursively using requestAnimationFrame
        // Draw the current game state
        this.drawBoard(this.lastGameState);

        // Request the next animation frame
        if (this.game_running) {
            requestAnimationFrame(() => this.drawFrame());
        }
    }
};

// var sendMessageButton = document.querySelector('.test-send-button');
// var messageInput = document.querySelector('.test-message-input');

// var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/pong/');

// sendMessageButton.addEventListener('click', function() {
// var messageText = messageInput.value.trim();

// 	if (messageText) {
// 		chatSocket.send(JSON.stringify({ 
// 			'type':'notification',
// 			'message':messageText,
// 		}));
// 		messageInput.value = '';
// 	}
// });

// messageInput.addEventListener('keypress', function(event) {
// 	if (event.key === 'Enter') {
// 		event.preventDefault();
// 		sendMessageButton.click();
// 	}
// });

// chatSocket.onmessage = function(e) {
// 	var data = e.data;
// 	console.log(data);
// };
