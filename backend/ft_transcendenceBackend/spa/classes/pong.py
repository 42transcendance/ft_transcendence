class Paddle :
    def __init__(self, name) -> None:
        self.name = name
        self.width = None
        self.height = None
        self.x = None
        self.y = None

class Ball :
    def __init__(self) -> None:
        self.x = None
        self.y = None
        self.width = None
        self.direction = -1
        self.speed = 5

class PongGame :
    def __init__(self) -> None:
        self.width = None
        self.height = None
        self.player = Paddle("Player")
        self.opponent = Paddle("Opponent")
        self.ball = Ball()
    # def gameLoop (self):
        # pass