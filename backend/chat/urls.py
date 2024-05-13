from django.urls import path
from . import views
from .views import join_chat_room

urlpatterns = [
    path('rooms/', views.create_chat_room, name='create_chat_room'),
    path('rooms/<uuid:pk>/messages/', views.chat_room_messages, name='chat_room_messages'),
    path('rooms/<uuid:pk>/join/', views.join_chat_room, name='join_chat_room'),  # New endpoint
]
