import json

from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import async_to_sync

# This consumer is for the live general chat (Might be a WIP)
class chatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'test'
        
        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': 'Connection established.',
        }))
        await self.channel_layer.group_add( self.room_group_name, self.channel_name )
        await self.accept()
        print("New Websocket connection")

    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print("A Websocket connection was closed")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat.message',
                'message':message
            }
        )
        print("Received chat message from websocket connection : ", message)
    
    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message':message   
        }))
        print("Received chat message from group : ", message)