import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction 
  ? 'https://backend.fftourney.com' 
  : 'http://localhost:4400';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  // Use adminToken for moderator routes, ff_token for everything else
  let token;
  if (config.url && (config.url.includes('/moderators') || config.url.includes('/support/admin'))) {
    token = localStorage.getItem('adminToken');
  } else {
    token = localStorage.getItem('ff_token');
  }
  // Fallback: try other token if primary not found
  if (!token) {
    token = localStorage.getItem('adminToken') || localStorage.getItem('ff_token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
export { API_BASE_URL };
