import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';
import RoleBasedRoutes from './routes/RoleBasedRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTokenRefresh } from './hooks/useAuth';

export default function App() {
  useTokenRefresh();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleBasedRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Add if you have Seller */}
        {/* <Route path="/seller/*" element={<SellerRoutes />} /> */}
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}
