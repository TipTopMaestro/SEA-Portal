import axios from 'axios';

// Base API URL for Python Django REST Framework backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to attach Django REST Token / JWT if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_sea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear stored credentials or notify user
      console.warn('Django API: 401 Unauthorized response received.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
