import axios from 'axios';

// ✅ CORRECT - Use the same variable name
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://driveeasy-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ Use API_BASE_URL, not API_URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout for better error handling
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
// Handle responses and errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Better error messages
    if (error.response?.status === 405) {
      throw new Error('Method not allowed. Please check the API endpoint.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
);

export default api;