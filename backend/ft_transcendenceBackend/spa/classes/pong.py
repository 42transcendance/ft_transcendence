import time
from channels.layers import get_channel_layer
from ..models import CustomUser, Game, GameHistory
from asgiref.sync import sync_to_async
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
        self.speed = 3

class Ball :
    def __init__(self) -> None:
        self.x = STD_WIDTH / 2
        self.y = STD_HEIGHT / 2
        self.radius = 3
        self.direction = math.pi
        self.speed = 3

class PongGame :
    def __init__(self,  room_id) -> None:
        self.width = STD_WIDTH
        self.height = STD_HEIGHT

        self.leftPlayerPaddle = Paddle('left')
        self.rightPlayerPaddle = Paddle('right')

        self.ball = Ball()
        self.leftPlayerScore = 0
        self.rightPlayerScore = 0
        self.defaultFontSize = 150
        self.defaultFont = "Arial"
        self.room_id = room_id
        self.interval = None

        self.leftPlayerName = None
        self.rightPlayerName = None
        self.leftPlayerId = None
        self.rightPlayerId = None

    def setPlayer (self, user_id, userName):
        if self.leftPlayerId is None:
            self.leftPlayerId = user_id
            self.leftPlayerName = userName
            return ('left')
        elif self.rightPlayerId is None:
            self.rightPlayerId = user_id
            self.rightPlayerName = userName
            return ('right')
    
    def to_dict(self):
        return {
            'width': self.width,
            'height': self.height,
            'defaultFontSize': self.defaultFontSize,
            'defaultFont': self.defaultFont,
            'leftPlayerName': self.leftPlayerName,
            'leftPlayerId': self.leftPlayerId,
            'leftPlayerScore': self.leftPlayerScore,
            'leftPlayerPaddle': {
                'x': self.leftPlayerPaddle.x,
                'y': self.leftPlayerPaddle.y,
                'width': self.leftPlayerPaddle.width,
                'height': self.leftPlayerPaddle.height,
                'speed': self.leftPlayerPaddle.speed,
            },
            'rightPlayerName': self.rightPlayerName,
            'rightPlayerId': self.rightPlayerId,
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

    async def updateBallPosition(self):

        self.ball.x += math.cos(self.ball.direction) * self.ball.speed
        self.ball.y += math.sin(self.ball.direction) * self.ball.speed

        if self.ball.y >= self.leftPlayerPaddle.y and self.ball.y <= self.leftPlayerPaddle.y + self.leftPlayerPaddle.height and self.ball.x - self.ball.radius <= self.leftPlayerPaddle.x + self.leftPlayerPaddle.width:
            relativeIntersectY = (self.leftPlayerPaddle.y + (self.leftPlayerPaddle.height / 2)) - self.ball.y
            normalizedRelativeIntersectY = relativeIntersectY / (self.leftPlayerPaddle.height / 2)
            bounceAngle = normalizedRelativeIntersectY * (math.pi / 3)
            self.ball.direction = math.pi * 2 - bounceAngle
            if (self.ball.speed < 10):
                self.ball.speed += 0.5

        elif self.ball.x <= self.leftPlayerPaddle.x + self.leftPlayerPaddle.width - 2:
            self.ball.x = self.width / 2
            self.ball.y = self.height / 2
            self.rightPlayerScore += 1
            self.interval = time.time()
            self.ball.speed = 3

        if self.ball.y >= self.rightPlayerPaddle.y and self.ball.y <= self.rightPlayerPaddle.y + self.rightPlayerPaddle.height and self.ball.x + self.ball.radius >= self.rightPlayerPaddle.x:
            relativeIntersectY = (self.rightPlayerPaddle.y + (self.rightPlayerPaddle.height / 2)) - self.ball.y
            normalizedRelativeIntersectY = relativeIntersectY / (self.rightPlayerPaddle.height / 2)
            bounceAngle = normalizedRelativeIntersectY * (math.pi / 3)
            self.ball.direction = math.pi + bounceAngle
            if (self.ball.speed < 10):
                self.ball.speed += 0.5

        elif self.ball.x >= self.rightPlayerPaddle.x - 2:
            self.ball.x = self.width / 2
            self.ball.y = self.height / 2
            self.leftPlayerScore += 1
            self.interval = time.time()
            self.ball.speed = 3

        if ((self.ball.y + self.ball.radius) >= self.height):
            self.ball.direction = math.atan2(math.sin(self.ball.direction) * -1, math.cos(self.ball.direction))
        elif ((self.ball.y - self.ball.radius) <= 0):
            self.ball.direction = math.atan2(math.sin(self.ball.direction) * -1, math.cos(self.ball.direction))

    async def countdown (self, time):
        start = time
        while start > -1:
            await channel_layer.group_send(
            self.room_id,
            {
                'type': 'countdown',
                'countdown': start,
            })
            start -= 1
            await asyncio.sleep(1)

    async def gameLoop(self):
        await self.countdown(5)
        while self.leftPlayerScore < 5 and self.rightPlayerScore < 5:
            if self.interval != None:
                if time.time() - self.interval >= 1:
                    self.interval = None
            else:
                await self.updateBallPosition()
            await channel_layer.group_send(
            self.room_id,
            {
                'type': 'send.game.state',
                'gamestate': self,
            })
            await asyncio.sleep(1 / 60)

        response = self.to_dict()
        player1username = response['leftPlayerName']
        player2username = response['rightPlayerName']
        player1score = response['leftPlayerScore']
        player2score = response['rightPlayerScore']

        user1 = await sync_to_async(CustomUser.objects.get)(username=player1username)
        user2 = await sync_to_async(CustomUser.objects.get)(username=player2username)
        game =  await sync_to_async(Game.objects.create)(player1=user1, player2=user2, player1_score=player1score,player2_score=player2score)
        
        game_history_entry1 =  await sync_to_async(GameHistory.objects.create)(user=user1, game=game)
        game_history_entry2 =  await sync_to_async(GameHistory.objects.create)(user=user2, game=game)
        await channel_layer.group_send(
        self.room_id,
        {
            'type': 'ending.game',
            'gamestate': self,
        })
