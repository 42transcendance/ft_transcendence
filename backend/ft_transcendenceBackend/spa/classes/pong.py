import time
from channels.layers import get_channel_layer
import asyncio
import math

STD_WIDTH = 300
STD_HEIGHT = 200

channel_layer = get_channel_layer()

class Paddle :
    def __init__(self, side) -> None:
        self.width = 4
        self.height = 27
        self.x = 7 if side == 'left' else STD_WIDTH - (7 + self.width)
        self.y = STD_HEIGHT / 2 - self.height / 2
        self.speed = 4
        self.direction = 'idle'

class Ball :
    def __init__(self) -> None:
        self.x = STD_WIDTH / 2
        self.y = STD_HEIGHT / 2
        self.radius = 3
        self.direction = math.pi
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
        self.interval = None

        self.leftPlayerName = None
        self.rightPlayerName = None
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
    

    def setPlayer (self, userChannel, userName):
        if self.leftPlayerChannel is None:
            self.leftPlayerChannel = userChannel
            self.leftPlayerName = userName
            return ('left')
        elif self.rightPlayerChannel is None:
            self.rightPlayerChannel = userChannel
            self.rightPlayerName = userName
            return ('right')
    
    def to_dict(self):
        return {
            'width': self.width,
            'height': self.height,
            'defaultFontSize': self.defaultFontSize,
            'defaultFont': self.defaultFont,
            'leftPlayerName': self.leftPlayerName,
            'leftPlayerScore': self.leftPlayerScore,
            'leftPlayerPaddle': {
                'x': self.leftPlayerPaddle.x,
                'y': self.leftPlayerPaddle.y,
                'width': self.leftPlayerPaddle.width,
                'height': self.leftPlayerPaddle.height,
                'speed': self.leftPlayerPaddle.speed,
            },
            'rightPlayerName': self.rightPlayerName,
            'rightPlayerScore': self.rightPlayerScore,
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

    async def updateBallPosition(self):
        self.ball.x += math.cos(self.ball.direction) * self.ball.speed
        self.ball.y += math.sin(self.ball.direction) * self.ball.speed

        if self.ball.y >= self.leftPlayerPaddle.y and self.ball.y <= self.leftPlayerPaddle.y + self.leftPlayerPaddle.height and self.ball.x - self.ball.radius <= self.leftPlayerPaddle.x + self.leftPlayerPaddle.width:
            relativeIntersectY = (self.leftPlayerPaddle.y + (self.leftPlayerPaddle.height / 2)) - self.ball.y
            normalizedRelativeIntersectY = relativeIntersectY / (self.leftPlayerPaddle.height / 2)
            bounceAngle = normalizedRelativeIntersectY * (math.pi / 3)
            self.ball.direction = math.pi * 2 - bounceAngle
            self.ball.speed += 0.5

        elif self.ball.x <= self.leftPlayerPaddle.x + self.leftPlayerPaddle.width - 2:
            self.ball.x = self.width / 2
            self.ball.y = self.height / 2
            self.leftPlayerScore += 1
            self.interval = time.time()

        if self.ball.y >= self.rightPlayerPaddle.y and self.ball.y <= self.rightPlayerPaddle.y + self.rightPlayerPaddle.height and self.ball.x + self.ball.radius >= self.rightPlayerPaddle.x:
            relativeIntersectY = (self.rightPlayerPaddle.y + (self.rightPlayerPaddle.height / 2)) - self.ball.y
            normalizedRelativeIntersectY = relativeIntersectY / (self.rightPlayerPaddle.height / 2)
            bounceAngle = normalizedRelativeIntersectY * (math.pi / 3)
            self.ball.direction = math.pi + bounceAngle
            self.ball.speed += 0.5

        elif self.ball.x >= self.rightPlayerPaddle.x - 2:
            self.ball.x = self.width / 2
            self.ball.y = self.height / 2
            self.rightPlayerScore += 1
            self.interval = time.time()

        if ((self.ball.y + self.ball.radius) >= self.height):
            self.ball.direction = math.atan2(math.sin(self.ball.direction) * -1, math.cos(self.ball.direction))
        elif ((self.ball.y - self.ball.radius) <= 0):
            self.ball.direction = math.atan2(math.sin(self.ball.direction) * -1, math.cos(self.ball.direction))


    async def countdown (self, time):
        start = time
        while start > -1:
            await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'countdown',
                'countdown': start,
            })
            start -= 1
            await asyncio.sleep(1)

    async def gameLoop(self):
        await self.countdown(5)
        while self.leftPlayerScore < 5 and self.rightPlayerScore < 5:
            await self.updatePaddlePositions()
            if self.interval != None:
                if time.time() - self.interval >= 1:
                    self.interval = None
            else:
                await self.updateBallPosition()
            await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'send.game.state',
                'gamestate': self,
            })
            await asyncio.sleep(1 / 60)
        await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'ending.game',
                'gamestate': self,
            }
        )