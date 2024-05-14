
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import HomePage from './components/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat/:roomId" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;

