import asyncio
from .pong import PongGame

class PublicDuelRoom :
    def __init__(self, room_id) -> None:
        self.room_id = room_id
        self.max_capacity = 2
        self.ready = 0
        self.capacity = 0
        self.users = set() # Users IDs
        self.gameObject = None
        self.gameTask = None
        self.status = "Waiting"

    def createGame (self):
        if self.gameObject is None:
            self.gameObject = PongGame(self.room_id)

    def startGameTask(self):
        if self.gameTask is None:
            self.gameTask = asyncio.create_task(self.gameObject.gameLoop())

    async def stopGameTask(self):
        if self.gameTask is not None:
            self.gameTask.cancel()
            try:
                await self.gameTask
            except asyncio.CancelledError:
                pass
            finally:
                self.gameTask = None
    
    def userReady (self):
        self.ready += 1