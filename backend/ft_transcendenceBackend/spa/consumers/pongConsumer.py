import json
import time

from ..views import extract_user_info_from_token
from ..models import CustomUser
from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.DuelsManager import DuelsManager

DuelsManager = DuelsManager()

class pongConsumer(AsyncWebsocketConsumer):
    # On Connection, The new user is added  to a game group
    async def connect(self):
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        if self.user_id == None or self.username == None:
            await self.close(code=1000)
        else:
            user = await sync_to_async(CustomUser.objects.get)(userid=self.user_id)
            self.username = user.username
            print("WS Connection : ", self.username, " ", self.user_id)
            await self.accept()
    
    async def disconnect(self, close_code):
        print("Disconnect")

        # await self.channel_layer.group_send(
        #     self.group_name,
        #     {
        #         'type': 'ending.game',
        #         'gamestate': 'None',
        #     }
        # )
        await self.send(text_data=json.dumps({
            "type": "websocket.close",
            "code": 1000,
        }))
        # await self.groupObject.stopGameTask()
        # pongGroupsManager.group_remove_user(self.group_name, self.channel_name)
        # await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Data received : ", data)
        message_type = data.get('type')
        message = data.get('message')

        if message_type == 'join_matchmaking':
            # Joins matchmaking
            pass
        if message_type == 'create.private.game':
            # Create a private game and waits for whitelisted player to join
            pass
        if message_type == 'join.private.game':
            # Joins private game using game-id
            pass


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