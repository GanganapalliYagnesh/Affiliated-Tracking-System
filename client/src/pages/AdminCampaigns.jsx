import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '', product_name: '', commission_type: 'flat', commission_value: 0, cookie_duration: 30, attribution_model: 'last-click'
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setCampaigns(data);
    } catch (err) {
      console.error('Failed to fetch campaigns');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Campaign created successfully!');
        fetchCampaigns();
        setFormData({ name: '', product_name: '', commission_type: 'flat', commission_value: 0, cookie_duration: 30, attribution_model: 'last-click' });
      }
    } catch (err) {
      alert('Failed to create campaign');
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Campaign Management</h1>
      </header>

      <div className="card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Create New Campaign</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input type="text" placeholder="Campaign Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="Product Name" value={formData.product_name} onChange={(e) => setFormData({...formData, product_name: e.target.value})} required />
          <select value={formData.commission_type} onChange={(e) => setFormData({...formData, commission_type: e.target.value})}>
            <option value="flat">Flat Amount (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
          <input type="number" placeholder="Commission Value" value={formData.commission_value} onChange={(e) => setFormData({...formData, commission_value: e.target.value})} required />
          <select value={formData.cookie_duration} onChange={(e) => setFormData({...formData, cookie_duration: parseInt(e.target.value)})}>
            <option value="30">30 Days Cookie</option>
            <option value="60">60 Days Cookie</option>
            <option value="90">90 Days Cookie</option>
          </select>
          <select value={formData.attribution_model} onChange={(e) => setFormData({...formData, attribution_model: e.target.value})}>
            <option value="last-click">Last-Click Attribution</option>
            <option value="first-click">First-Click Attribution</option>
            <option value="multi-touch">Multi-Touch Attribution</option>
          </select>
          <button type="submit" className="btn-primary">Create Campaign</button>
        </form>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Campaign Name</th>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Commission</th>
              <th style={{ padding: '1rem' }}>Attribution</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}><strong>{c.name}</strong></td>
                <td style={{ padding: '1rem' }}>{c.product_name}</td>
                <td style={{ padding: '1rem' }}>
                  {c.commission_type === 'flat' ? `₹${c.commission_value}` : `${c.commission_value}%`}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>{c.attribution_model}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: c.status === 'active' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                    {c.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCampaigns;
