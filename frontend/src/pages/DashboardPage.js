import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ user }) => {
  const [scores, setScores] = useState([]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchScores();
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/auth/me');
      setProfile(data);
    } catch (err) {
      setMessage('Unable to fetch profile');
    }
  };

  const fetchScores = async () => {
    try {
      const { data } = await axios.get('/scores');
      setScores(data);
    } catch (err) {
      setMessage('Unable to fetch scores');
    }
  };

  const addScore = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/scores', { value: Number(value), date });
      setScores(data);
      setValue('');
      setDate('');
      setMessage('Score saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding score');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'inactive': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'past_due': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      await axios.post('/stripe/cancel-subscription');
      setMessage('Subscription cancelled successfully. You will continue to have access until the end of your billing period.');
      // Refresh profile to update subscription status
      fetchProfile();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {profile?.name || user.name}!</h1>
          <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(profile?.subscription?.status)}`}>
            {profile?.subscription?.status || 'Inactive'}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{profile?.subscription?.plan || 'None'}</div>
            <div className="text-sm text-slate-400">Plan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {profile?.subscription?.renewalDate ? new Date(profile.subscription.renewalDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-slate-400">Renewal Date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">${profile?.winningsSummary?.totalWon || 0}</div>
            <div className="text-sm text-slate-400">Total Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">${profile?.winningsSummary?.pendingPayout || 0}</div>
            <div className="text-sm text-slate-400">Pending Payout</div>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      {profile?.subscription?.status === 'active' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Subscription Management
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 mb-2">Manage your subscription and billing</p>
              <p className="text-sm text-slate-400">Cancel anytime - your access continues until the end of your billing period</p>
            </div>
            <button
              onClick={cancelSubscription}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Entry Card */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Enter Your Scores
            </h2>
            <p className="text-slate-400 text-sm mb-4">Submit your last 5 Stableford scores (1-45 points) to stay eligible for monthly draws.</p>

            <form onSubmit={addScore} className="space-y-4 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Score (1-45)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    min="1"
                    max="45"
                    required
                    className="input-field w-full"
                    placeholder="Enter score"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="input-field w-full"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Score</button>
            </form>

            {message && (
              <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'}`}>
                {message}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium text-slate-300">Recent Scores</h3>
              {scores.slice(0, 5).map((score) => (
                <div key={score._id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">{new Date(score.date).toLocaleDateString()}</span>
                  <span className="font-semibold text-indigo-400">{score.value} pts</span>
                </div>
              ))}
              {scores.length === 0 && (
                <p className="text-slate-500 text-sm">No scores entered yet. Add your first score above!</p>
              )}
            </div>
          </div>

          {/* Charity Card */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Your Charity
            </h2>
            {profile?.selectedCharity ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{profile.selectedCharity.name}</div>
                    <div className="text-sm text-slate-400">{profile.selectedCharity.category}</div>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Your contribution:</span>
                    <span className="font-semibold text-emerald-400">{profile.charityContributionPercent}%</span>
                  </div>
                </div>
                <button className="btn-secondary w-full">Change Charity</button>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-slate-400 mb-4">No charity selected yet.</p>
                <button className="btn-primary">Choose Your Charity</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          {/* Draw Participation Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Monthly Draw
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Next draw:</span>
                <span className="text-sm font-medium">March 31, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Your status:</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">Entered</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Draws entered:</span>
                <span className="font-semibold text-violet-400">3</span>
              </div>
              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <div className="text-sm text-slate-300">
                  <strong>Jackpot rollover:</strong> $2,340 added to this month's prize pool!
                </div>
              </div>
            </div>
          </div>

          {/* Winnings History Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Winnings & History
            </h3>
            <div className="space-y-3">
              {/* Sample winnings - in real app this would come from API */}
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Feb 2024</div>
                  <div className="text-xs text-slate-400">4-number match</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-400">$250</div>
                  <div className="text-xs text-emerald-300">Paid</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Jan 2024</div>
                  <div className="text-xs text-slate-400">3-number match</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-400">$50</div>
                  <div className="text-xs text-emerald-300">Paid</div>
                </div>
              </div>
              <div className="text-center pt-2">
                <button className="btn-ghost text-sm">View all winnings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
