// ✅ File: src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  user: {
    username: localStorage.getItem('username') || '',
    full_name: localStorage.getItem('full_name') || '',
    role: localStorage.getItem('role') || '',
  },
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setRefreshToken: (refreshToken) => {
    localStorage.setItem('refresh_token', refreshToken);
    set({ refreshToken });
  },
  clearAuth: () => {
    localStorage.clear();
    set({ token: null, refreshToken: null, user: {} });
  },
}));

export default useAuthStore;
