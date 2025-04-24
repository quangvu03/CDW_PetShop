// File: src/pages/auth/CheckEmail.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CheckEmail() {
  return (
    <div className="auth-section">
      <div className="auth-card">
        <img src="/assets/user/images/logopetshop.jpg" alt="Logo" className="auth-logo" />
        <h2 className="auth-title">📧 Kiểm tra email của bạn</h2>
        <p className="auth-message">
          Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn.
          <br />
          Vui lòng kiểm tra hộp thư đến hoặc thư rác và nhấp vào liên kết để tiếp tục.
        </p>
        <div className="auth-options">
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="auth-button">
            Mở Gmail
          </a>
          <Link to="/auth/login" className="auth-link center">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
