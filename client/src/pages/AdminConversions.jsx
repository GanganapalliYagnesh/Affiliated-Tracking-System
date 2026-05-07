import React, { useState, useEffect } from 'react';

const AdminConversions = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    try {
      const res = await fetch('/api/admin/conversions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setConversions(await res.json());
    } catch (err) {
      console.error('Failed to fetch conversions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/conversions/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchConversions();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading conversion data...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Conversion Verification</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and approve affiliate conversions before commissions are disbursed.</p>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)', fontSize: '0.85rem' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Affiliate</th>
              <th style={{ padding: '1rem' }}>Revenue</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversions.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.order_id}</td>
                <td style={{ padding: '1rem' }}>{c.affiliate_id?.affiliate_code || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>₹{c.revenue}</td>
                <td style={{ padding: '1rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: c.status === 'approved' ? '#f0fdf4' : (c.status === 'pending' ? '#fffbeb' : '#fef2f2'),
                    color: c.status === 'approved' ? '#166534' : (c.status === 'pending' ? '#92400e' : '#991b1b')
                  }}>
                    {c.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {c.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(c._id, 'approved')} style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Approve</button>
                      <button onClick={() => handleUpdateStatus(c._id, 'rejected')} style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminConversions;
