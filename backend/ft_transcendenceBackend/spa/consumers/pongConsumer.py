import json

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.groupsManager import GroupsManager

pongGroupsManager = GroupsManager()

class pongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # if join doesnt work
        # else add group
        self.room_group_name = pongGroupsManager.add_group(2)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        if pongGroupsManager.remove_group(self.room_group_name) == 0 :
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print('Type : ', data['type'])
        print('Message : ', data['message'])
        message_type = data['type']
        print('Group of user is : ', self.room_group_name)
        pongGroupsManager.list_groups()