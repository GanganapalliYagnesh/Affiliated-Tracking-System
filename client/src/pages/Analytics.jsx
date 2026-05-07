import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    campaignId: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/affiliates/campaigns`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setCampaigns(await res.json());
    } catch (err) {
      console.error('Failed to fetch campaigns');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/affiliates/analytics?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error('Failed to fetch analytics');
    }
  };

  if (!data) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing performance data...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', animation: 'fadeIn 1s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Performance Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Deep dive into your traffic, product efficiency, and earnings trends.</p>
      </header>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1.5rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Campaign Filter</label>
          <select 
            value={filters.campaignId} 
            onChange={(e) => setFilters({...filters, campaignId: e.target.value})}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            <option value="">All Campaigns</option>
            {campaigns.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>From</label>
          <input 
            type="date" 
            value={filters.startDate} 
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            style={{ width: '100%', padding: '0.8rem' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>To</label>
          <input 
            type="date" 
            value={filters.endDate} 
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            style={{ width: '100%', padding: '0.8rem' }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setFilters({ startDate: '', endDate: '', campaignId: '' })}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }}
        >
          Reset
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>TOTAL CLICKS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{data.stats?.totalClicks || 0}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>CONVERSIONS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#10b981' }}>{data.stats?.totalConversions || 0}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>CONV. RATE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--primary)' }}>{data.stats?.conversionRate || 0}%</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>TOTAL REVENUE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--secondary)' }}>₹{data.stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Earnings Trend (Last 7 Days)</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '10px 0' }}>
            {data.trends?.length > 0 ? data.trends.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${Math.max((t.earnings / 5000) * 100, 5)}%`, 
                    background: 'var(--primary)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 1s ease-out',
                    animation: 'growUp 1s ease-out'
                  }}
                  title={`₹${t.earnings}`}
                ></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transform: 'rotate(-45deg)', marginTop: '5px' }}>{t._id.split('-').slice(1).join('/')}</span>
              </div>
            )) : (
              <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No trend data for this period.</div>
            )}
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Product Breakdown</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Earnings distribution across products.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {data.productBreakdown?.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600' }}>{p._id}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{p.total}</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((p.total / 10000) * 100, 100)}%`, height: '100%', background: 'var(--secondary)', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
            {(!data.productBreakdown || data.productBreakdown.length === 0) && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No product data available yet.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Traffic Sources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: '600' }}>YouTube</span>
                  <strong>{data.sources?.youtube || 0}</strong>
                </div>
                <div style={{ height: '4px', background: '#eee', borderRadius: '2px' }}><div style={{ width: '45%', height: '100%', background: '#ef4444', borderRadius: '2px' }}></div></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#fdf2f8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: '600' }}>Instagram</span>
                  <strong>{data.sources?.instagram || 0}</strong>
                </div>
                <div style={{ height: '4px', background: '#eee', borderRadius: '2px' }}><div style={{ width: '35%', height: '100%', background: '#ec4899', borderRadius: '2px' }}></div></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#f0f9ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: '600' }}>Direct / Website</span>
                  <strong>{data.sources?.direct || 0}</strong>
                </div>
                <div style={{ height: '4px', background: '#eee', borderRadius: '2px' }}><div style={{ width: '20%', height: '100%', background: '#0ea5e9', borderRadius: '2px' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Conversions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.conversions?.map((conv, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{conv.campaign_id?.product_name || 'Product Sale'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(conv.created_at).toLocaleDateString()} • {conv.order_id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{conv.revenue}</div>
                  <div style={{ fontSize: '0.7rem', color: conv.status === 'approved' ? '#10b981' : '#f59e0b', fontWeight: '800', textTransform: 'uppercase' }}>{conv.status}</div>
                </div>
              </div>
            ))}
            {(!data.conversions || data.conversions.length === 0) && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No conversions recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes growUp {
          from { height: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default Analytics;
