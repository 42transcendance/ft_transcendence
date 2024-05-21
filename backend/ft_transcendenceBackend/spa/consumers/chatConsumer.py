import json
from ..views import extract_user_info_from_token

from channels.generic.websocket import AsyncWebsocketConsumer

class chatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
    
        self.user_id, self.username = extract_user_info_from_token(self.scope['session'].get('token'))

        if self.user_id == None or self.username == None:
            self.close()

        self.room_group_name = 'global'
        
        self.send(text_data=json.dumps({
            'type': 'notification',
            'message': 'Connection established.',
            'source_user': self.username,
            'source_user_id': self.user_id,
        }))
        await self.channel_layer.group_add( self.room_group_name, self.channel_name )
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        print(text_data_json)
        if text_data_json["type"] == 'global.message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'global.message',
                    'message':message,
                    'source_user': self.username,
                    'source_user_id': self.user_id,
                    'target_user_name': 'global',
                    'target_user_id': 'global',
                }
            )

        elif text_data_json["type"] == 'private.message':
            print("Private Message")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'private.message',
                    'message':message,
                    'source_user': self.username,
                    'source_user_id': str(self.user_id),
                    # 'target_user_name': text_data_json["target_user_name"],
                    'target_user_id': text_data_json["target_user_id"],
                }
            )
    
    async def global_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'type':'global.message',
            'message':message,
            'source_user' : event['source_user'],
            'source_user_id': event['source_user_id'],
            'target_username': 'global',
            'target_user_id': 'global',
        }))

    async def  private_message(self, event):
        message = event['message']
        targetid = event['target_user_id']
        sourceid = event['source_user_id']
        if targetid == str(self.user_id) or sourceid == str(self.user_id):
            await self.send(text_data=json.dumps({
                'type':'private.message',
                'message':message,
                'source_user' : event['source_user'],
                'source_user_id': event['source_user_id'],
                'target_user_id': event['target_user_id'],
            }))