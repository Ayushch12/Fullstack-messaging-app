import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat';

export const createRoom = (roomData) => {
    return axios.post(`${API_URL}/rooms/`, roomData);
};

export const joinRoom = (roomId) => {
    return axios.post(`${API_URL}/rooms/${roomId}/join/`);
};

export const getRoomDetails = (roomId) => {
    return axios.get(`${API_URL}/rooms/${roomId}/`);
};

export const getMessages = (roomId) => {
    return axios.get(`${API_URL}/rooms/${roomId}/messages/`);
};

export const postMessage = (roomId, messageData) => {
    return axios.post(`${API_URL}/rooms/${roomId}/messages/`, messageData);
};

export const deleteMessage = (roomId, messageId) => {
    return axios.delete(`${API_URL}/rooms/${roomId}/messages/${messageId}/`);
};
