import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword } from '../../services/authService';
import '../../assets/auth/css/AuthStyles.css'; // đảm bảo có style

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'newPassword') {
      setPasswordValidations({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[\W_]/.test(value)
      });
    }
  };

  const isPasswordStrong = () => {
    return Object.values(passwordValidations).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("❌ Mật khẩu mới không khớp");
      return;
    }

    if (!isPasswordStrong()) {
      toast.error("❌ Mật khẩu chưa đủ mạnh");
      return;
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      toast.success("✅ Đổi mật khẩu thành công");
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordValidations({});
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-card">
        <h2 className="auth-title">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Mật khẩu hiện tại"
            required
            className="auth-input"
          />
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Mật khẩu mới"
            required
            className="auth-input"
          />

          {/* 💡 Gợi ý trực tiếp */}
          <ul className="password-rules">
            <li className={passwordValidations.length ? 'valid' : ''}>
              ✔ Ít nhất 8 ký tự
            </li>
            <li className={passwordValidations.uppercase ? 'valid' : ''}>
              ✔ Có chữ in hoa (A-Z)
            </li>
            <li className={passwordValidations.lowercase ? 'valid' : ''}>
              ✔ Có chữ thường (a-z)
            </li>
            <li className={passwordValidations.number ? 'valid' : ''}>
              ✔ Có số (0-9)
            </li>
            <li className={passwordValidations.specialChar ? 'valid' : ''}>
              ✔ Có ký tự đặc biệt (!@#...)
            </li>
          </ul>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu mới"
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Cập nhật</button>
        </form>
      </div>
    </div>
  );
}
