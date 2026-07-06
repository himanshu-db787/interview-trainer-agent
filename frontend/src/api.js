import axios from 'axios';

const API = axios.create({
  baseURL: 'https://interview-trainer-backend-69ea.onrender.com/api',
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