from uuid import uuid4
from .pong import PongGame
import asyncio

from .PublicDuelRoom import PublicDuelRoom
from .PrivateDuelRoom import PrivateDuelRoom

class DuelsManager :
    def __init__(self) -> None:
        self.PublicDuelRooms = set()
        self.PrivateDuelRooms = set()
    
    def debug(self):
        print("------------------------DEBUG-----------------------------------")
        for room in self.PublicDuelRooms:
            print("Users in public room : ", room.room_id)
            for user in room.users:
                print("User : ",user)
        for room in self.PrivateDuelRooms:
            print("Users in private room : ", room.room_id)
            for user in room.users:
                print("User : ",user)
        print("----------------------------------------------------------------")
        
    def get_room_by_id(self, room_id):
        for room in self.PublicDuelRooms:
            if room.room_id == room_id:
                return room
        for room in self.PrivateDuelRooms:
            if room.room_id == room_id:
                return room
        return None

    def find_public_room(self, user_id):
        for room in self.PublicDuelRooms:
            if room.capacity <= 1 and room.status == "Waiting":
                self.add_user_to_room(user_id, room.room_id)
                return room.room_id
        newRoomId = self.create_public_room()
        self.add_user_to_room(user_id, newRoomId)
        return newRoomId

    def add_user_to_room(self, user_id, room_id):
        targetRoom = self.get_room_by_id(room_id)
        if (targetRoom.capacity <= targetRoom.max_capacity):
            targetRoom.users.add(user_id)
            targetRoom.capacity += 1

    def remove_user_from_room(self, user_id, room_id):
        targetRoom = self.get_room_by_id(room_id)
        if targetRoom == None:
            return
        if (targetRoom.capacity > 0):
            targetRoom.users.remove(user_id)
            targetRoom.capacity -= 1
        if (targetRoom.capacity == 0):
            self.delete_room(targetRoom.room_id)

    def create_public_room(self) -> str:
        room_id = 'public-pong-' + str(uuid4())[:8]
        while self.get_room_by_id(room_id):
            room_id = 'public-pong-' + str(uuid4())[:8]
        newRoom = PublicDuelRoom(room_id)
        self.PublicDuelRooms.add(newRoom)
        return room_id
    
    def create_private_room(self, user_id) -> str:
        room_id = 'private-pong-' + str(uuid4())[:8]
        while self.get_room_by_id(room_id):
            room_id = 'private-pong-' + str(uuid4())[:8]
        newRoom = PrivateDuelRoom(room_id)
        self.PrivateDuelRooms.add(newRoom)
        self.add_user_to_room(user_id, room_id)
        return room_id
    
    def join_private_room(self, userid, room_id_to_join):
        for room in self.PrivateDuelRooms:
            if room.room_id == room_id_to_join and room.capacity < room.max_capacity:
                self.add_user_to_room(userid, room_id_to_join)
                return(room.room_id)
        return None

    async def delete_room(self, room_id):
        targetRoom = self.get_room_by_id(room_id)
        if targetRoom:
            if targetRoom.room_id.startswith("public-"):
                await targetRoom.stopGameTask()
                self.PublicDuelRooms.remove(targetRoom)
            elif targetRoom.room_id.startswith("private-"):
                await targetRoom.stopGameTask()
                self.PrivateDuelRooms.remove(targetRoom)
