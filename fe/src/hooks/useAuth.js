// File: src/hooks/useAuth.js
import { useEffect } from 'react';
import { refreshToken } from '../services/authService';
import { toast } from 'react-toastify';

export const useTokenRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return;

      try {
        const res = await refreshToken(refresh);
        const newToken = res.data.accessToken;
        localStorage.setItem('token', newToken);
        console.log("✅ Access token được làm mới!");
      } catch (err) {
        console.error("❌ Refresh token hết hạn → logout.");
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    }, 10 * 60 * 1000); // mỗi 10 phút

    return () => clearInterval(interval);
  }, []);
};
