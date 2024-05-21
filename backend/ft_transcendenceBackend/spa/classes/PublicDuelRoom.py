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
            print("Creating game object with id : ", self.room_id)
            self.gameObject = PongGame(self.room_id)

    def startGameTask(self):
        if self.gameTask is None:
            print("Creating game task with id : ", self.room_id)
            self.gameTask = asyncio.create_task(self.gameObject.gameLoop())

    async def stopGameTask(self):
        if self.gameTask is not None:
            print("Stopping game task with id : ", self.room_id)
            self.gameTask.cancel()
            try:
                await self.gameTask
            except asyncio.CancelledError:
                pass
            finally:
                self.gameTask = None
    
    def userReady (self):
        self.ready += 1