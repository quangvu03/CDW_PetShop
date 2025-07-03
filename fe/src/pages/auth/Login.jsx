import React, { useState } from 'react';
import '../../assets/auth/css/AuthStyles.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!form.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
      isValid = false;
    } else if (form.username.length <= 4) {
      newErrors.username = 'Tên đăng nhập phải có hơn 4 ký tự';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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
      const res = await login(form);
      const { accessToken, refreshToken, username, role, full_name, userId } = res.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('full_name', full_name || '');
      localStorage.setItem('userId', userId);

      toast.success('Đăng nhập thành công');

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'seller') navigate('/seller');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-card">
        <img src="/assets/user/images/logopetshop.jpg" alt="Logo" className="auth-logo" />
        <h2 className="auth-title">Đăng nhập</h2>

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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-options">
          <Link to="/auth/forgot-password" className="auth-link left">Quên mật khẩu?</Link>
          <Link to="/auth/register" className="auth-link right">Tạo tài khoản mới</Link>
        </div>

        <div className="auth-divider">— Hoặc đăng nhập bằng —</div>

        <div className="auth-social-buttons">
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="auth-social google"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
          >
            <FaGoogle className="icon" />
            Google
          </a>
          <button className="auth-social facebook"><FaFacebookF className="icon" /> Facebook</button>
        </div>
      </div>
    </div>
  );
}