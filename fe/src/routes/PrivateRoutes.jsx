import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ roles = [] }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/auth/login" />;
  if (roles.length > 0 && !roles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
}
