import json
import time

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.groupsManager import GroupsManager

pongGroupsManager = GroupsManager()

class pongConsumer(AsyncWebsocketConsumer):
    # On Connection, The new user is added  to a game group
    async def connect(self):
        self.group_name = pongGroupsManager.join_group(self.channel_name)
        await self.channel_layer.group_add( self.group_name, self.channel_name )
        self.groupObject = pongGroupsManager.get_group_by_name(self.group_name)
        pongGroupsManager.list_groups()
        await self.accept()
    
    async def disconnect(self, close_code):
        # WTD : Delete game Task on disconnection
        pongGroupsManager.group_remove_user(self.group_name, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        message = data.get('message')

        if message_type == 'user.ready':
            self.groupObject.createGame()
            self.groupObject.userReady()

            self.side = self.groupObject.gameObject.setPlayerChannel(self.channel_name)

            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send.game.state',
                'gameState': self.groupObject.gameObject,
            })
            if self.groupObject.ready == 2:
                self.groupObject.startGameTask()
                await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'game.starting',
                    'message': 'Game Starting !',
                })
        
        if message_type == 'user.input':
            if self.groupObject.gameObject.leftPlayerChannel == self.channel_name:
                await self.groupObject.gameObject.setDirection('left', message)
            elif self.groupObject.gameObject.rightPlayerChannel == self.channel_name:
                await self.groupObject.gameObject.setDirection('right', message)

    async def send_game_state(self, event):
        game_state = event['gameState']
        game_state_json = {
            'type': 'game.state',
            **game_state.to_dict(),
        }
        await self.send(text_data=json.dumps(game_state_json))
    
    async def game_starting(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'game.starting',
            'message':message,
        }))

    async def countdown(self, event):
        countdown = event['countdown']
        await self.send(text_data=json.dumps({
            'type': 'countdown',
            'countdown':countdown,
        }))