import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../services/userService';
import { createOrder } from '../../../services/orderService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm({ cartItems = [], totalAmount = 0, selectedShipping = null }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    country: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        if (userData) {
          // Split address into parts
          let addressParts = [];
          if (userData.address) {
            addressParts = userData.address.split(',').map(part => part.trim());
          }
          
          const country = addressParts[3] || '';
          const district = addressParts[2] || '';
          const ward = addressParts[1] || '';
          const address = addressParts[0] || '';

          // Find and set the selected province
          const selectedProvince = provinces.find(p => p.name === country);
          if (selectedProvince) {
            setDistricts(selectedProvince.districts);
          }

          // Find and set the selected district
          if (selectedProvince) {
            const selectedDistrict = selectedProvince.districts.find(d => d.name === district);
            if (selectedDistrict) {
              setWards(selectedDistrict.wards);
            }
          }
          
          setFormData(prev => ({
            ...prev,
            fullName: userData.fullName || '',
            phoneNumber: userData.phone || '',
            email: userData.email || '',
            country: country,
            district: district,
            ward: ward,
            address: address
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [provinces]); // Add provinces as dependency since we need it for finding districts and wards

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  // Update districts when country changes
  useEffect(() => {
    const selectedProvince = provinces.find(p => p.name === formData.country);
    setDistricts(selectedProvince ? selectedProvince.districts : []);
    if (!selectedProvince) {
      setFormData(prev => ({ ...prev, district: '', ward: '' }));
    }
  }, [formData.country, provinces]);

  // Update wards when district changes
  useEffect(() => {
    const selectedDistrict = districts.find(d => d.name === formData.district);
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    if (!selectedDistrict) {
      setFormData(prev => ({ ...prev, ward: '' }));
    }
  }, [formData.district, districts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phoneNumber || !formData.email || 
        !formData.country || !formData.district || !formData.ward || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    // Validate shipping method
    if (!selectedShipping) {
      toast.error('Vui lòng chọn phương thức giao hàng');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Tính tổng giá trị các item (lấy đúng giá từ pet hoặc product)
      const totalItemPrice = cartItems.reduce(
        (sum, item) =>
          sum + ((item.pet?.price || item.product?.price || 0) * (item.quantity || 1)),
        0
      );
      // Lấy phí shipping (nếu có)
      const shippingFee = selectedShipping?.price ? Number(selectedShipping.price) : 0;
      // Tạo orderRequest đúng với backend, mỗi item chỉ có 1 trong 2 trường productId hoặc petId có giá trị, trường còn lại là 0
      const orderRequest = {
        userId: Number(localStorage.getItem('userId')),
        totalPrice: totalItemPrice + shippingFee, // Tổng giá trị đơn hàng + phí ship
        paymentMethod: selectedShipping?.paymentMethod || 'COD',
        paymentStatus: 'PENDING',
        shippingAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.country}`,
        shippingMethodId: selectedShipping?.id || 1,
        orderRequestList: cartItems.map(item => ({
          // Nếu là sản phẩm, productId có giá trị, petId = 0
          // Nếu là thú cưng, petId có giá trị, productId = 0
          productId: item.product?.id ? Number(item.product.id) : 0,
          petId: item.pet?.id ? Number(item.pet.id) : 0,
          quantity: item.quantity ? Number(item.quantity) : 1,
          price: item.pet?.price || item.product?.price || 0 // Lưu giá tại thời điểm đặt hàng
        }))
      };
      console.log('orderRequest gửi lên:', orderRequest);

      // Call API to create order
      const response = await createOrder(orderRequest);
      
      if (response.data.success) {
        // Show success message
        toast.success('Đặt hàng thành công!');
        
        // Clear cart
        localStorage.removeItem('checkout_items');
        
        // Dispatch event to update cart in header
        window.dispatchEvent(new Event('cart-updated'));
        
        // Redirect to order history
        navigate('/order-history');
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi đặt hàng');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
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
                  value={formData.fullName}
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
                  className="form-control" 
                  name="phoneNumber" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Email<span>*</span></label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Tỉnh/Thành Phố<span>*</span></label>
                <select 
                  name="country" 
                  className="form-control"
                  value={formData.country}
                  onChange={handleChange}
                  required
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
                  className="form-control"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  disabled={!formData.country}
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
                  className="form-control"
                  value={formData.ward}
                  onChange={handleChange}
                  required
                  disabled={!formData.district}
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
                  className="form-control" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Ghi chú khác</label>
                <textarea 
                  name="note" 
                  rows="12" 
                  className="form-control"
                  style={{ minHeight: '200px' }}
                  placeholder="Điền các thông tin cần ghi chú vào đây"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="col-12">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !cartItems?.length}
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
