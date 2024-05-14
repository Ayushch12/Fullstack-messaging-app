import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';

const HomePage = () => {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [creator, setCreator] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        console.log("Button clicked with password:", password);  // Debugging line
        if (!password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character like @$!%*?&.");
            return;
        }

        try {
            const response = await createRoom({ creator, password });
            navigate(`/chat/${response.data.id}`);
        } catch (error) {
            setError(error.response ? error.response.data : 'Error creating room');
        }
    };


    const handleJoinRoom = async () => {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
        if (!uuidPattern.test(roomId)) {
            setError('Please provide a valid UUID.');
            return;
        }

        try {
            const response = await joinRoom(roomId);
            navigate(`/chat/${roomId}`);
        } catch (error) {
            setError(error.response ? error.response.data : 'Error joining room');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Create or Join a Chat Room</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Creator Name"
                    className="border border-gray-300 p-2 rounded mr-2"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Room Password"
                    className="border border-gray-300 p-2 rounded mr-2"
                />
                <button
                    onClick={handleCreateRoom}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Room
                </button>
            </div>
            <div>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Room ID"
                    className="border border-gray-300 p-2 rounded mr-2"
                />
                <button
                    onClick={handleJoinRoom}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Join Room
                </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}



        </div>
    );
};

export default HomePage;




