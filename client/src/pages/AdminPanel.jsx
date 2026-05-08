import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config/api';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing system metrics...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', animation: 'fadeIn 1s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Welcome, {user?.name || 'Platform Admin'}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Global oversight of network revenue, ROI, and partner performance.</p>
      </header>

      {/* Primary Financial Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em' }}>Total Platform Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>₹{stats.totalRevenue.toFixed(2)}</p>
          <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Net Profit:</span>
            <strong style={{ color: '#10b981' }}>₹{stats.netProfit.toFixed(2)}</strong>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #ec4899' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em' }}>Affiliate Cost</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>₹{stats.totalAffiliateRevenue.toFixed(2)}</p>
          <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payout Ratio:</span>
            <strong style={{ color: '#f59e0b' }}>{((stats.totalAffiliateRevenue / stats.totalRevenue) * 100 || 0).toFixed(1)}%</strong>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #0ea5e9' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em' }}>Program ROI</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--primary)' }}>{stats.roi}%</p>
          <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Conversions:</span>
            <strong>{stats.totalConversions}</strong>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.1em' }}>Fraud Shield Active</h3>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.fraudBlocked}</p>
          <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Blocked Bots:</span>
            <strong style={{ color: '#ef4444' }}>{stats.botTraffic}% traffic</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Top Affiliates</h3>
            <Link to="/admin/affiliates" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>VIEW ALL</Link>
          </div>
          {stats.topAffiliates?.map((aff, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', marginBottom: '0.8rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{aff.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rank #{i+1}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{aff.earnings.toFixed(2)}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Total Earned</div>
              </div>
            </div>
          ))}
          {stats.topAffiliates?.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem' }}>No commissions approved yet.</p>}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Campaign Performance</h3>
            <Link to="/admin/campaigns" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>MANAGE</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0' }}>Campaign</th>
                <th style={{ padding: '0.5rem 0' }}>Revenue</th>
                <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Sales</th>
              </tr>
            </thead>
            <tbody>
              {stats.campaignPerformance?.map((cp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: '500' }}>{cp.name}</td>
                  <td style={{ padding: '1rem 0' }}>₹{cp.revenue.toFixed(0)}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold' }}>{cp.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.campaignPerformance?.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem' }}>No active campaigns with sales.</p>}
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
        <Link to="/admin/affiliates" className="card" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Partner Directory</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage {stats.activePartners} active affiliates</div>
          </div>
        </Link>

        <Link to="/admin/payouts" className="card" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Pending Payouts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review and process withdrawals</div>
          </div>
        </Link>

        <Link to="/admin/conversions" className="card" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Sales Verification</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approve pending conversions</div>
          </div>
        </Link>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  );
};

export default AdminPanel;
