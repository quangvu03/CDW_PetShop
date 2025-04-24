import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/auth/css/AuthStyles.css';
import { forgotPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (loading) return;
    setLoading(true);
  
    try {
      const res = await forgotPassword(email);
      toast.success(res.data.message || '✅ Đã gửi email khôi phục');
      setTimeout(() => navigate('/auth/check-email'), 1000); 
    } catch (error) {
      toast.error(error.response?.data?.message || '❌ Gửi email thất bại');
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
        <h2 className="auth-title">Quên mật khẩu</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email để đặt lại mật khẩu"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi mã'}
          </button>
        </form>

        <div className="auth-options single">
          <Link to="/auth/login" className="auth-link center">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
