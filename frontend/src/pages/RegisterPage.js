import React, { useState, useEffect } from 'react';
import { api } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = ({ setUser }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', selectedCharityId: '', charityContributionPercent: 10 });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/charities').then(({ data }) => setCharities(data)).catch(err => console.error('Failed to load charities:', err));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err?.message ||
        'Registration failed: network/server not reachable';
      setError(errorMessage);
      console.error('Registration request failed', {
        requestURL: `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`,
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
        <h2 className="text-3xl font-bold text-center mb-8">Join Golf Charity</h2>
        {error && <p className="text-red-400 text-center mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
              className="input-field w-full"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              className="input-field w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              required
              className="input-field w-full"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Choose Charity</label>
            <select
              name="selectedCharityId"
              value={form.selectedCharityId}
              onChange={change}
              required
              className="input-field w-full"
            >
              <option value="">Select a Charity</option>
              {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contribution Percentage (min 10%)</label>
            <input
              name="charityContributionPercent"
              type="number"
              min="10"
              max="100"
              value={form.charityContributionPercent}
              onChange={change}
              required
              className="input-field w-full"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
