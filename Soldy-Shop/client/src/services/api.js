import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('soldyToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
