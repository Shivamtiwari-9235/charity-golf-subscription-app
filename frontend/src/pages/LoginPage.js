import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      let errorMessage =
        err.response?.data?.message ||
        err?.message ||
        'Login failed: network/server not reachable';

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again in a moment.';
      }

      setError(errorMessage);
      console.error('Login request failed', {
        requestURL: `${api.defaults.baseURL}/auth/login`,
        status: err.response?.status,
        responseData: err.response?.data,
        message: err.message,
        exception: err,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        {error && <p className="text-red-400 text-center mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="input-field w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="input-field w-full"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
