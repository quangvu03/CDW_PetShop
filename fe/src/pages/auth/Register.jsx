import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import '../../assets/auth/css/AuthStyles.css';
import { toast } from 'react-toastify';
import { register } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { username: '', email: '', password: '' };
    let isValid = true;

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
      isValid = false;
    } else if (form.username.length < 4) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 4 ký tự';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validTlds = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'biz', 'info', 'vn', 'co', 'io'];
    const domain = form.email.split('.').pop().toLowerCase();
    const localPart = form.email.split('@')[0];
    const letterCount = localPart.replace(/[^a-zA-Z]/g, '').length;

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    } else if (!validTlds.includes(domain)) {
      newErrors.email = 'Tên miền email không được hỗ trợ';
      isValid = false;
    } else if (letterCount <= 4) {
      newErrors.email = 'Phần trước @ của email phải chứa hơn 4 chữ cái';
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!form.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất một chữ cái và một số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await register(form);
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
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              className={`auth-input ${errors.username ? 'error' : ''}`}
              required
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`auth-input ${errors.email ? 'error' : ''}`}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className={`auth-input ${errors.password ? 'error' : ''}`}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

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