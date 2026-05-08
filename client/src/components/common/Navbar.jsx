import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ 
        color: 'var(--primary)', 
        textDecoration: 'none', 
        fontSize: '1.8rem', 
        fontFamily: 'var(--font-serif)', 
        fontWeight: 'bold',
        letterSpacing: '-0.02em'
      }}>AffiliatePro</Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <div className="nav-menu" style={{ display: 'flex', gap: '1.5rem', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Admin Home</Link>
                  <Link to="/admin/affiliates" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Affiliates</Link>
                  <Link to="/admin/campaigns" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Campaigns</Link>
                  <Link to="/admin/payouts" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Payouts</Link>
                </>
              ) : (
                <>
                  <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Dashboard</Link>
                  <Link to="/campaigns" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Campaigns</Link>
                  <Link to="/marketing" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Marketing</Link>
                  <Link to="/analytics" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Analytics</Link>
                  <Link to="/payouts" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Payouts</Link>
                </>
              )}
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
            <NotificationBell />
            <span style={{ fontWeight: '500', color: 'var(--secondary)', fontSize: '0.9rem' }}>{user.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Logout</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '600' }}>
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
