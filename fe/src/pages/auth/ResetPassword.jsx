// ✅ File: src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/auth/css/AuthStyles.css';
import { resetPassword } from '../../services/authService';

export default function ResetPassword() {
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error('❌ Mật khẩu không khớp');
      return;
    }

    if (!token) {
      toast.error('❌ Không tìm thấy mã đặt lại mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, form.newPassword);
      toast.success(res.data.message || '✅ Đặt lại mật khẩu thành công!');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error.response?.data?.message || '❌ Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-card">
        <img
          src="/assets/user/images/logopetshop.jpg"
          alt="Logo"
          className="auth-logo"
        />
        <h2 className="auth-title">Đặt lại mật khẩu</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Mật khẩu mới"
            className="auth-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="auth-options single">
          <Link to="/auth/login" className="auth-link center">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
