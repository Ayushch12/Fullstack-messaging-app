
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMessages, getRoomDetails, postMessage } from '../services/api';
import Message from './Message'; // Import the Message component

const ChatPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [isUsernameSet, setIsUsernameSet] = useState(!!localStorage.getItem('username'));

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

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter(msg => msg.id !== messageId));
    };


    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            alert("Username can't be empty.");
            return;
        }
        localStorage.setItem('username', username);
        setIsUsernameSet(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {room && (
                <>
                    <h1 className="text-2xl font-bold mb-6">Chat Room: {room.id}</h1>
                    <h2 className="text-xl mb-4">Creator: {room.creator}</h2>
                </>
            )}
            <div className="w-full max-w-md bg-white p-4 rounded shadow">
                <div className="messages mb-4">
                    {messages.map((msg) => (
                        <Message key={msg.id} message={msg} roomId={roomId} onDelete={handleDeleteMessage} />
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




