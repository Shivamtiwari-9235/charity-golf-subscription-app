import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const AdminPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [report, setReport] = useState(null);
  const [draws, setDraws] = useState([]);
  const [winners, setWinners] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchReport();
    fetchDraws();
    fetchWinners();
  }, [user]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get('/admin/reports');
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to get report');
    }
  };

  const fetchDraws = async () => {
    try {
      const { data } = await api.get('/draws');
      setDraws(data);
    } catch (err) {
      setError('Unable to fetch draws');
    }
  };

  const fetchWinners = async () => {
    try {
      const { data } = await api.get('/winners');
      setWinners(data);
    } catch (err) {
      setError('Unable to fetch winners');
    }
  };

  const createDraw = async () => {
    const month = prompt('Month (1-12):');
    const year = prompt('Year:');
    if (!month || !year) return;
    try {
      await api.post('/draws', { month: Number(month), year: Number(year) });
      fetchDraws();
      setMessage('Draw created successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to create draw');
    }
  };

  const simulateDraw = async (drawId) => {
    try {
      await api.post(`/draws/${drawId}/simulate`);
      fetchDraws();
      setMessage('Draw simulated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to simulate draw');
    }
  };

  const publishDraw = async (drawId) => {
    try {
      await api.post(`/draws/${drawId}/publish`);
      fetchDraws();
      setMessage('Draw published successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to publish draw');
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'scores', label: 'Scores', icon: '📈' },
    { id: 'draws', label: 'Draws', icon: '🎯' },
    { id: 'charities', label: 'Charities', icon: '❤️' },
    { id: 'winners', label: 'Winners', icon: '🏆' },
    { id: 'reports', label: 'Reports', icon: '📋' },
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 glass-card m-4 rounded-2xl">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
            Admin Panel
          </h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold capitalize">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Overview'}
            </h2>
            {activeTab === 'overview' && (
              <button onClick={createDraw} className="btn-primary">
                Create New Draw
              </button>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg">
              {message}
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
                  <div className="text-3xl font-bold text-indigo-400 mb-2">{report?.totalUsers || 0}</div>
                  <div className="text-slate-400">Total Users</div>
                </div>
                <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{report?.activeUsers || 0}</div>
                  <div className="text-slate-400">Active Subscribers</div>
                </div>
                <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
                  <div className="text-3xl font-bold text-violet-400 mb-2">${report?.totalPrizePool || 0}</div>
                  <div className="text-slate-400">Current Prize Pool</div>
                </div>
                <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
                  <div className="text-3xl font-bold text-amber-400 mb-2">${report?.totalCharityContributions || 0}</div>
                  <div className="text-slate-400">Charity Contributions</div>
                </div>
              </div>

              {/* Draw Control Panel */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Draw Control Panel
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Draw Mode</div>
                    <div className="font-semibold text-indigo-400">Random</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Last Draw</div>
                    <div className="font-semibold text-emerald-400">
                      {draws.length > 0 ? `${draws[draws.length - 1].month}/${draws[draws.length - 1].year}` : 'None'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Status</div>
                    <div className="font-semibold text-amber-400">
                      {draws.length > 0 ? draws[draws.length - 1].status : 'No draws'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={createDraw} className="btn-primary">Create Draw</button>
                  {draws.filter(d => d.status === 'draft').map(draw => (
                    <button key={draw._id} onClick={() => simulateDraw(draw._id)} className="btn-secondary">
                      Simulate {draw.month}/{draw.year}
                    </button>
                  ))}
                  {draws.filter(d => d.status === 'simulated').map(draw => (
                    <button key={draw._id} onClick={() => publishDraw(draw._id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg transition-all duration-200">
                      Publish {draw.month}/{draw.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Winners Table */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Recent Winners
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Winner</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Draw</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Match</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Prize</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {winners.length > 0 ? winners.slice(0, 10).map((winner) => (
                        <tr key={winner._id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4">{winner.userId?.email || 'Unknown'}</td>
                          <td className="py-3 px-4">{winner.drawId ? `${winner.drawId.month}/${winner.drawId.year}` : 'N/A'}</td>
                          <td className="py-3 px-4">{winner.matchCount || 'N/A'}-number</td>
                          <td className="py-3 px-4 font-semibold text-emerald-400">${winner.prizeAmount || 0}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              winner.payoutStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' :
                              winner.payoutStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {winner.payoutStatus || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              winner.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                              winner.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                              winner.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {winner.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="py-8 px-4 text-center text-slate-400">
                            No winners yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold mb-2">{sidebarItems.find(item => item.id === activeTab)?.label} Page</h3>
              <p className="text-slate-400">This section is under development. Core functionality available in Overview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
