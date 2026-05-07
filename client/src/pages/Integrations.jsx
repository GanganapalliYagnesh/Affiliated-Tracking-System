import React, { useState } from 'react';

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('ecommerce');

  const integrations = [
    { id: 'shopify', name: 'Shopify', type: 'ecommerce', desc: 'Sync orders and automate commission payouts via Shopify Webhooks.', icon: '🛍️' },
    { id: 'woo', name: 'WooCommerce', type: 'ecommerce', desc: 'Native plugin for WordPress to track sales and sync product data.', icon: '🛒' },
    { id: 'razorpay', name: 'Razorpay', type: 'payment', desc: 'Trigger commissions on successful payment events.', icon: '💳' },
    { id: 'stripe', name: 'Stripe', type: 'payment', desc: 'Global payment integration with automatic conversion tracking.', icon: '🌍' }
  ];

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Ecosystem Integrations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Connect your store and payment gateways to automate your affiliate network.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {integrations.map(int => (
          <div key={int.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>{int.icon}</span>
              <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{int.type}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{int.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', flexGrow: 1 }}>{int.desc}</p>
            <button className="btn-primary" style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }} onClick={() => alert(`Redirecting to ${int.name} setup...`)}>
              Configure Integration
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '3rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(236,72,153,0.05))' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Webhook Configuration (For Developers)</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Use the following endpoint to manually trigger conversions from custom platforms:</p>
        <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}>
          POST /api/webhooks/conversion
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required JSON Payload:</p>
        <pre style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.8rem', marginTop: '0.5rem', color: '#a5b4fc' }}>
{`{
  "clickId": "UUID_FROM_COOKIE",
  "orderId": "SHOP_ORDER_123",
  "revenue": 1500.00,
  "customerEmail": "customer@example.com"
}`}
        </pre>
      </div>
    </div>
  );
};

export default Integrations;
