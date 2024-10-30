import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;
