from django.db import models
import uuid
from django.contrib.auth.models import User

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    password = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    creator = models.CharField(max_length=100, blank=True, null=True)  # Optional, adjust as needed


    def __str__(self):
        return f"Room {self.id} created by {self.creator}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=100, blank=True, null=True)  # Optional user identifier

    def __str__(self):
        return f"Message at {self.timestamp} in Room {self.room.id}"


class RoomParticipant(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('room', 'user')


