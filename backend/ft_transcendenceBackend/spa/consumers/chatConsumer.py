import json
from channels.generic.websocket import AsyncWebsocketConsumer
from ..views import extract_user_info_from_token, save_chat_message
from spa.models import CustomUser
from asgiref.sync import sync_to_async

class chatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        if self.user_id is None or self.username is None:
            await self.close()
            return
        
        print(f"Connecting user: {self.username} with ID: {self.user_id} (type: {type(self.user_id)})")  # Debug statement

        self.userObject = await sync_to_async(CustomUser.objects.get)(userid=str(self.user_id))

        self.userObject.is_online = True
        await sync_to_async(self.userObject.save)()
                                                 
        self.room_group_name = 'global'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': 'Connection established.',
            'source_user': self.username,
            'source_user_id': self.user_id,
        }))
    
    async def disconnect(self, close_code):
        self.userObject.is_online = False
        await sync_to_async(self.userObject.save)()
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print("STATUS : ", self.userObject.is_online)
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")
        print(f"Received message: {message} (type: {type(message)})")
        print(f"Message type: {text_data_json.get('type')}")
        print(f"Sender ID: {self.user_id} (type: {type(self.user_id)})")
        
        if text_data_json.get("type") == 'global.message':
            message_saved = await save_chat_message(self.user_id, None, message, True)
            if message_saved:  # Only send the message if it was saved successfully
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'global.message',
                        'message': message,
                        'source_user': self.username,
                        'source_user_id': self.user_id,
                    }
                )

        elif text_data_json.get("type") == 'private.message':
            target_user_id = text_data_json.get("target_user_id")
            print(f"Private message to: {target_user_id} (type: {type(target_user_id)})")
            message_saved = await save_chat_message(self.user_id, target_user_id, message, False)
            if message_saved:  # Only send the message if it was saved successfully
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'private.message',
                        'message': message,
                        'source_user': self.username,
                        'source_user_id': self.user_id,
                        'target_user_id': target_user_id,
                    }
                )
    
    async def global_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'type': 'global.message',
            'message': message,
            'source_user': event['source_user'],
            'source_user_id': event['source_user_id'],
        }))

    async def private_message(self, event):
        message = event['message']
        target_id = event['target_user_id']
        source_id = event['source_user_id']
        if str(target_id) == str(self.user_id) or str(source_id) == str(self.user_id):
            await self.send(text_data=json.dumps({
                'type': 'private.message',
                'message': message,
                'source_user': event['source_user'],
                'source_user_id': source_id,
                'target_user_id': target_id,
            }))