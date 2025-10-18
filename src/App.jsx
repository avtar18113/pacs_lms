import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Components
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Dashboard from './components/user/Dashboard';
import MentorDashboard from './components/mentor/MentorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import CourseView from './components/user/CourseView';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Checking for stored user...');
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('✅ User loaded from storage:', userData);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('🔐 Login successful:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading Learning Platform...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                !user ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="/register" 
              element={
                !user ? 
                <Register /> : 
                <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? 
                <ProtectedRoute user={user} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/course/:id" 
              element={
                user ? 
                <CourseView user={user} /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ user }) => {
  console.log('🛡️ Protected Route - User type:', user?.user_type);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch(user.user_type) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'mentor':
      return <MentorDashboard user={user} />;
    case 'user':
      return <Dashboard user={user} />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default App;