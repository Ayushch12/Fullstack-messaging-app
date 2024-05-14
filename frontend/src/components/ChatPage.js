import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMessages, getRoomDetails, postMessage } from '../services/api';
import Message from './Message'; // Import the Message component

const ChatPage = () => {
    const { roomId } = useParams();// Get roomId from the URL parameters
    const navigate = useNavigate();// Hook to programmatically navigate
    const [room, setRoom] = useState(null);// State for storing room details
    const [messages, setMessages] = useState([]);// State for storing messages
    const [text, setText] = useState('');// State for storing the new message text
    const [username, setUsername] = useState(localStorage.getItem('username') || '');// State for storing the username
    const [isUsernameSet, setIsUsernameSet] = useState(!!localStorage.getItem('username'));
    const [copySuccess, setCopySuccess] = useState(false);

     // Function to fetch room details and messages.
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const roomResponse = await getRoomDetails(roomId);
                setRoom(roomResponse.data);
                const messagesResponse = await getMessages(roomId);
                setMessages(messagesResponse.data);
                // Check if the user is the creator and set the username automatically
                const savedUsername = localStorage.getItem('username');
                if (roomResponse.data.creator === savedUsername) {
                    setUsername(roomResponse.data.creator);
                    setIsUsernameSet(true);
                } else {
                    setIsUsernameSet(false); // User is not the creator, needs to set name
                }
            } catch (error) {
                console.error('Error fetching room details or messages:', error);
                navigate('/'); // navigate to homepage if error occurs
            }
        };
        fetchRoomDetails();

        // Redirect if the room is expired based on a timeout
        const timer = setTimeout(() => {
            alert('This room has expired. You will be redirected to the homepage.');
            navigate('/');
        }, 30 * 60 * 1000); // 30 minutes
        return () => clearTimeout(timer);
    }, [roomId, navigate]);
  // Function to handle sending a message
    const handleSendMessage = async () => {
        if (!text.trim()) {
            alert("Message can't be empty.");
            return;
        }
        if (!isUsernameSet) {
            alert("Username must be set before sending a message.");
            return;
        }

        try {
            const response = await postMessage(roomId, { text, username });
            setMessages([...messages, response.data]);
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
 // Function to handle deleting a message
    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter(msg => msg.id !== messageId));
    };
 // Function to handle username submission
    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            alert("Username can't be empty.");
            return;
        }
        localStorage.setItem('username', username);
        setIsUsernameSet(true);
    };
// Function to handle copying the roomId
    const handleCopy = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }, (err) => {
            console.error('Failed to copy: ', err);
        });
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {room && (
                <div className="sticky top-0 w-full max-w-2xl mb-6 z-10 bg-gray-100 pt-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold mb-2 text-center">Veeton Chat Room ID</h1>
                        <div className="grid grid-cols-8 gap-2 w-full mb-4">
                            <label htmlFor="room-id" className="sr-only">Chat Room ID</label>
                            <input
                                id="room-id"
                                type="text"
                                className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={roomId}
                                disabled
                                readOnly
                            />
                            <button
                                onClick={handleCopy}
                                className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 items-center inline-flex justify-center"
                            >
                                {copySuccess ? (
                                    <span className="inline-flex items-center">
                                        <svg className="w-3 h-3 text-white mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917L5.724 10.5 15 1.5"/>
                                        </svg>
                                        Copied!
                                    </span>
                                ) : (
                                    <span>Copy</span>
                                )}
                            </button>
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg">Creator: {room.creator}</h2>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md overflow-y-auto mt-6">
                <div className="messages mb-4">
                    {messages.map((msg) => (
                        <Message
                            key={msg.id}
                            message={msg}
                            roomId={roomId}
                            onDelete={handleDeleteMessage}
                            isUserMessage={msg.username === username}
                        />
                    ))}
                </div>

                {!isUsernameSet && (
                    <form onSubmit={handleUsernameSubmit} className="flex mb-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your name"
                            className="border border-gray-300 p-2 rounded flex-grow mr-2"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Set Name
                        </button>
                    </form>
                )}
                {isUsernameSet && (
                    <div className="flex">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type your message"
                            className="border border-gray-300 p-2 rounded flex-grow mr-2"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
