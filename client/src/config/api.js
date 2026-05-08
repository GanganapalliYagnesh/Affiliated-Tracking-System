const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5005' 
    : '');

export default API_BASE;
