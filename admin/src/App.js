import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import PostContent from './pages/PostContent';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className='flex'><Sidebar /><Home /></div>} />
        <Route path="/user-management" element={<div className='flex'><Sidebar /><UserManagement /></div>} />
        <Route path="/post-content" element={<div className='flex'><Sidebar /><PostContent /></div>} />
        <Route path="/admin-profile" element={<div className='flex'><Sidebar /><AdminProfile /></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
