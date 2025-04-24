// File: src/hooks/useAuth.js
import { useEffect } from 'react';
import { refreshToken } from '../services/authService';

export const useTokenRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) return;

      try {
        const res = await refreshToken(refresh);
        localStorage.setItem('token', res.data.accessToken);
        console.log("✅ Access token được làm mới!");
      } catch (err) {
        console.error("❌ Refresh token hết hạn → logout.");
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    }, 10 * 60 * 1000); // mỗi 10 phút

    return () => clearInterval(interval);
  }, []);
};
