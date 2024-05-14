from django.db import models
import uuid
from django.contrib.auth.models import User
import bcrypt   # Used for hashing passwords securely.

class ChatRoom(models.Model):
# Represents a chat room entity with secure password handling.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    password = models.CharField(max_length=60)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    creator = models.CharField(max_length=100, blank=True, null=True)  # Optional, adjust as needed

# Custom save method to hash password before saving a new room.
    def save(self, *args, **kwargs):
        if not self.pk:  # Only hash the password for new rooms
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        super().save(*args, **kwargs)

# String representation of a ChatRoom instance.
    def __str__(self):
        return f"Room {self.id} created by {self.creator}"

# Represents a message sent within a chat room.
class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=100, blank=True, null=True)  # Optional user identifier

    def __str__(self):
        return f"Message at {self.timestamp} in Room {self.room.id}"

 # Represents a user's participation in a chat room.
class RoomParticipant(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('room', 'user') # user can join a room only once.


