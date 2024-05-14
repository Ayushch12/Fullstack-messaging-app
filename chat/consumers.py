import json   # Used for encoding and decoding JSON data.
from channels.generic.websocket import AsyncWebsocketConsumer  # Import necessary class for managing WebSocket connections.


class ChatConsumer(AsyncWebsocketConsumer): # Manages WebSocket connections for a chat room
    async def connect(self):
        # Establishes the WebSocket connection and subscribes the user to a specific
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

# Add the WebSocket to the chat group to receive messages.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
# Removes the WebSocket .
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
         # Receives a message from the WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
# Broadcast the message to everyone in the room.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        # Handles messages sent to the chat room and forwards
        message = event['message']
        # Send the message through this WebSocket.
        await self.send(text_data=json.dumps({
            'message': message
        }))
