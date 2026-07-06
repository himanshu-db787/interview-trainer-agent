import axios from 'axios';

// Create a universal axios instance
const API = axios.create({
  baseURL: '/api', // Shortened thanks to our proxy setup
});

// Interceptor to automatically attach the JWT token to protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;