import React, { useState } from 'react';
import '../../assets/auth/css/AuthStyles.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
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
          <input type="text" name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} className="auth-input" required />
          <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} className="auth-input" required />
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
