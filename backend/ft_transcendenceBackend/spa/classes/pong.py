class Paddle :
    def __init__(self, name, game) -> None:
        self.name = name
        self.x = None
        self.y = None

class Ball :
    def __init__(self, game) -> None:
        self.x = game.width / 2
        self.y = game.height / 2
        self.direction = -1
        self.speed = 5

class PongGame :
    def __init__(self, boardWidth, boardHeight) -> None:
        self.width = boardWidth
        self.height = boardHeight
        self.player = Paddle("Player", self)
        self.opponent = Paddle("Opponent", self)
        self.ball = Ball(self)