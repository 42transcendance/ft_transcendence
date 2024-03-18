import json
import time

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.groupsManager import GroupsManager

pongGroupsManager = GroupsManager()

class pongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = pongGroupsManager.join_group()
        if self.group_name != None:
            pongGroupsManager.group_add_user(self.group_name, self.channel_name)
        else:
            self.group_name = pongGroupsManager.add_group(2)
            pongGroupsManager.group_add_user(self.group_name, self.channel_name)

        await self.channel_layer.group_add( self.group_name, self.channel_name )
        await self.accept()
    
    async def disconnect(self, close_code):
        pongGroupsManager.group_remove_user(self.group_name, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        message_data = data.get('message')

        # print('Type : [' + message_type + ']')
        # print('Message : ', message_data)
        # print("List of groups : ")
        # pongGroupsManager.list_groups()
        # print("Group of user : ", self.group_name)

    #     if message_type == "notification":
    #         await self.send_to_group(self.group_name, message_data)

    # async def send_to_group(self, group_name, message):
    #     channel_layer = self.channel_layer
    #     await channel_layer.group_send(
    #         group_name,
    #         {
    #             "type": "chat.message",  # Assuming you have a method named chat_message to handle messages in the group
    #             "message": message,
    #         }
    #     )

    # async def chat_message(self, event):
    #     message = event["message"]

    #     # Send message to WebSocket
    #     await self.send(text_data=json.dumps({"message": message}))
    
    async def updateGameState(self, event):
        pass

    async def writeOnScreen(self, event):
        pass
    
    async def startingCountDown(self, event):
        pass
    