import time
from channels.layers import get_channel_layer
import asyncio

STD_WIDTH = 300
STD_HEIGHT = 200

channel_layer = get_channel_layer()

class Paddle :
    def __init__(self, name, side) -> None:
        self.name = name
        self.width = 4
        self.height = 27
        self.x = 7 if side == 'left' else STD_WIDTH - (7 + self.width)
        self.y = STD_HEIGHT / 2 - self.height / 2

class Ball :
    def __init__(self) -> None:
        self.x = STD_WIDTH / 2
        self.y = STD_HEIGHT / 2
        self.radius = 3
        self.direction = 0
        self.speed = 5

class PongGame :
    def __init__(self, leftPlayer, rightPlayer, groupChannel) -> None:
        self.width = STD_WIDTH
        self.height = STD_HEIGHT
        self.leftPlayer = Paddle(leftPlayer, 'left')
        self.rightPlayer = Paddle(rightPlayer, 'right')
        self.ball = Ball()
        self.player_score = 0
        self.opponent_score = 0
        self.defaultFontSize = 150
        self.defaultFont = "Arial"
        self.groupChannel = groupChannel

    def to_dict(self):
        return {
            'width': self.width,
            'height': self.height,
            'player_score': self.player_score,
            'opponent_score': self.opponent_score,
            'defaultFontSize': self.defaultFontSize,
            'defaultFont': self.defaultFont,
            'leftPlayer': {
                'name': self.leftPlayer.name,
                'x': self.leftPlayer.x,
                'y': self.leftPlayer.y,
                'width': self.leftPlayer.width,
                'height': self.leftPlayer.height
            },
            'rightPlayer': {
                'name': self.rightPlayer.name,
                'x': self.rightPlayer.x,
                'y': self.rightPlayer.y,
                'width': self.rightPlayer.width,
                'height': self.rightPlayer.height
            },
            'ball': {
                'x': self.ball.x,
                'y': self.ball.y,
                'radius': self.ball.radius,
                'direction': self.ball.direction,
                'speed': self.ball.speed
            },
        }
    
    async def gameLoop(self):
        end_time = 0
        while end_time <= 30:
            print(end_time)
            if self.ball.direction == 0:
                self.ball.x -= 1
                if self.ball.x - self.ball.radius <= 0:
                    self.ball.x = 0
                    self.ball.direction = 1
            elif self.ball.direction == 1:
                self.ball.x += 1
                if self.ball.x + self.ball.radius >= self.width:
                    self.ball.x = self.width
                    self.ball.direction = 0
            await channel_layer.group_send(
            self.groupChannel,
            {
                'type': 'send.game.state',
                'gameState': self,
            })
            await asyncio.sleep(0.016)
            end_time += 0.016