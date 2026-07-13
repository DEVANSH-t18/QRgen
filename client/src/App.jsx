import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Cinematic dark theme mesh background */}
        <div className="cinematic-bg" />
        
        {/* Header/Navbar bar */}
        <Navbar />

        {/* Page content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create-profile" 
              element={
                <ProtectedRoute>
                  <CreateProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/p/:userId" element={<PublicProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
