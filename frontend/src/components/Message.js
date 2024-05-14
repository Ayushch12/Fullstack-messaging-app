
import React, { useState } from 'react';
import { deleteMessage } from '../services/api';

const Message = ({ message, roomId, onDelete, isUserMessage }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showTimestamp, setShowTimestamp] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteMessage(roomId, message.id);
            onDelete(message.id);  // Callback to update state in ChatPage
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleTextClick = () => {
        setShowTimestamp(true);
        setTimeout(() => setShowTimestamp(false), 1000); // Hide timestamp after 1 second
    };

    return (
        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`relative p-4 rounded-lg ${isUserMessage ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'} shadow`}>
                <div className="flex items-center mb-1">
                    <strong className={`mr-2 ${isUserMessage ? 'text-blue-700' : 'text-gray-700'}`}>
                        {message.username || 'Anonymous'}
                    </strong>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={toggleOptions}
                    >
                        &#8942; {/* Vertical ellipsis character */}
                    </button>
                </div>
                <div onClick={handleTextClick} className="cursor-pointer inline">
                    {message.text}
                </div>
                {showOptions && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                            onClick={handleDelete}
                            className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100 w-full text-left"
                        >
                            Delete
                        </button>
                    </div>
                )}
                {showTimestamp && (
                    <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;



