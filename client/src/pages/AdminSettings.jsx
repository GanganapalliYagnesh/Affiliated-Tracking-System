import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    min_payout_threshold: 500,
    default_cookie_duration: 30,
    tds_rate: 5,
    platform_name: 'AffiliatePro',
    currency: 'INR'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setSettings(await res.json());
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to update settings');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading system configuration...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure global commission rules, payout thresholds, and tax compliance.</p>
      </header>

      {message && (
        <div style={{ padding: '1rem', background: '#f0fdf4', color: '#166534', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>General Configuration</h3>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Platform Name</label>
            <input 
              type="text" 
              value={settings.platform_name} 
              onChange={(e) => setSettings({...settings, platform_name: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Currency Code</label>
            <input 
              type="text" 
              value={settings.currency} 
              onChange={(e) => setSettings({...settings, currency: e.target.value})} 
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>Payout & Commission Rules</h3>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Min. Payout Threshold (₹)</label>
            <input 
              type="number" 
              value={settings.min_payout_threshold} 
              onChange={(e) => setSettings({...settings, min_payout_threshold: parseInt(e.target.value)})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Default Cookie Duration (Days)</label>
            <input 
              type="number" 
              value={settings.default_cookie_duration} 
              onChange={(e) => setSettings({...settings, default_cookie_duration: parseInt(e.target.value)})} 
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>Tax Compliance (India TDS)</h3>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>TDS Rate (%)</label>
            <input 
              type="number" 
              step="0.1"
              value={settings.tds_rate} 
              onChange={(e) => setSettings({...settings, tds_rate: parseFloat(e.target.value)})} 
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Save System Configuration</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
