import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new Error('API baseURL is missing');
  }
  return config;
});

// Optional: helps debugging in console
if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL is not configured; defaulting to http://localhost:5000/api');
}
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('golf_user');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('golf_user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      localStorage.removeItem('golf_user');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="glass-card sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              <Link to="/" className="hover:scale-105 transition-transform duration-200">Golf Charity</Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors duration-200">Home</Link>
              {!user && (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors duration-200">Login</Link>
                  <Link to="/register" className="btn-primary">Get Started</Link>
                </>
              )}
              {user && (
                <>
                  <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors duration-200">Dashboard</Link>
                  {user.role === 'admin' && <Link to="/admin" className="text-slate-300 hover:text-white transition-colors duration-200">Admin</Link>}
                  <button onClick={logout} className="btn-secondary">Logout</button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/admin" element={<AdminPage user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
