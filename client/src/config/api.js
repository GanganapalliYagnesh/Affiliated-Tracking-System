// Centralized API configuration
// In production, VITE_API_URL is set to your deployed backend URL (e.g. https://your-app.onrender.com)
const API_BASE = import.meta.env.VITE_API_URL || 'https://affiliatepro-api.onrender.com';

export default API_BASE;
