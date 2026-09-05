import axios from 'axios';

// Automatically points to your live Render Backend deployment or falls back to local testing
const API_URL = import.meta.env.VITE_API_URL || 'https://onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔒 REQUEST INTERCEPTOR: Automatically appends the JWT bearer token to headers if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chivucha_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
