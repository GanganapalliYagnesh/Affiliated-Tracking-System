import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config/api';
import { AuthContext } from '../context/AuthContext';

const KYC = () => {
  const [formData, setFormData] = useState({
    pan_number: '', bank_account: '', ifsc_code: '', upi_id: '',
    youtube_url: '', instagram_handle: '', website_url: ''
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/affiliates/kyc`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('KYC submitted successfully! Your account is under review.');
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert('KYC submission failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Complete Your KYC</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
          Please provide your business and payment details to activate your affiliate account.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>1. Financial Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="PAN Number" value={formData.pan_number} onChange={(e) => setFormData({...formData, pan_number: e.target.value})} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Bank Account Number" style={{ flex: 1 }} value={formData.bank_account} onChange={(e) => setFormData({...formData, bank_account: e.target.value})} required />
                <input type="text" placeholder="IFSC Code" style={{ flex: 1 }} value={formData.ifsc_code} onChange={(e) => setFormData({...formData, ifsc_code: e.target.value})} required />
              </div>
              <input type="text" placeholder="UPI ID (e.g. name@okaxis)" value={formData.upi_id} onChange={(e) => setFormData({...formData, upi_id: e.target.value})} required />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>2. Traffic Sources (Optional)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="url" placeholder="YouTube Channel URL" value={formData.youtube_url} onChange={(e) => setFormData({...formData, youtube_url: e.target.value})} />
              <input type="text" placeholder="Instagram Handle (e.g. @username)" value={formData.instagram_handle} onChange={(e) => setFormData({...formData, instagram_handle: e.target.value})} />
              <input type="url" placeholder="Website URL" value={formData.website_url} onChange={(e) => setFormData({...formData, website_url: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Submit KYC for Review</button>
        </form>
      </div>
    </div>
  );
};

export default KYC;
