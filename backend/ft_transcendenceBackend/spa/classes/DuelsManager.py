from uuid import uuid4
from .pong import PongGame
import asyncio

class DuelRoom :
    def __init__(self, groupName) -> None:
        self.groupChannel = groupName
        self.max_capacity = 2
        self.ready = 0
        self.capacity = 0
        self.users = set()
        self.gameObject = None
        self.gameTask = None

    def createGame (self):
        if self.gameObject is None:
            self.gameObject = PongGame(self.groupChannel)

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

class DuelsManager :
    def __init__(self) -> None:
        self.DuelRooms = set()

    # Return a group object by taking the groupname, returns none if group wasnt found
    def get_group_by_name(self, group_name):
            for group in self.groups:
                if group.groupChannel == group_name:
                    return group
            return None
    
    # List groups and users inside them
    def list_groups(self):
        for group in self.groups :
            print(group.groupChannel)
            for user in group.users:
                print('Users in group : ', user)
    
    # Joins group if possible, otherwise creates a new group and joins it
    def join_group(self, userChannel) -> str:
        for group in self.groups:
            if group.capacity == 1:
                self.group_add_user(group.groupChannel, userChannel)
                return group.groupChannel
        groupChannel = self.add_group()
        self.group_add_user(groupChannel, userChannel)
        return groupChannel

    # Add a group and gives it a random uuid4 name
    def add_group(self) -> str:
        group_name = 'pong-' + str(uuid4())[:8]
        while self.get_group_by_name(group_name):
            group_name = str(uuid4())[:8]
        newGroup = DuelGroup(group_name)
        self.groups.add(newGroup)
        return group_name

    # Removes a group
    def remove_group (self, group_name) :
        group_to_remove = self.get_group_by_name(group_name)
        if group_to_remove:
            self.groups.remove(group_to_remove)
            return 0
        else:
            return 1
    
    # Adds a user (userChannel) to a group (groupName)
    def group_add_user (self, groupName, userChannel):
        targetGroup = self.get_group_by_name(groupName)
        if targetGroup == None:
            print("Error group_add_user: ", groupName, " does not exist.")
            return (1)
        if targetGroup.capacity == 2:
            print("Error: ", targetGroup.groupChannel, " is full.")
            return  (1)
        targetGroup.users.add(userChannel)
        targetGroup.capacity += 1

    # Removes a user from a group, and removes the group if it becomes empty
    def group_remove_user (self, groupName, userChannel):
        targetGroup = self.get_group_by_name(groupName)
        if targetGroup == None:
            print("Error group_remove_user: ", groupName, " does not exist.")
            return (1)
        targetGroup.users.remove(userChannel)
        targetGroup.capacity -= 1
        if targetGroup.capacity == 0:
            self.remove_group(groupName)