import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MarketingTools = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [profile, setProfile] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [campRes, profRes] = await Promise.all([
        fetch('/api/affiliates/campaigns', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/affiliates/profile', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (campRes.ok) {
        const campData = await campRes.json();
        setCampaigns(campData);
        if (campData.length > 0) setSelectedCampaign(campData[0]._id);
      }
      
      if (profRes.ok) {
        setProfile(await profRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleGenerate = () => {
    if (!profile?.affiliate_code) {
      alert('You need an active affiliate code.');
      return;
    }
    
    // Mock Short Link and Coupon for the demo
    const mockShort = `${profile.affiliate_code.toLowerCase().substring(0,3)}${selectedCampaign.substring(0,2)}`;
    const mockCoupon = `${profile.user_id.name.split(' ')[0].toUpperCase()}${Math.floor(Math.random() * 100)}`;
    
    setGeneratedLink(`/api/track?ref=${profile.affiliate_code}&campaign=${selectedCampaign}`);
    setShortLink(`/api/track/a/${mockShort}`);
    setCouponCode(mockCoupon);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const captions = [
    { title: 'Instagram / WhatsApp', text: 'Exclusive Deal! Use my code [CODE] or click my link to save big! 🚀 #Affiliate' },
    { title: 'YouTube Description', text: 'Grab the products mentioned here: [LINK]. Use code [CODE] at checkout for a surprise discount!' },
    { title: 'Facebook / Review', text: 'Highly recommend this! Quality is top-notch. Secure yours here: [LINK]' }
  ];

  const currentCampaign = campaigns.find(c => c._id === selectedCampaign);

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', animation: 'fadeIn 1s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Marketing Toolbox</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pro tools to generate, track, and optimize your affiliate performance.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Link & Coupon Generator
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Generate custom tracking assets for any active campaign.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Select Campaign</label>
              <select 
                value={selectedCampaign} 
                onChange={(e) => setSelectedCampaign(e.target.value)}
                style={{ padding: '0.8rem', width: '100%' }}
              >
                {campaigns.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.commission_type === 'percentage' ? `${c.commission_value}%` : `₹${c.commission_value}`})</option>
                ))}
              </select>
            </div>
            
            <button className="btn-primary" onClick={handleGenerate} style={{ width: '100%' }}>Generate All Assets</button>

            {generatedLink && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'slideUp 0.4s ease-out' }}>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>FULL TRACKING LINK</span>
                    <button onClick={() => copyToClipboard(generatedLink)} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Copy</button>
                  </div>
                  <code style={{ fontSize: '0.8rem', color: 'var(--text-main)', wordBreak: 'break-all' }}>{generatedLink}</code>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SHORT LINK (PREMIUM)</span>
                    <button onClick={() => copyToClipboard(shortLink)} style={{ fontSize: '0.75rem', color: 'var(--secondary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Copy</button>
                  </div>
                  <code style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{shortLink}</code>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PERSONAL COUPON CODE</span>
                    <button onClick={() => copyToClipboard(couponCode)} style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Copy</button>
                  </div>
                  <code style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 'bold', letterSpacing: '2px' }}>{couponCode}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Attribution Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <strong style={{ fontSize: '0.9rem' }}>Attribution Model: {currentCampaign?.attribution_model?.toUpperCase() || 'LAST-CLICK'}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentCampaign?.attribution_model === 'first-click' 
                  ? 'Commission is awarded to the affiliate who first introduced the customer.' 
                  : 'Commission is awarded to the most recent affiliate link clicked before purchase.'}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                <strong style={{ fontSize: '0.9rem' }}>Cookie Window: {currentCampaign?.cookie_duration || 30} Days</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>We track customers for up to {currentCampaign?.cookie_duration || 30} days after they click your link. You earn even if they buy later!</p>
            </div>
          </div>

          <h4 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1rem' }}>Social Media Captions</h4>
          {captions.map((cap, i) => (
            <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{cap.title}</span>
                <button onClick={() => copyToClipboard(cap.text.replace('[LINK]', generatedLink || 'YOUR_LINK').replace('[CODE]', couponCode || 'YOUR_CODE'))} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>COPY CAPTION</button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{cap.text}"</p>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default MarketingTools;
