
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';

const HomePage = () => {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [creator, setCreator] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // Add success state
    const [errorField, setErrorField] = useState(''); // To track which field has an error
    const navigate = useNavigate();

    // Clear error and success messages after 2 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
                setErrorField('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCreateRoom = async () => {
        if (!creator) {
            setError("Please provide the Creator Name.");
            setErrorField('creator');
            setSuccess(null); // Clear success message
            return;
        }
        if (!password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            setError("Minimum 8 characters including at least one uppercase letter, one lowercase letter, one number, and one special character such as @$!%*?&.");
            setErrorField('password');
            setSuccess(null); // Clear success message
            return;
        }

        try {
            const response = await createRoom({ creator, password });
            setSuccess('Room created successfully!'); // Set success message
            setError(null); // Clear error message
            setErrorField('');
            navigate(`/chat/${response.data.id}`);
        } catch (error) {
            setError(error.response ? error.response.data : 'Error creating room');
            setErrorField('general');
            setSuccess(null); // Clear success message
        }
    };

    const handleJoinRoom = async () => {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
        if (!uuidPattern.test(roomId)) {
            setError('Please provide a valid UUID.');
            setErrorField('roomId');
            setSuccess(null); // Clear success message
            return;
        }

        try {
            await joinRoom(roomId);
            setSuccess('Room joined successfully!'); // Set success message
            setError(null); // Clear error message
            setErrorField('');
            navigate(`/chat/${roomId}`);
        } catch (error) {
            setError(error.response ? error.response.data : 'Error joining room');
            setErrorField('general');
            setSuccess(null); // Clear success message
        }
    };

    const renderError = (field) => {
        if (errorField === field && error) {
            return (
                <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 absolute z-50" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                        </svg>
                        <span className="sr-only">Error icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">{error}</div>
                    <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close" onClick={() => setError(null)}>
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
        }
        return null;
    };

    const renderSuccess = () => {
        if (success) {
            return (
                <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 absolute z-50" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">{success}</div>
                    <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close" onClick={() => setSuccess(null)}>
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <section className="bg-gray-50 dark:bg-gray-900 w-full">
                <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-12 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="place-self-center mr-auto mb-10 lg:col-span-7 xl:col-span-8 xl:mb-0">
                        <h1 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                        Veeton Fashion Photography, without the hassle
                        </h1>
                        <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                        Interested in collaborating with us?
                        </p>
                        <div className="flex flex-col items-start mt-4">
                            <div className="relative">
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
                                {renderError('roomId')}
                            </div>
                        </div>
                        <a href="#" className="inline-flex items-center py-3 px-5 font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4">
                            <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                            </svg>
                            Watch video
                        </a>
                        <ul className="hidden justify-between pt-12 mx-auto mt-14 border-t border-gray-300 xl:flex dark:border-gray-700 dark:text-white">
                            <li className="flex">
                                <span className="text-4xl font-extrabold lg:text-5xl">42k</span>
                                <div className="block pl-4 text-xl text-gray-500 dark:text-gray-400">
                                    <div>Our Active</div>
                                    <div>Users</div>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="text-4xl font-extrabold lg:text-5xl">3k</span>
                                <div className="block pl-4 text-xl text-gray-500 dark:text-gray-400">
                                    <div>Professional</div>
                                    <div>Creators</div>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="text-4xl font-extrabold lg:text-5xl">560k</span>
                                <div className="block pl-4 text-xl text-gray-500 dark:text-gray-400">
                                    <div>Weekly</div>
                                    <div>Downloads</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="justify-center p-4 max-w-screen-sm bg-white rounded-lg border border-gray-200 shadow lg:mt-0 lg:col-span-5 xl:col-span-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Create or Join a Chat Room : </h2>
                        <form className="space-y-6 mt-6">
                            <div className="relative">
                                <label htmlFor="creator" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Creator Name</label>
                                <input
                                    type="text"
                                    name="creator"
                                    id="creator"
                                    value={creator}
                                    onChange={(e) => setCreator(e.target.value)}
                                    placeholder="Creator Name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Room Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Room Password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleCreateRoom}
                                className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Create Room
                            </button>
                            {renderError('creator')}
                            {renderError('password')}
                        </form>
                    </div>
                </div>
            </section>
            {renderSuccess()}
        </div>
    );
};

export default HomePage;


