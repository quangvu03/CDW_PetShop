import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/auth/css/AuthStyles.css';
import { verifyOTP } from '../../services/authService'; // ✅ Dùng service

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (!/^[0-9]$/.test(element.value) && element.value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.some(value => value.trim() === '')) {
      toast.error('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    const code = otp.join('');
    const email = localStorage.getItem("otp_email");

    try {
      const res = await verifyOTP({ email, otp: code }); // ✅ Gọi service
      toast.success(res.data.message || 'Xác thực thành công');
      localStorage.removeItem("otp_email");
      navigate('/auth/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mã OTP không hợp lệ');
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
        <h2 className="auth-title">Xác thực mã OTP</h2>

        <form onSubmit={handleSubmit}>
          <div className="otp-box">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
                required
              />
            ))}
          </div>
          <button type="submit" className="auth-button">Xác nhận</button>
        </form>
      </div>
    </div>
  );
}
