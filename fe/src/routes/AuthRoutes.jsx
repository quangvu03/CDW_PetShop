// src/routes/AuthRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOTP from '../pages/auth/VerifyOTP';
import ResetPassword from '../pages/auth/ResetPassword';
import CheckEmail from '../pages/auth/CheckEmail';
import ChangePassword from '../pages/auth/ChangePassword';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="check-email" element={<CheckEmail />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Routes>
  );
}

