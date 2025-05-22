import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

export default function RoleBasedRoutes() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth/login" replace />;

  try {
    const { role } = jwtDecode(token);

    switch (role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'seller':
        return <Navigate to="/seller" replace />;
      case 'user':
      default:
        return <Navigate to="/user" replace />;
    }
  } catch (err) {
    return <Navigate to="/auth/login" replace />;
  }
}
