import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckoutForm from '../../components/user/checkout/CheckoutForm';
import CartSummary from '../../components/user/checkout/CartSummary';
import PaymentMethod from '../../components/user/checkout/PaymentMethod';
import { getShippingMethods } from '../../services/shippingService';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { t } = useTranslation();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [userInfo, setUserInfo] = useState({
    userId: Number(localStorage.getItem('userId')) || 1,
    fullName: '',
    phoneNumber: '',
    email: '',
    country: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('checkout_items')) || [];
    setCheckoutItems(items);

    const fetchShipping = async () => {
      try {
        const res = await getShippingMethods();
        setShippingMethods(res.data);
        console.log('Shipping methods:', res.data);
      } catch (err) {
        console.error(t('checkout_shipping_error_log', { defaultValue: 'Lỗi khi lấy phương thức giao hàng:' }), err);
        toast.error(t('checkout_shipping_error', { defaultValue: 'Không thể tải phương thức giao hàng' }));
      }
    };
    fetchShipping();
  }, []);

  useEffect(() => {
    const subtotal = checkoutItems.reduce(
      (sum, item) => sum + ((item.pet?.price || item.product?.price || 0) * (item.quantity || 1)),
      0
    );
    setTotal(subtotal + shippingFee);
  }, [checkoutItems, shippingFee]);

  const handleShippingChange = (method) => {
    setSelectedShipping(method);
    setShippingFee(method.price || 0);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <section className="shop checkout section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <CheckoutForm
              cartItems={checkoutItems}
              totalAmount={total}
              selectedShipping={selectedShipping}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              paymentMethod={paymentMethod}
            />
          </div>
          <div className="col-lg-4 col-12">
            <CartSummary
              items={checkoutItems}
              shippingMethods={shippingMethods}
              selectedShipping={selectedShipping}
              onShippingChange={handleShippingChange}
              total={total}
              setTotal={setTotal}
              shippingFee={shippingFee}
            />
            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}