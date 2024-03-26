import json
import time

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.groupsManager import GroupsManager

pongGroupsManager = GroupsManager()

class pongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ready = 0
        self.group_name = pongGroupsManager.join_group()
        if self.group_name != None:
            pongGroupsManager.group_add_user(self.group_name, self.channel_name)
        else:
            self.group_name = pongGroupsManager.add_group(2)
            pongGroupsManager.group_add_user(self.group_name, self.channel_name)

        await self.channel_layer.group_add( self.group_name, self.channel_name )
        self.groupObject = pongGroupsManager.get_group_by_name(self.group_name)

        await self.accept()
    
    async def disconnect(self, close_code):
        pongGroupsManager.group_remove_user(self.group_name, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'user.ready':
            self.groupObject.createGame('Player1', 'Player2')
            if self.ready == 0:
                self.groupObject.userReady()
                self.ready += 1
            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_game_state',
                'gameState': self.groupObject.gameObject,
            })

    async def send_game_state(self, event):
        game_state = event['gameState']
        game_state_json = {
            'type': 'game.state',  # Adding the type message
            **game_state.to_dict()  # Use dictionary unpacking to include other properties
        }

        # Send message to WebSocket
        await self.send(text_data=json.dumps(game_state_json))
    