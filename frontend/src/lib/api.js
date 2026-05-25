import axios from 'axios';

/**
 * Centralized Axios instance configuration.
 * Hardcoded to target the local Node.js development server on port 5000.
 */
// Prefer Vite environment variable VITE_API_URL in production, fall back to deployed Render URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://paperpulse-1.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

/**
 * Request Interceptor for Bearer Authentication.
 * Automatically injects the JWT token from localStorage into every outgoing HTTP request.
 */
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

/**
 * Response Interceptor for handling Auth Expiry.
 * If 401 is received, it purges the token and forces a redirection if necessary.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Potential redirect logic can be placed here if React Router context is available elsewhere
    }
    return Promise.reject(error);
  }
);

export default api;
