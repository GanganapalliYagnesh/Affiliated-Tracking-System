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

  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return 'var(--primary)';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={markAsRead}
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
          padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--primary)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white',
            borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)', border: '2px solid var(--bg-card)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="card" style={{ 
          position: 'absolute', top: '120%', right: 0, width: '340px', zIndex: 1000,
          maxHeight: '480px', overflowY: 'auto', padding: '1.2rem', marginTop: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          animation: 'slideIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h4>
            {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{unreadCount} New</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You're all caught up! ✨</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n._id} style={{ 
                  padding: '0.9rem', 
                  borderRadius: '10px',
                  background: n.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                  border: `1px solid ${n.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.1)'}`,
                  transition: 'background 0.2s',
                  cursor: 'default',
                  display: 'flex',
                  gap: '12px'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.05)'}
                >
                  <div style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', 
                    background: getTypeColor(n.type), marginTop: '6px',
                    flexShrink: 0, boxShadow: `0 0 8px ${getTypeColor(n.type)}`
                  }} />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '4px' }}>{n.message}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{getTimeAgo(n.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
