import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const username = params.get('username');
    const role = params.get('role');
    const fullName = params.get('fullName');
    const userId = params.get('userId');

    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('full_name', fullName || '');
      localStorage.setItem('userId', userId);

      toast.success('Đăng nhập Google thành công');

      navigate("/");
    }
  }, [navigate]);

  return <div>Đang chuyển hướng, vui lòng đợi...</div>;
}
