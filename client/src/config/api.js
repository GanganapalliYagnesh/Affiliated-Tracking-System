const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5005' 
    : (window.location.hostname.endsWith('.vercel.app') ? '' : 'https://affiliatepro-api.onrender.com'));

export default API_BASE;
