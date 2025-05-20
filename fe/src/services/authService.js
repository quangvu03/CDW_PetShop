import api from './axiosConfig';

export const register = (data) => api.post('/auth/register', data);
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = (refreshToken) => api.post('/auth/refresh-token', { refreshToken });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password });
export const changePassword = (data) => api.post('/auth/change-password', data);
