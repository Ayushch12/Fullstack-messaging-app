
# For POST requests, specify request_body
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatRoom, Message
from .models import ChatRoom, RoomParticipant
from .serializers import ChatRoomSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
import logging
from datetime import datetime, timedelta
import bcrypt
logger = logging.getLogger(__name__)


# For POST requests, specify request_body
@swagger_auto_schema(method='post', request_body=ChatRoomSerializer)
@api_view(['POST'])
def create_chat_room(request):
    logger.info('Create Chat Room Request Data: %s', request.data)
    data = request.data.copy()
    data['expires_at'] = datetime.now() + timedelta(minutes=30)
    serializer = ChatRoomSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        logger.info('Chat Room Created: %s', serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        logger.error('Create Chat Room Error: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# For GET and POST methods, separate the swagger_auto_schema decorators
@swagger_auto_schema(method='get', responses={200: MessageSerializer(many=True)})
@swagger_auto_schema(method='post', request_body=MessageSerializer)
@api_view(['GET', 'POST'])
def chat_room_messages(request, pk):
    # Fetch the room using the primary key or return 404 if not found
    room = get_object_or_404(ChatRoom, pk=pk)
    if request.method == 'POST':
        # Create a serializer instance with request data and room in the context
        serializer = MessageSerializer(data=request.data, context={'room': room})
        if serializer.is_valid():
            serializer.save()  # save method will use 'create' from the serializer where room is used from the context
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        messages = Message.objects.filter(room=room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)




@swagger_auto_schema(method='post', operation_description="Join a chat room", responses={200: MessageSerializer(many=True)})
@api_view(['POST'])
def join_chat_room(request, pk):
    room = get_object_or_404(ChatRoom, pk=pk)
    # Example of fetching the last few messages
    messages = Message.objects.filter(room=room).order_by('-timestamp')[:10]
    serializer = MessageSerializer(messages, many=True)
        # Manually construct room data to exclude certain fields
    room_data = {
        'id': room.id,
        'created_at': room.created_at,
        'creator': room.creator
    }


    # Respond without tracking the user
    return Response({
        'message': 'Access to the room granted.',
        'room': room_data,
        'messages': serializer.data
    }, status=status.HTTP_200_OK)

@swagger_auto_schema(method='get', responses={200: ChatRoomSerializer})
@api_view(['GET'])
def get_chat_room(request, pk):
    room = get_object_or_404(ChatRoom, pk=pk)
    serializer = ChatRoomSerializer(room)
    return Response(serializer.data)



# For the delete, Delete/rooms/{room_id}
@swagger_auto_schema(method='delete', responses={204: 'Message deleted successfully', 404: 'Message not found'})
@api_view(['DELETE'])
def delete_message(request, room_id, message_id):
    try:
        message = Message.objects.get(id=message_id, room__id=room_id)  # Ensure the message belongs to the room
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Message.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND, data={"detail": "Message not found"})