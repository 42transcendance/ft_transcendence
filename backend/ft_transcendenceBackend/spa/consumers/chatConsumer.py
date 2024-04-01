import json
from ..views import extract_user_info_from_token

from channels.generic.websocket import AsyncWebsocketConsumer

class chatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["session"]:
            self.close()
    
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))
        self.room_group_name = 'global'
        
        self.send(text_data=json.dumps({
            'type': 'notification',
            'message': 'Connection established.',
            'source_user': self.username,
        }))
        await self.channel_layer.group_add( self.room_group_name, self.channel_name )
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print(text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        if text_data_json["type"] == 'global.message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'global.message',
                    'message':message,
                    'source_user': self.username,
                }
            )
    
    async def global_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'type':'global.message',
            'message':message,
            'source_user': self.username,
        }))
