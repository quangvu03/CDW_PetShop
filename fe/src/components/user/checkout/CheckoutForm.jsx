// src/components/user/checkout/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../services/userService';
import { createOrder } from '../../../services/orderService';
import { createPaymentLink } from '../../../services/paymentService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm({ cartItems = [], totalAmount = 0, selectedShipping = null, userInfo, setUserInfo, paymentMethod }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        if (userData) {
          let addressParts = [];
          if (userData.address) {
            addressParts = userData.address.split(',').map(part => part.trim());
          }
          
          const country = addressParts[3] || '';
          const district = addressParts[2] || '';
          const ward = addressParts[1] || '';
          const address = addressParts[0] || '';

          setUserInfo(prev => ({
            ...prev,
            userId: userData.id || prev.userId,
            fullName: userData.fullName || '',
            phoneNumber: userData.phone || '',
            email: userData.email || '',
            country,
            district,
            ward,
            address
          }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserData();
  }, [provinces, setUserInfo]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  useEffect(() => {
    const selectedProvince = provinces.find(p => p.name === userInfo.country);
    setDistricts(selectedProvince ? selectedProvince.districts : []);
    if (!selectedProvince) {
      setUserInfo(prev => ({ ...prev, district: '', ward: '' }));
    }
  }, [userInfo.country, provinces, setUserInfo]);

  useEffect(() => {
    const selectedDistrict = districts.find(d => d.name === userInfo.district);
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    if (!selectedDistrict) {
      setUserInfo(prev => ({ ...prev, ward: '' }));
    }
  }, [userInfo.district, districts, setUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit form:', { cartItems, totalAmount, selectedShipping, paymentMethod });

    if (!userInfo.fullName || !userInfo.phoneNumber || !userInfo.email || 
        !userInfo.country || !userInfo.district || !userInfo.ward || !userInfo.address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    if (!selectedShipping) {
      toast.error('Vui lòng chọn phương thức giao hàng');
      return;
    }

    try {
      setIsSubmitting(true);

      const totalItemPrice = cartItems.reduce(
        (sum, item) => sum + ((item.pet?.price || item.product?.price || 0) * (item.quantity || 1)),
        0
      );
      const shippingFee = selectedShipping?.price ? Number(selectedShipping.price) : 0;

      const orderRequest = {
        userId: userInfo.userId,
        totalPrice: totalItemPrice + shippingFee,
        paymentMethod: paymentMethod,
        shippingAddress: `${userInfo.address}, ${userInfo.ward}, ${userInfo.district}, ${userInfo.country}`,
        shippingMethodId: selectedShipping.id,
        phoneNumber: userInfo.phoneNumber,
        shippingName: userInfo.fullName,
        orderRequestList: cartItems.map(item => ({
          productId: item.product?.id ? Number(item.product.id) : 0,
          petId: item.pet?.id ? Number(item.pet.id) : 0,
          quantity: item.quantity ? Number(item.quantity) : 1,
          price: item.pet?.price || item.product?.price || 0
        }))
      };

      console.log('Order request:', orderRequest);

      const orderResponse = await createOrder(orderRequest);
      console.log('Order response:', orderResponse);

      if (orderResponse.success) {
        if (paymentMethod === 'PAYOS') {
          const paymentData = {
            productName: `Đơn hàng thú cưng ${orderResponse.data.orderId}`,
            description: `Thanh toán đơn hàng #${orderResponse.data.orderId}`,
            returnUrl: `http://localhost:3000/user/payment-callback?status=success&orderId=${orderResponse.data.orderId}`,
            cancelUrl: `http://localhost:3000/user/payment-callback?status=cancelled&orderId=${orderResponse.data.orderId}`,
            price: Math.round(totalItemPrice + shippingFee),
            orderId: orderResponse.data.orderId
          };

          const paymentResponse = await createPaymentLink(paymentData);
          if (paymentResponse.error === 0) {
            const expiryDateTime = new Date(paymentResponse.expiredAt);
            const expiryDateTimeLocal = new Date(expiryDateTime.getTime() + (7 * 60 * 60 * 1000)); // Điều chỉnh múi giờ UTC+7
            toast.info(`Liên kết thanh toán sẽ hết hạn vào ${expiryDateTimeLocal.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} (6 giờ từ khi tạo)`);
            window.location.href = paymentResponse.checkoutUrl;
            localStorage.removeItem('checkout_items');
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            toast.error(paymentResponse.message || 'Không thể tạo liên kết thanh toán');
          }
        } else {
          toast.success('Đặt hàng thành công!');
          localStorage.removeItem('checkout_items');
          window.dispatchEvent(new Event('cart-updated'));
          navigate('/user/order-history');
        }
      } else {
        toast.error(orderResponse.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      toast.error(error || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-lg-10 col-12 pe-lg-4">
      <div className="checkout-form">
        <h2>Thanh toán của bạn</h2>
        <p>Vui lòng điền thông tin</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Họ và tên<span>*</span></label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={userInfo.fullName}
                  onChange={handleChange}
                  required 
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Số điện thoại<span>*</span></label>
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  value={userInfo.phoneNumber}
                  onChange={handleChange}
                  required 
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Email<span>*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={userInfo.email}
                  onChange={handleChange}
                  required 
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Tỉnh/Thành Phố<span>*</span></label>
                <select 
                  name="country" 
                  value={userInfo.country}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Quận/Huyện<span>*</span></label>
                <select 
                  name="district" 
                  value={userInfo.district}
                  onChange={handleChange}
                  required
                  disabled={!userInfo.country}
                  className="form-control"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Xã/Phường<span>*</span></label>
                <select 
                  name="ward" 
                  value={userInfo.ward}
                  onChange={handleChange}
                  required
                  disabled={!userInfo.district}
                  className="form-control"
                >
                  <option value="">Chọn xã/phường</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Địa chỉ cụ thể<span>*</span></label>
                <input 
                  type="text" 
                  name="address" 
                  value={userInfo.address}
                  onChange={handleChange}
                  required 
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Ghi chú khác</label>
                <textarea 
                  name="note" 
                  rows="12" 
                  style={{ minHeight: '200px' }}
                  placeholder="Điền các thông tin cần ghi chú vào đây"
                  value={userInfo.note}
                  onChange={handleChange}
                  className="form-control"
                ></textarea>
              </div>
            </div>
            <div className="col-12">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !cartItems.length}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
