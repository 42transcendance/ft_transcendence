STD_WIDTH = 300
STD_HEIGHT = 200

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
        self.direction = -1
        self.speed = 5

class PongGame :
    def __init__(self, leftPlayer, rightPlayer) -> None:
        self.width = STD_WIDTH
        self.height = STD_HEIGHT
        self.leftPlayer = Paddle(leftPlayer, 'left')
        self.rightPlayer = Paddle(rightPlayer, 'right')
        self.ball = Ball()
        self.player_score = 0
        self.opponent_score = 0
    # def gameLoop (self):
        # pass

    def to_dict(self):
        return {
            'width': self.width,
            'height': self.height,
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
            'player_score': self.player_score,
            'opponent_score': self.opponent_score
        }