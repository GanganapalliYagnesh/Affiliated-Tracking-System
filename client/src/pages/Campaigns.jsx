import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState(null);
  const [generatedLinks, setGeneratedLinks] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [campRes, profRes] = await Promise.all([
        fetch(`${API_BASE}/api/affiliates/campaigns`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/affiliates/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (campRes.ok) setCampaigns(await campRes.json());
      if (profRes.ok) setProfile(await profRes.json());
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const generateLink = (campaignId) => {
    const code = profile?.affiliate_code || 'GUEST';
    const trackingUrl = `/api/track?ref=${code}&campaign=${campaignId}`;
    
    setGeneratedLinks(prev => ({
      ...prev,
      [campaignId]: trackingUrl
    }));

    navigator.clipboard.writeText(trackingUrl);
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', animation: 'fadeIn 1s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Available Campaigns</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse products and generate your unique tracking links.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {campaigns.map((c, index) => (
          <div 
            key={c._id} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
              padding: '2rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{c.name}</h2>
              <p style={{ color: 'var(--secondary)', marginBottom: '1rem', fontWeight: '500' }}>{c.product_name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span><strong>Commission:</strong> <span style={{ color: 'var(--accent)' }}>{c.commission_type === 'flat' ? `₹${c.commission_value}` : `${c.commission_value}%`}</span></span>
                <span><strong>Cookie:</strong> <span style={{ color: 'var(--accent)' }}>{c.cookie_duration} Days</span></span>
              </div>

              {generatedLinks[c._id] && (
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  padding: '1.2rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  marginBottom: '1.5rem',
                  animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, width: '4px', height: '100%', 
                    background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' 
                  }}></div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Dynamic Link</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-main)', 
                      wordBreak: 'break-all',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      flex: 1
                    }}>{generatedLinks[c._id]}</code>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copied to clipboard
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => generateLink(c._id)} 
              className="btn-primary" 
              style={{ 
                width: '100%',
                marginTop: '0.5rem'
              }}
            >
              {generatedLinks[c._id] ? 'Regenerate Dynamic Link' : 'Generate Tracking Link'}
            </button>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default Campaigns;
