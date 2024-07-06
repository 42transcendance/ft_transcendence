import json
import time
import asyncio

from ..views import extract_user_info_from_token
from ..models import CustomUser
from asgiref.sync import sync_to_async

from spa.models import CustomUser
from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer

from ..classes.DuelsManager import DuelsManager
from channels.db import database_sync_to_async

DuelsManager = DuelsManager()

class pongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        self.userObject = await database_sync_to_async(CustomUser.objects.get)(userid=str(self.user_id))

        if self.user_id == None or self.username == None:
            await self.close(code=1000)
        else:
            self.userObject = await database_sync_to_async(CustomUser.objects.get)(userid=self.user_id)
            self.username = self.userObject.username
            self.room_id = None
            self.userObject.ingame_counter += 1
            if self.userObject.ingame_counter > 0:
                self.userObject.is_ingame = True
            await database_sync_to_async(self.userObject.save)()
            print("Game connections : ", self.userObject.ingame_counter)
            await self.accept()
    
    async def disconnect(self, close_code):
        # Gotta check which type of game user is in and act accordingly
        await DuelsManager.delete_room(self.room_id)

        self.userObject.ingame_counter -= 1
        if self.userObject.ingame_counter <= 0:
            self.userObject.is_ingame = False
        await database_sync_to_async(self.userObject.save)()
        print("Game connections : ", self.userObject.ingame_counter)
        await self.channel_layer.group_send(
        self.room_id,
        {
            'type': 'ending.game',
            'gamestate': self.room_object.gameObject,
        })
        if self.room_id != None:
            await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.send(text_data=json.dumps({
            "type": "websocket.close",
            "code": 1000,
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        message = data.get('message')
        
        """
        Check if user is already in a game
        if self.room_id != None:
            self.send_notification("Error", "You are already involved in a game.")
            await self.close()
            return
        """
        
        if message_type == 'user.update':
            if self.side == 'right':
                self.room_object.gameObject.rightPlayerPaddle.x = data.get('paddleX')
                self.room_object.gameObject.rightPlayerPaddle.y = data.get('paddleY')
            elif self.side == 'left':
                self.room_object.gameObject.leftPlayerPaddle.x = data.get('paddleX')
                self.room_object.gameObject.leftPlayerPaddle.y = data.get('paddleY')
        
        elif message_type == 'join.matchmaking':
            self.room_id = DuelsManager.find_public_room(self.user_id)
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            self.room_object = DuelsManager.get_room_by_id(self.room_id)
            self.room_object.createGame()
            self.room_object.userReady()
            self.side = self.room_object.gameObject.setPlayer(self.user_id, self.username)

            await self.send(text_data=json.dumps({
                'type': 'game.setup',
                'side': self.side,
                'userid': self.user_id,
                'username': self.username,
            }))

            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'send.game.state',
                'gamestate': self.room_object.gameObject,
            })
            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'matchmaking',
            })
            if self.room_object.ready == 2:
                await self.channel_layer.group_send(
                self.room_id,
                {
                    'type': 'game.starting',
                })
                self.room_object.startGameTask()
            else:
                await self.channel_layer.group_send(
                self.room_id,
                {
                    'type': 'matchmaking',
                })

            tasks = asyncio.all_tasks()

        elif message_type == 'create.private.game':
            # Create a private game
            """
                Request when creating a private game :
                {
                    "type" : "create.private.game",
                    "userid_of_oponent": userid,
                }
            """
            self.room_id = DuelsManager.create_private_room(self.user_id)
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            self.room_object = DuelsManager.get_room_by_id(self.room_id)
            self.room_object.createGame()
            self.room_object.userReady()
            self.side = self.room_object.gameObject.setPlayer(self.user_id, self.username)
            self.room_id = self.room_object.room_id
            await self.send(text_data=json.dumps({
                'type': 'game.setup',
                'side': self.side,
                'userid': self.user_id,
                'username': self.username,
                'room_id': self.room_id,
            }))

            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'send.game.state',
                'gamestate': self.room_object.gameObject,
            })
            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'matchmaking',
            })

        elif message_type == 'join.private.game':
            # Joins private game using game-id
            """
                Request when joining a private game :
                {
                    "type" : "join.private.game",
                    "room_id": room_id,
                }
            """
            room_id_to_join = data.get('room_id')
            self.room_id = DuelsManager.join_private_room(self.user_id, room_id_to_join)
            if self.room_id == None:
                await self.send_notification("Error", "Cannot join private room")
                return
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            self.room_object = DuelsManager.get_room_by_id(self.room_id)
            self.room_object.userReady()
            self.side = self.room_object.gameObject.setPlayer(self.user_id, self.username)
            await self.send(text_data=json.dumps({
                'type': 'game.setup',
                'side': self.side,
                'userid': self.user_id,
                'username': self.username,
            }))
            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'send.game.state',
                'gamestate': self.room_object.gameObject,
            })
            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'matchmaking',
            })
            if self.room_object.ready == 2:
                await self.channel_layer.group_send(
                self.room_id,
                {
                    'type': 'game.starting',
                })
                self.room_object.startGameTask()


    async def send_notification(self, type, message):
        await self.send(text_data=json.dumps({
            'type': type,
            'message': message
        }))

    async def send_game_state(self, event):
        game_state = event['gamestate']
        game_state_json = {
            'type': 'game.state',
            **game_state.to_dict(),
        }
        await self.send(text_data=json.dumps(game_state_json))
    
    async def matchmaking(self, event):
        await self.send(text_data=json.dumps({
            'type': 'matchmaking',
        }))

    async def game_starting(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game.starting',
        }))

    async def countdown(self, event):
        countdown = event['countdown']
        await self.send(text_data=json.dumps({
            'type': 'countdown',
            'countdown':countdown,
        }))
    
    async def ending_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ending.game'
        }))
        await self.close()