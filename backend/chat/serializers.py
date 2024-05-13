from rest_framework import serializers
from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'password', 'created_at', 'expires_at','creator']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['text', 'timestamp', 'username']  # 'id' and 'room' fields removed from here

    def create(self, validated_data):
        room = self.context['room']  # Get room from the context
        return Message.objects.create(room=room, **validated_data)
