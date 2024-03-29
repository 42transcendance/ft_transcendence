import time
from channels.layers import get_channel_layer
import asyncio

STD_WIDTH = 300
STD_HEIGHT = 200

channel_layer = get_channel_layer()

class Paddle :
    def __init__(self, side) -> None:
        self.width = 4
        self.height = 27
        self.x = 7 if side == 'left' else STD_WIDTH - (7 + self.width)
        self.y = STD_HEIGHT / 2 - self.height / 2
        self.speed = 2

        self.direction = 'idle'

class Ball :
    def __init__(self) -> None:
        self.x = STD_WIDTH / 2
        self.y = STD_HEIGHT / 2
        self.radius = 3
        self.direction = 0
        self.speed = 2

class PongGame :
    def __init__(self,  groupChannel) -> None:
        self.width = STD_WIDTH
        self.height = STD_HEIGHT

        self.leftPlayerPaddle = Paddle('left')
        self.rightPlayerPaddle = Paddle('right')

        self.ball = Ball()
        self.leftPlayerScore = 0
        self.rightPlayerScore = 0
        self.defaultFontSize = 150
        self.defaultFont = "Arial"
        self.groupChannel = groupChannel
        self.rebounds = 0

        self.leftPlayerChannel = None
        self.rightPlayerChannel = None

        self.leftPlayerDirection = 'idle'
        self.rightPlayerDirection = 'idle'
    
    async def setDirection(self, paddle, message):
        if message == 'wPress':
            if paddle == 'left':
                self.leftPlayerDirection = 'up'
            elif paddle == 'right':
                self.rightPlayerDirection = 'up'

        elif message == 'sPress':
            if paddle == 'left':
                self.leftPlayerDirection = 'down'
            elif paddle == 'right':
                self.rightPlayerDirection = 'down'

        elif message == 'wRelease' or message == 'sRelease':
            if paddle == 'left':
                self.leftPlayerDirection = 'idle'
            elif paddle == 'right':
                self.rightPlayerDirection = 'idle'
    

    def setPlayerChannel (self, channel):
        if self.leftPlayerChannel is None:
            self.leftPlayerChannel = channel
            return ('left')
        elif self.rightPlayerChannel is None:
            self.rightPlayerChannel = channel
            return ('right')
    
    def to_dict(self):
        return {
            'width': self.width,
            'height': self.height,
            'leftPlayerScore': self.leftPlayerScore,
            'rightPlayerScore': self.rightPlayerScore,
            'defaultFontSize': self.defaultFontSize,
            'defaultFont': self.defaultFont,
            'leftPlayerPaddle': {
                'x': self.leftPlayerPaddle.x,
                'y': self.leftPlayerPaddle.y,
                'width': self.leftPlayerPaddle.width,
                'height': self.leftPlayerPaddle.height,
                'speed': self.leftPlayerPaddle.speed,
            },
            'rightPlayerPaddle': {
                'x': self.rightPlayerPaddle.x,
                'y': self.rightPlayerPaddle.y,
                'width': self.rightPlayerPaddle.width,
                'height': self.rightPlayerPaddle.height,
                'speed': self.rightPlayerPaddle.speed,
            },
            'ball': {
                'x': self.ball.x,
                'y': self.ball.y,
                'radius': self.ball.radius,
                'direction': self.ball.direction,
                'speed': self.ball.speed
            },
        }

    async def updatePaddlePositions(self):
        if self.leftPlayerDirection == 'up':
            if self.leftPlayerPaddle.y > 0:
                self.leftPlayerPaddle.y -= self.leftPlayerPaddle.speed
            elif self.leftPlayerPaddle.y < 0:
                self.leftPlayerPaddle.y = 0

        elif self.leftPlayerDirection == 'down':
            if self.leftPlayerPaddle.y < self.height - self.leftPlayerPaddle.height:
                self.leftPlayerPaddle.y += self.leftPlayerPaddle.speed
            elif self.leftPlayerPaddle.y > self.height - self.leftPlayerPaddle.height:
                self.leftPlayerPaddle.y = self.height - self.leftPlayerPaddle.height

        if self.rightPlayerDirection == 'up':
            if self.rightPlayerPaddle.y > 0:
                self.rightPlayerPaddle.y -= self.rightPlayerPaddle.speed
            elif self.rightPlayerPaddle.y < 0:
                self.rightPlayerPaddle.y = 0

        elif self.rightPlayerDirection == 'down':
            if self.rightPlayerPaddle.y < self.height - self.rightPlayerPaddle.height:
                self.rightPlayerPaddle.y += self.rightPlayerPaddle.speed
            elif self.rightPlayerPaddle.y > self.height - self.rightPlayerPaddle.height:
                self.rightPlayerPaddle.y = self.height - self.rightPlayerPaddle.height


    async def countdown (self):
        start = 5
        while start > 0:
            await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'countdown',
                'countdown': start,
            })
            start -= 1
            await asyncio.sleep(1)

    async def gameLoop(self):
        await self.countdown()
        while self.leftPlayerScore < 5 and self.rightPlayerScore < 5 and self.rebounds < 50:
            await self.updatePaddlePositions()
            if self.ball.direction == 0:
                self.ball.x -= 1 * self.ball.speed
                if self.ball.x - self.ball.radius <= 0:
                    self.ball.x = 0
                    self.ball.direction = 1
                    self.rebounds += 1
            elif self.ball.direction == 1:
                self.ball.x += 1 * self.ball.speed
                if self.ball.x + self.ball.radius >= self.width:
                    self.ball.x = self.width
                    self.ball.direction = 0
                    self.rebounds += 1
            
            await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'send.game.state',
                'gameState': self,
            })
            await asyncio.sleep(1 / 65)