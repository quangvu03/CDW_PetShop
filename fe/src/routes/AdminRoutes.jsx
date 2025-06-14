// src/routes/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import Dashboard from '../pages/admin/Dashboard';
import AdminUserManager from '../pages/admin/AdminUserManager';
import AdminCategoryManager from '../pages/admin/AdminCategoryManager';
import AdminPetList from '../pages/admin/AdminPetList';
import AdminOrderList from '../pages/admin/AdminOrderList';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';

import AdminReviewManager from '../pages/admin/AdminReviewManager';
import AdminShippingMethodManager from '../pages/admin/AdminShippingMethodManager';
import AdminVoucherManager from '../pages/admin/AdminVoucherManager';
import AdminVoucherAdd from '../pages/admin/AdminVoucherAdd';
import AdminVoucherEdit from '../pages/admin/AdminVoucherEdit';

import AdminBrowsingHistory from '../pages/admin/AdminBrowsingHistory';
import AdminCartManager from '../pages/admin/AdminCartManager';
import AdminChatboxManager from '../pages/admin/AdminChatboxManager';
import AdminAddUser from '../pages/admin/AdminAddUser';
import AdminUpdateUser from '../pages/admin/AdminUpdateUser';
import AdminUpdatePet from '../pages/admin/AdminUpdatePet';
import AdminAddPet from '../pages/admin/AdminAddPet';
import AdminAddShippingMethod from '../pages/admin/AdminAddShippingMethod';
import AdminEditShippingMethod from '../pages/admin/AdminEditShippingMethod';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<AdminUserManager />} />
        <Route path="updatepet/:id" element={<AdminUpdatePet/>} />
        <Route path="adduser" element={<AdminAddUser />} />
        <Route path="addPet" element={<AdminAddPet />} />
        <Route path="updateUser/:id" element={<AdminUpdateUser />} />
        <Route path="categories" element={<AdminCategoryManager />} />
        <Route path="products" element={<AdminPetList />} />
        <Route path="orders" element={<AdminOrderList />} />
        <Route path="orders/:orderId" element={<AdminOrderDetail />} />
        <Route path="addShipping" element={<AdminAddShippingMethod />} />
          <Route path="editShipping/:id" element={<AdminEditShippingMethod />} />



        {/* Quản lý nâng cao */}
        <Route path="reviews" element={<AdminReviewManager />} />
        <Route path="shipping-methods" element={<AdminShippingMethodManager />} />

        {/* Voucher CRUD */}
        <Route path="vouchers" element={<AdminVoucherManager />} />
        <Route path="vouchers/add" element={<AdminVoucherAdd />} />
        <Route path="vouchers/edit/:id" element={<AdminVoucherEdit />} />

        {/* Hành vi người dùng */}
        <Route path="browsing-history" element={<AdminBrowsingHistory />} />
        <Route path="cart-items" element={<AdminCartManager />} />
        <Route path="chatbox" element={<AdminChatboxManager />} />
      </Route>
    </Routes>
  );
}
