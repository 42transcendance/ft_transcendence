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
            self.userObject = await sync_to_async(CustomUser.objects.get)(userid=self.user_id)
            self.username = self.userObject.username
            print("WS Connection : ", self.username, " ", self.user_id)
            self.room_id = None
            await self.accept()
    
    async def disconnect(self, close_code):
        # Gotta check which type of game user is in and act accordingly
        DuelsManager.remove_user_from_room(self.user_id, self.room_id)
        if self.room_id != None:
            await self.channel_layer.group_discard(self.room_id, self.channel_name)
        DuelsManager.debug()
        await self.send(text_data=json.dumps({
            "type": "websocket.close",
            "code": 1000,
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        print(data)

        if self.room_id != None:
            self.send_notification("Error", "You are already involved in a game.")
            await self.close()
            return

        elif message_type == 'join.matchmaking':
            self.room_id = DuelsManager.find_public_room(self.user_id)
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            self.room_object = DuelsManager.get_room_by_id(self.room_id)
            self.room_object.createGame()
            self.room_object.userReady()
            self.side = self.room_object.gameObject.setPlayer(self.user_id, self.username)
            print(self.username, "is on side : ", self.side)
            await self.channel_layer.group_send(
            self.room_id,
            {
                'type': 'send.game.state',
                'gamestate': self.room_object.gameObject,
            })
            if self.room_object.ready == 2:
                self.room_object.startGameTask()
            else:
                await self.channel_layer.group_send(
                self.room_id,
                {
                    'type': 'matchmaking',
                })


        elif message_type == 'create.private.game':
            # Create a private game and waits for whitelisted player to join
            """
                Request when inviting someone to play :
                {
                    "type" : "create.private.game",
                    "userid_of_oponent": userid,
                }
            """
            invited_user_id = data.get('userid_of_oponent')
            if invited_user_id == None:
                self.send_notification("Error", "You need to specify the invited user.")
                await self.close()
                return
            elif self.userObject.friends.get(invited_user_id) == None: # Might be a problem if get doesnt return None
                self.send_notification("Error", "User is not your friend")
                await self.close()
                return
            self.room_id = DuelsManager.create_private_room(self.user_id, invited_user_id)
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            
            #Sends the room id back to the user to initiate invitation
            self.send_notification("private.game", self.room_id)
            # WAIT FOR OPPONENT
            pass

        elif message_type == 'join.private.game':
            # Joins private game using game-id
            """
                Request when accepting an invitation (joining a private game) :
                {
                    "type" : "join.private.game",
                    "room_id": room_id,
                }
            """
            room_id_to_join = data.get('room_id')
            self.room_id = DuelsManager.join_private_room(self.user_id, room_id_to_join)
            if self.room_id == None:
                self.send_notification("Error", "Cannot join private room")
                await self.close()
                return
            await self.channel_layer.group_add( self.room_id, self.channel_name)
            # GAME SHOULD START
        DuelsManager.debug()


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