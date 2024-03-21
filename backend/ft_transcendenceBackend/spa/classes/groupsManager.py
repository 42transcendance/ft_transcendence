from uuid import uuid4
from .pong import PongGame

class Group :
    def __init__(self, groupName, max_capacity) -> None:
        self.max_capacity = max_capacity
        self.capacity = 0
        self.name = groupName
        self.users = set()
        self.gameObject = None
        self.gameThread = None

class GroupsManager :
    def __init__(self) -> None:
        self.groups = set()

    def get_group_by_name(self, group_name):
            for group in self.groups:
                if group.name == group_name:
                    return group
            return None
    
    def list_groups(self):
        for group in self.groups :
            print(group.name)

    def join_group(self) -> str:
        for group in self.groups:
            if group.capacity == 1:
                return group.name
        return None

    def add_group(self, max_capacity) -> str:
        group_name = 'pong-' + str(uuid4())[:8]
        while self.get_group_by_name(group_name):
            group_name = str(uuid4())[:8]
    
        newGroup = Group(group_name, max_capacity)
        self.groups.add(newGroup)
    
        # print(f"Group '{group_name}' added.")
        return group_name

    def remove_group (self, group_name) :
        group_to_remove = self.get_group_by_name(group_name)
        if group_to_remove:
            self.groups.remove(group_to_remove)
            # print(f"Group '{group_name}' removed.")
            return 0
        else:
            # print(f"Group '{group_name}' does not exist.")
            return 1
    
    def group_add_user (self, groupName, userChannel):
        targetGroup = self.get_group_by_name(groupName)
        if targetGroup == None:
            print("Error: ", groupName, " does not exist.")
            return (1)
        if targetGroup.capacity == 2:
            print("Error: ", targetGroup.name, " is full.")
            return  (1)
        targetGroup.users.add(userChannel)
        targetGroup.capacity += 1
        if targetGroup.capacity == 1 :
            targetGroup.gameObject = PongGame ()

    def group_remove_user (self, groupName, userChannel):
        targetGroup = self.get_group_by_name(groupName)
        if targetGroup == None:
            print("Error: ", groupName, " does not exist.")
            return (1)
        targetGroup.users.remove(userChannel)
        targetGroup.capacity -= 1
        if targetGroup.capacity == 0:
            # print("Group is empty, being removed : ", groupName)
            self.remove_group(groupName)