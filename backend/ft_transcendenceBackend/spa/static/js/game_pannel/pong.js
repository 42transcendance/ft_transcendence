class Game {
	constructor(playerName, opponentName) {

		this.test = document.getElementById('principal-container');
		this.canvas = document.getElementById('gameCanvas');
		this.context = this.canvas.getContext('2d');
		
		this.canvas.width = this.test.clientWidth;
		this.canvas.height = this.test.clientHeight;

		this.canvas.style.width = this.test.clientWidth + 'px';
		this.canvas.style.height = this.test.clientHeight + 'px';

		this.color = '#1f2938';

		this.running = this.over = false;
		this.scored = false;
	}

	connect() {
		// Assuming you're using WebSocket for communication
		this.pongSocket = new WebSocket('ws://' + window.location.host + '/ws/pong/');
	
		this.pongSocket.onopen = () => {
		  console.log('Connected to server');
		  this.connected = true;
		  this.waitForReadySignal();
		};
	
		this.pongSocket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);
			if (message.type === 'ready') {
				console.log('Both players are ready. Starting game...');
				this.ready = true;
				// Start the game here
			}
		};
	
		this.pongSocket.onerror = (error) => {
		  console.error('WebSocket error:', error);
		};
	}
		waitForReadySignal() {
		const checkReady = () => {
			if (!this.ready) {
			setTimeout(checkReady, 1000); // Check every second
			}
		};
		checkReady();
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
