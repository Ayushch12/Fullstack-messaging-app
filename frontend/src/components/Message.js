import React from 'react';
import { deleteMessage } from '../services/api';

const Message = ({ message, roomId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await deleteMessage(roomId, message.id);
            onDelete(message.id);  // Callback to update state in ChatPage
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    return (
        <div className="message p-2 mb-2 border-b border-gray-200">
            <strong>{message.username || 'Anonymous'}</strong>: {message.text}
            <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
            </div>
            <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
    );
};

export default Message;

