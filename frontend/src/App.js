// import React from 'react';
// import ChatRoom from './components/ChatRoom';
// import CreateRoom from './components/CreateRoom';
// import JoinRoom from './components/JoinRoom';

// function App() {
//     return (
//         <div className="App">
//             <CreateRoom />
//             <JoinRoom />
//             {/* Replace 'roomId' with the actual room ID you get after creating or joining a room */}
//             <ChatRoom roomId="room-id-here" />
//         </div>
//     );
// }

// export default App;

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

