from rest_framework import serializers
from .models import ChatRoom, Message
import re # Regex library for pattern matching.

class ChatRoomSerializer(serializers.ModelSerializer):
    # Serializer for ChatRoom model, handles serialization and validation.
    class Meta:
        model = ChatRoom
        fields = ['id', 'password', 'created_at', 'expires_at','creator']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'creator': {'required': True}
        }

    def validate_creator(self, value):# Custom validation for the 'creator' field to ensur
        if not value.strip():  # Ensuring the creator name isn't just whitespace
            raise serializers.ValidationError("First create a name.")
        return value

# Validate password in ChatRoomSerializer
def validate_password(self, value):
    if not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\$%\&\(\)]).{8,}$', value):
        raise serializers.ValidationError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character like $%&().")
    return value


class MessageSerializer(serializers.ModelSerializer):
    # Serializer for the Message model, handles message serialization.
    class Meta:
        model = Message
        fields = ['id','text', 'timestamp', 'username']  # 'id' and 'room' fields removed from here

# Custom method to create a new Message instance.
    def create(self, validated_data):
        room = self.context['room']  # Get room from the context
        return Message.objects.create(room=room, **validated_data)
