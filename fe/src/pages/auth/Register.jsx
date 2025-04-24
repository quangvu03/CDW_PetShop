import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import '../../assets/auth/css/AuthStyles.css';
import { toast } from 'react-toastify';
import { register } from '../../services/authService'; // ✅ Sử dụng service

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await register(form); // ✅ Dùng service
      toast.success(res.data.message || 'Vui lòng kiểm tra email. Nhập OTP để hoàn tất đăng ký');
      localStorage.setItem('otp_email', form.email);
      navigate('/auth/verify-otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
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
        <h2 className="auth-title">Đăng ký</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-options">
          <Link to="/auth/login" className="auth-link left">Đã có tài khoản?</Link>
          <Link to="/auth/forgot-password" className="auth-link right">Quên mật khẩu?</Link>
        </div>

        <div className="auth-divider">— Hoặc đăng ký bằng —</div>

        <div className="auth-social-buttons">
          <button className="auth-social google">
            <FaGoogle className="icon" /> Google
          </button>
          <button className="auth-social facebook">
            <FaFacebookF className="icon" /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
