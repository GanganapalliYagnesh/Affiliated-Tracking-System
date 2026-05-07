import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const defaultStats = { balance: 0, totalEarnings: 0, pendingEarnings: 0, totalWithdrawn: 0, clicks: 0, conversions: 0, conversionRate: 0 };
  const [stats, setStats] = useState(defaultStats);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, profileRes] = await Promise.all([
        fetch('/api/affiliates/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/affiliates/profile', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>Loading account information...</div>;

  const renderStatusBanner = () => {
    switch (profile.status) {
      case 'pending':
        return (
          <div className="card" style={{ background: '#fffbeb', borderLeft: '5px solid #f59e0b', color: '#92400e', marginBottom: '2rem' }}>
            <strong>Account Under Review:</strong> Hi {user?.name || 'Partner'}, your KYC details have been submitted. You will be notified once our team approves your account.
          </div>
        );
      case 'rejected':
        return (
          <div className="card" style={{ background: '#fef2f2', borderLeft: '5px solid #ef4444', color: '#991b1b', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>Application Rejected:</strong> Your account was not approved. Please review your details and resubmit.</span>
              <a href="/kyc" className="btn-primary" style={{ background: '#ef4444', textDecoration: 'none', fontSize: '0.8rem' }}>Resubmit KYC</a>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="card" style={{ background: '#f0fdf4', borderLeft: '5px solid #22c55e', color: '#166534', marginBottom: '2rem' }}>
            <strong>Account Active:</strong> Welcome back, {user?.name || 'Partner'}! Your account is fully approved. You can now generate links and track earnings.
          </div>
        );
      default:
        return (
          <div className="card" style={{ background: '#f3f4f6', borderLeft: '5px solid #6b7280', color: '#374151', marginBottom: '2rem' }}>
            <strong>KYC Required:</strong> Please <a href="/kyc" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>complete your KYC</a> to start earning.
          </div>
        );
    }
  };

  return (
    <div className="container">
      {renderStatusBanner()}
      
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Affiliate Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Performance metrics for the current billing period.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #28a745' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Available Balance</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#28a745', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>₹{stats.balance}</p>
          <button onClick={() => navigate('/payouts')} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Request Payout</button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Total Earnings</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>₹{stats.totalEarnings}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Approved Commissions</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Pending Earnings</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0', color: '#f59e0b' }}>₹{stats.pendingEarnings}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Under review / Hold</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Withdrawn</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--secondary)' }}>₹{stats.totalWithdrawn}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Processed payouts</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Total Clicks</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{stats.clicks}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unique visitors tracked</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>Conversion Rate</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{stats.conversionRate}%</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Efficiency: {stats.conversions} sales</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '3rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Recent Performance Trends</h3>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfaf7', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
          Detailed performance charts will appear here as data accumulates.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
