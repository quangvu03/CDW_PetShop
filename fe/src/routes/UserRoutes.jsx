import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';

import Home from '../pages/user/Home';
import ShopGrid from '../pages/user/ShopGrid';
import PetDetail from '../pages/user/PetDetail';
import Cart from '../pages/user/Cart';
import Checkout from '../pages/user/Checkout';
import Payment from '../pages/user/Payment';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import OrderStatus from '../pages/user/OrderStatus';
import PersonalInfo from '../pages/user/PersonalInfo';
import WishlistPet from '../pages/user/WishlistPet';
import ShowBill from '../pages/user/ShowBill';
import SearchResult from '../pages/user/SearchResult';
import Contact from '../pages/user/Contact';
import BlogDetail from '../pages/user/BlogDetail';
import Unauthorized from '../pages/error/Unauthorized';

export default function UserRoutes() {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopGrid />} />
        <Route path="/pet/:id" element={<PetDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/checkout/success" element={<PaymentSuccess />} />
        <Route path="/order/status" element={<OrderStatus />} />
        <Route path="/profile" element={<PersonalInfo />} />
        <Route path="/wishlist" element={<WishlistPet />} />
        <Route path="/orders" element={<ShowBill />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </UserLayout>
  );
}
