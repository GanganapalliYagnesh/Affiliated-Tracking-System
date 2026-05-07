// Centralized API configuration
// In production, VITE_API_URL is set to your deployed backend URL (e.g. https://your-app.onrender.com)
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5005' 
  : 'https://affiliatepro-api.onrender.com';

export default API_BASE;
