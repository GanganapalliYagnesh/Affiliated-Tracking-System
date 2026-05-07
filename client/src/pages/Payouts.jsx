import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');

  const [showInvoice, setShowInvoice] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const [pRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/api/affiliates/payouts`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/affiliates/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (pRes.ok) setPayouts(await pRes.json());
      if (sRes.ok) {
        const stats = await sRes.json();
        setBalance(stats.balance);
      }
    } catch (err) {
      console.error('Failed to fetch payout data');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) < 500) return alert('Minimum withdrawal amount is ₹500');
    if (parseFloat(amount) > balance) return alert('Insufficient balance');

    try {
      const res = await fetch(`${API_BASE}/api/affiliates/payouts/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: parseFloat(amount), payment_method: method })
      });
      if (res.ok) {
        alert('Withdrawal request submitted successfully!');
        setAmount('');
        fetchPayouts();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      alert('Failed to submit request');
    }
  };

  const renderInvoice = () => {
    if (!showInvoice) return null;
    const p = showInvoice;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
        <div id="invoice-content" style={{ background: 'white', color: '#333', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '800px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
          <button onClick={() => setShowInvoice(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>&times;</button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>AffiliatePro</h2>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Automated Payout Receipt</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ textTransform: 'uppercase', color: '#999', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Invoice</h3>
              <p style={{ fontWeight: 'bold' }}>#{p._id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payout To</p>
              <p style={{ fontWeight: 'bold' }}>Partner ID: {p.affiliate_id.substring(0, 8)}</p>
              <p style={{ fontSize: '0.9rem' }}>Method: {p.payment_method.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Details</p>
              <p style={{ fontSize: '0.9rem' }}>Date: {new Date(p.requested_at).toLocaleDateString()}</p>
              <p style={{ fontSize: '0.9rem' }}>Status: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>PAID</span></p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '1.5rem 0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
              <span>Affiliate Commission Withdrawal</span>
              <span style={{ fontWeight: 'bold' }}>₹{p.amount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Amount Paid</p>
            <h2 style={{ fontSize: '2rem', color: '#000' }}>₹{p.amount.toFixed(2)}</h2>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
            This is a computer-generated invoice for compliance and record-keeping purposes. No signature required.
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }} className="no-print">
            <button onClick={() => window.print()} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Print / Save as PDF</button>
            <button onClick={() => setShowInvoice(null)} style={{ padding: '0.8rem 2rem', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden; }
            #invoice-content, #invoice-content * { visibility: visible; }
            #invoice-content { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; padding: 0; }
            .no-print { display: none !important; }
          }
        `}} />
      </div>
    );
  };

  return (
    <div className="container">
      {renderInvoice()}
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Earnings & Payouts</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your funds and request withdrawals.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Available for Withdrawal</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>₹{balance}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Minimum threshold: ₹500</p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Request New Payout</h3>
          <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="upi">UPI Transfer</option>
              <option value="bank">Bank Transfer</option>
            </select>
            <button type="submit" className="btn-primary" disabled={balance < 500}>Request Withdrawal</button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: '3rem', padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>Withdrawal History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)', fontSize: '0.85rem' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Requested At</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Method</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <td style={{ padding: '1rem' }}>{new Date(p.requested_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>₹{p.amount}</td>
                <td style={{ padding: '1rem', textTransform: 'uppercase' }}>{p.payment_method}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: p.status === 'paid' ? '#f0fdf4' : '#fffbeb',
                    color: p.status === 'paid' ? '#166534' : '#92400e'
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {p.status === 'paid' && (
                    <button 
                      onClick={() => setShowInvoice(p)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No payout requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Payouts;
