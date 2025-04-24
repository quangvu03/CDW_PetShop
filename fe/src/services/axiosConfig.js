// ✅ File: src/services/axiosConfig.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { refreshToken as callRefreshToken } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Tự động gắn token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Tự động refresh token khi bị 401 Unauthorized
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem('refresh_token');

    if (error.response?.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true;
      try {
        const res = await callRefreshToken(refresh);
        const newToken = res.data.accessToken;

        // 🔄 Cập nhật token mới
        localStorage.setItem('token', newToken);

        // 🔄 Gắn token mới cho request gốc
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        toast.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
