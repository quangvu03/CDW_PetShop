import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../../../services/userService';
import { createOrder } from '../../../services/orderService';
import { createPaymentLink } from '../../../services/paymentService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm({ cartItems = [], totalAmount = 0, selectedShipping = null, userInfo, setUserInfo, paymentMethod }) {
  const { t } = useTranslation();
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
        console.error(t('checkout_form_user_error_log', { defaultValue: 'Lỗi khi lấy thông tin người dùng:' }), error);
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
      toast.error(t('checkout_form_required_fields', { defaultValue: 'Vui lòng điền đầy đủ thông tin bắt buộc' }));
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error(t('checkout_form_empty_cart', { defaultValue: 'Giỏ hàng trống' }));
      return;
    }

    if (!selectedShipping) {
      toast.error(t('checkout_form_no_shipping', { defaultValue: 'Vui lòng chọn phương thức giao hàng' }));
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

      console.log(t('checkout_form_order_request_log', { defaultValue: 'Order request:' }), orderRequest);

      const orderResponse = await createOrder(orderRequest);
      console.log(t('checkout_form_order_response_log', { defaultValue: 'Order response:' }), orderResponse);

      if (orderResponse.success) {
        if (paymentMethod === 'PAYOS') {
          const paymentData = {
            productName: t('checkout_form_payment_product', { defaultValue: `Đơn hàng thú cưng ${orderResponse.data.orderId}` }),
            description: t('checkout_form_payment_description', { defaultValue: `Thanh toán đơn hàng #${orderResponse.data.orderId}` }),
            returnUrl: `http://localhost:3000/user/payment-callback?status=success&orderId=${orderResponse.data.orderId}`,
            cancelUrl: `http://localhost:3000/user/payment-callback?status=cancelled&orderId=${orderResponse.data.orderId}`,
            price: Math.round(totalItemPrice + shippingFee),
            orderId: orderResponse.data.orderId
          };

          const paymentResponse = await createPaymentLink(paymentData);
          if (paymentResponse.error === 0) {
            const expiryDateTime = new Date(paymentResponse.expiredAt);
            const expiryDateTimeLocal = new Date(expiryDateTime.getTime() + (7 * 60 * 60 * 1000));
            toast.info(t('checkout_form_payment_expiry', { defaultValue: `Liên kết thanh toán sẽ hết hạn vào ${expiryDateTimeLocal.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} (6 giờ từ khi tạo)` }));
            window.location.href = paymentResponse.checkoutUrl;
            localStorage.removeItem('checkout_items');
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            toast.error(t('checkout_form_payment_error', { defaultValue: paymentResponse.message || 'Không thể tạo liên kết thanh toán' }));
          }
        } else {
          toast.success(t('checkout_form_order_success', { defaultValue: 'Đặt hàng thành công!' }));
          localStorage.removeItem('checkout_items');
          window.dispatchEvent(new Event('cart-updated'));
          navigate('/user/order-history');
        }
      } else {
        toast.error(t('checkout_form_order_failure', { defaultValue: orderResponse.message || 'Đặt hàng thất bại' }));
      }
    } catch (error) {
      console.error(t('checkout_form_order_error_log', { defaultValue: 'Lỗi khi đặt hàng:' }), error);
      toast.error(t('checkout_form_order_error', { defaultValue: error || 'Có lỗi xảy ra khi đặt hàng' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-lg-10 col-12 pe-lg-4">
      <div className="checkout-form">
        <h2>{t('checkout_form_title', { defaultValue: 'Thanh toán của bạn' })}</h2>
        <p>{t('checkout_form_instruction', { defaultValue: 'Vui lòng điền thông tin' })}</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>{t('checkout_form_full_name', { defaultValue: 'Họ và tên' })}<span>*</span></label>
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
                <label>{t('checkout_form_phone', { defaultValue: 'Số điện thoại' })}<span>*</span></label>
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
                <label>{t('checkout_form_email', { defaultValue: 'Email' })}<span>*</span></label>
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
                <label>{t('checkout_form_province', { defaultValue: 'Tỉnh/Thành Phố' })}<span>*</span></label>
                <select 
                  name="country" 
                  value={userInfo.country}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">{t('checkout_form_select_province', { defaultValue: 'Chọn tỉnh/thành' })}</option>
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
                <label>{t('checkout_form_district', { defaultValue: 'Quận/Huyện' })}<span>*</span></label>
                <select 
                  name="district" 
                  value={userInfo.district}
                  onChange={handleChange}
                  required
                  disabled={!userInfo.country}
                  className="form-control"
                >
                  <option value="">{t('checkout_form_select_district', { defaultValue: 'Chọn quận/huyện' })}</option>
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
                <label>{t('checkout_form_ward', { defaultValue: 'Xã/Phường' })}<span>*</span></label>
                <select 
                  name="ward" 
                  value={userInfo.ward}
                  onChange={handleChange}
                  required
                  disabled={!userInfo.district}
                  className="form-control"
                >
                  <option value="">{t('checkout_form_select_ward', { defaultValue: 'Chọn xã/phường' })}</option>
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
                <label>{t('checkout_form_address', { defaultValue: 'Địa chỉ cụ thể' })}<span>*</span></label>
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
                <label>{t('checkout_form_note', { defaultValue: 'Ghi chú khác' })}</label>
                <textarea 
                  name="note" 
                  rows="12" 
                  style={{ minHeight: '200px' }}
                  placeholder={t('checkout_form_note_placeholder', { defaultValue: 'Điền các thông tin cần ghi chú vào đây' })}
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
                {isSubmitting ? t('checkout_form_submitting', { defaultValue: 'Đang xử lý...' }) : t('checkout_form_submit', { defaultValue: 'Đặt hàng' })}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}