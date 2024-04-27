import json
import time

from ..views import extract_user_info_from_token
from ..models import CustomUser
from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.DuelsManager import DuelsManager

DuelsManager = DuelsManager()

class pongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        if self.user_id == None or self.username == None:
            await self.close(code=1000)
        else:
            user = await sync_to_async(CustomUser.objects.get)(userid=self.user_id)
            self.username = user.username
            print("WS Connection : ", self.username, " ", self.user_id)
            # Each user belongs to a group bearing the same name as user_id
            await self.accept()
    
    async def disconnect(self, close_code):
        print("Disconnect")
        DuelsManager.remove_user_from_room(self.user_id, self.room_id)
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        DuelsManager.debug()
        await self.send(text_data=json.dumps({
            "type": "websocket.close",
            "code": 1000,
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Data received : ", data)
        message_type = data.get('type')

        if message_type == 'join.matchmaking':
            self.room_id = DuelsManager.find_room(self.user_id)
            await self.channel_layer.group_add( self.room_id, self.channel_name )
        elif message_type == 'create.private.game':
            # Create a private game and waits for whitelisted player to join
            # !!!
            # Private Games will have an id starting with private-pong-
            # So you dont have to clone the add/remove function
            # Basically just create a create private room, and join private room
            # !!!
            pass
        elif message_type == 'join.private.game':
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