import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './SignInPage';
import SignUpPage from './SignUp';
import ChatPage from './ChatPage';
import Profile from './Profile';
import StartPage from './start'; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} /> {/* Show StartPage first */}
        <Route path="/signin" element={<SignInPage />} /> {/* Move SignInPage to /signin */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
