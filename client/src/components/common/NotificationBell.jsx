import React, { useState, useEffect } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        await fetch('/api/notifications/read', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchNotifications();
      } catch (err) {
        console.error('Failed to mark as read');
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={markAsRead}
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
          padding: '8px', display: 'flex', alignItems: 'center' 
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white',
            borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="card" style={{ 
          position: 'absolute', top: '100%', right: 0, width: '300px', zIndex: 1000,
          maxHeight: '400px', overflowY: 'auto', padding: '1rem', marginTop: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No new alerts.</p>
          ) : (
            notifications.map(n => (
              <div key={n._id} style={{ 
                padding: '0.8rem 0', borderBottom: '1px solid var(--bg-main)',
                opacity: n.is_read ? 0.6 : 1
              }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>{n.message}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
