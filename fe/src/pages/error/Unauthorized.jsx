// File: src/pages/error/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', marginTop: '10%' }}>
      <h1>🚫 403 - Không có quyền truy cập</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
}
