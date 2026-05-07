import React, { useState, useEffect } from 'react';

const AdminAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const res = await fetch('/api/admin/affiliates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setAffiliates(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch affiliates');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/affiliates/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`Affiliate ${status} successfully!`);
        fetchAffiliates();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading affiliate records...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Affiliate Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your network partners, review KYC, and update statuses.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: 'bold' }}>
          Total Affiliates: <span style={{ color: 'var(--primary)' }}>{affiliates.length}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {affiliates.map(aff => (
          <div key={aff._id} className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            borderTop: aff.status === 'approved' ? '4px solid #22c55e' : aff.status === 'pending' ? '4px solid #f59e0b' : '4px solid #ef4444'
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                borderRadius: '20px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: aff.status === 'approved' ? '#f0fdf4' : aff.status === 'pending' ? '#fffbeb' : '#fef2f2',
                color: aff.status === 'approved' ? '#166534' : aff.status === 'pending' ? '#92400e' : '#991b1b',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {aff.status}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{aff.user_id?.name || 'Unknown User'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{aff.user_id?.email || 'N/A'}</p>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', flexGrow: 1, border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: '800' }}>Review Details</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mobile:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{aff.user_id?.mobile || 'N/A'}</strong>
                </div>

                {aff.pan_number ? (
                  <>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.2rem 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>PAN:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{aff.pan_number}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Bank A/C:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{aff.bank_account}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>UPI ID:</span>
                      <strong style={{ color: 'var(--primary)' }}>{aff.upi_id || 'N/A'}</strong>
                    </div>
                    
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.2rem 0' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>SOCIAL PROFILES:</span>
                      {aff.youtube_url && (
                        <a href={aff.youtube_url} target="_blank" rel="noreferrer" style={{ color: '#ef4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          YouTube
                        </a>
                      )}
                      {aff.instagram_handle && (
                        <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          {aff.instagram_handle}
                        </span>
                      )}
                      {aff.website_url && (
                        <a href={aff.website_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          Website
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '1rem 0', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                    KYC details pending submission
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
              {aff.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdateStatus(aff._id, 'approved')} className="btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', background: '#22c55e' }}>Approve Partner</button>
                  <button onClick={() => handleUpdateStatus(aff._id, 'rejected')} className="btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', background: '#ef4444' }}>Reject</button>
                </>
              )}
              {aff.status === 'approved' && (
                <button onClick={() => handleUpdateStatus(aff._id, 'suspended')} className="btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}>Suspend Account</button>
              )}
              {(aff.status === 'suspended' || aff.status === 'rejected') && (
                <button onClick={() => handleUpdateStatus(aff._id, 'approved')} className="btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', background: 'transparent', color: '#22c55e', border: '1px solid #22c55e' }}>Restore Account</button>
              )}
            </div>
          </div>
        ))}
        {affiliates.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            No affiliates found in the network.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAffiliates;
