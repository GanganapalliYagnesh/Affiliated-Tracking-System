import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/payouts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setPayouts(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch payouts');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/payouts/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`Payout marked as ${status} successfully!`);
        fetchPayouts();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading payout requests...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Payout Requests</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and process affiliate withdrawal requests.</p>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Affiliate</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Method</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No payout requests found.</td></tr>
            ) : payouts.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>
                  <strong>{p.affiliate_id?.user_id?.name || 'Unknown'}</strong><br />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.affiliate_id?.user_id?.email || ''}</span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{p.amount}</td>
                <td style={{ padding: '1rem', textTransform: 'uppercase' }}>{p.payment_method}</td>
                <td style={{ padding: '1rem' }}>{new Date(p.requested_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    background: p.status === 'paid' ? '#f0fdf4' : p.status === 'pending' ? '#fffbeb' : '#f3f4f6',
                    color: p.status === 'paid' ? '#166534' : p.status === 'pending' ? '#92400e' : '#374151'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {p.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdateStatus(p._id, 'approved')} className="btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', background: '#3b82f6' }}>Approve</button>
                      <button onClick={() => handleUpdateStatus(p._id, 'paid')} className="btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', background: '#22c55e' }}>Mark Paid</button>
                    </div>
                  )}
                  {p.status === 'approved' && (
                     <button onClick={() => handleUpdateStatus(p._id, 'paid')} className="btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', background: '#22c55e' }}>Mark Paid</button>
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

export default AdminPayouts;
