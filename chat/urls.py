from django.urls import path
from . import views
from .views import create_chat_room, join_chat_room, chat_room_messages, get_chat_room


# Define the URL patterns for the chat application.
urlpatterns = [
    path('rooms/', views.create_chat_room, name='create_chat_room'),
    path('rooms/<uuid:pk>/messages/', views.chat_room_messages, name='chat_room_messages'),
    path('rooms/<uuid:pk>/join/', views.join_chat_room, name='join_chat_room'),  # New endpoint
    path('rooms/<uuid:pk>/', views.get_chat_room, name='get_chat_room'),  # New endpoint
    path('rooms/<uuid:room_id>/messages/<uuid:message_id>/', views.delete_message, name='delete_message'),  # New endpoint for deleting a message
]
