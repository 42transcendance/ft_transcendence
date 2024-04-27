from uuid import uuid4
from .pong import PongGame
import asyncio

from .DuelRoom import DuelRoom
from .PrivateDuelRoom import PrivateDuelRoom

class DuelsManager :
    def __init__(self) -> None:
        self.PublicDuelRooms = set()
        self.PrivateDuelRooms = set()
    
    def debug(self):
        for room in self.DuelRooms:
            print("Users in room : ", room.room_id)
            for user in room.users:
                print("User : ",user)

    def get_room_by_id(self, room_id):
        for room in self.DuelRooms:
            if room.room_id == room_id:
                return room
        return None

    def find_room(self, user_id):
        for room in self.DuelRooms:
            if room.capacity <= 1 and room.status == "Waiting":
                self.add_user_to_room(user_id, room.room_id)
                return room.room_id
        newRoomId = self.create_room()
        self.add_user_to_room(user_id, newRoomId)
        return newRoomId

    def add_user_to_room(self, user_id, room_id):
        targetRoom = self.get_room_by_id(room_id)
        if (targetRoom.capacity <= targetRoom.max_capacity):
            targetRoom.users.add(user_id)
            targetRoom.capacity += 1

    def remove_user_from_room(self, user_id, room_id):
        targetRoom = self.get_room_by_id(room_id)
        if (targetRoom.capacity > 0):
            targetRoom.users.remove(user_id)
            targetRoom.capacity -= 1
        if (targetRoom.capacity == 0):
            self.delete_room(targetRoom.room_id)

    def create_room(self) -> str:
        room_id = 'public-pong-' + str(uuid4())[:8]
        while self.get_room_by_id(room_id):
            room_id = 'public-pong-' + str(uuid4())[:8]
        newRoom = DuelRoom(room_id)
        self.DuelRooms.add(newRoom)
        return room_id
    
    def delete_room(self, room_id):
        targetRoom = self.get_room_by_id(room_id)
        self.DuelRooms.remove(targetRoom)
