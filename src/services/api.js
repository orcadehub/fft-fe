import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction 
  ? 'https://fft-be.vercel.app' 
  : 'http://localhost:4400';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
export { API_BASE_URL };
