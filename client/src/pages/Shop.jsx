import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const clickId = searchParams.get('clickId');
  const product = searchParams.get('product') || 'Premium Item';
  
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  
  const handlePurchase = async () => {
    setPurchaseStatus('processing');
    
    try {
      const orderId = `ORD-RT-${Math.floor(Math.random() * 900000) + 100000}`;
      // Simulate real purchase by firing webhook
      const res = await fetch('/api/webhooks/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickId,
          orderId,
          revenue: Math.floor(Math.random() * 5000) + 1000, // random revenue
          customerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPurchaseStatus('success');
      } else {
        setPurchaseStatus(`error: ${data.error}`);
      }
    } catch (err) {
      setPurchaseStatus('error: connection failed');
    }
  };

  return (
    <div style={{ padding: '4rem 2rem', fontFamily: 'var(--font-sans)', background: '#fcfcfc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ background: '#f3f4f6', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '4rem' }}>🛍️</span>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>{product}</h1>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹2,999</span>
          </div>
          
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
            This is a fully functional real-time testing shop. If you arrived here via a generated tracking link, clicking the purchase button will instantly trigger a conversion webhook and attribute the commission to the affiliate's live dashboard!
          </p>
          
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.85rem', color: '#166534' }}>
            <strong>Tracking Status:</strong><br />
            {clickId ? (
              <>Active Click ID detected: <code style={{ background: '#dcfce7', padding: '0.2rem', borderRadius: '4px' }}>{clickId}</code></>
            ) : (
              <span style={{ color: '#ef4444' }}>No tracking parameters detected. Direct visit.</span>
            )}
          </div>
          
          {purchaseStatus === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecfdf5', borderRadius: '8px', border: '2px dashed #10b981' }}>
              <h2 style={{ color: '#059669', margin: '0 0 0.5rem 0' }}>Payment Successful! 🎉</h2>
              <p style={{ fontSize: '0.9rem', color: '#047857', margin: 0 }}>The affiliate webhook has fired. Check the dashboard to see the real-time commission.</p>
            </div>
          ) : purchaseStatus?.startsWith('error') ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef2f2', borderRadius: '8px', border: '2px dashed #ef4444' }}>
              <h2 style={{ color: '#b91c1c', margin: '0 0 0.5rem 0' }}>Purchase Failed</h2>
              <p style={{ fontSize: '0.9rem', color: '#991b1b', margin: 0 }}>{purchaseStatus}</p>
            </div>
          ) : (
            <button 
              onClick={handlePurchase}
              disabled={!clickId || purchaseStatus === 'processing'}
              style={{
                width: '100%',
                padding: '1rem',
                background: !clickId ? '#d1d5db' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: !clickId ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              {purchaseStatus === 'processing' ? 'Processing Secure Payment...' : 'Complete Purchase Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
