import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', // 改為相對路徑，自動跟隨目前的網域 (無論是 localhost 還是 ngrok)
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;