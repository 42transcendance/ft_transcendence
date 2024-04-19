import json
import time

from ..views import extract_user_info_from_token
from ..models import CustomUser
from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.DuelGroupsManager import DuelGroupsManager

pongGroupsManager = DuelGroupsManager()

class pongConsumer(AsyncWebsocketConsumer):
    # On Connection, The new user is added  to a game group
    async def connect(self):
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        if self.user_id == None or self.username == None:
            self.close()
        user = await sync_to_async(CustomUser.objects.get)(userid=self.user_id)
        self.username = user.username

        self.group_name = pongGroupsManager.join_group(self.channel_name)
        await self.channel_layer.group_add( self.group_name, self.channel_name )
        self.groupObject = pongGroupsManager.get_group_by_name(self.group_name)
        pongGroupsManager.list_groups()
        await self.accept()
    
    async def disconnect(self, close_code):
        print("This is a test ")
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'ending.game',
                'gamestate': 'None',
            }
        )
        await self.send(text_data=json.dumps({
            "type": "websocket.close",
            "code": 1000,
        }))
        await self.groupObject.stopGameTask()
        pongGroupsManager.group_remove_user(self.group_name, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        message = data.get('message')

        if message_type == 'user.ready':
            self.groupObject.createGame()
            self.groupObject.userReady()

            self.side = self.groupObject.gameObject.setPlayer(self.channel_name, self.username)

            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send.game.state',
                'gamestate': self.groupObject.gameObject,
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
        game_state = event['gamestate']
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
    
    async def ending_game(self, event):
        game_state = event['gamestate']
        if event['gamestate'] != 'None':
            await self.send(text_data=json.dumps({
                'type': 'ending.game',
                **game_state.to_dict(),
            }))
        else:
            await self.send(text_data=json.dumps({
                'type': 'ending.game'
            }))
        await self.close()