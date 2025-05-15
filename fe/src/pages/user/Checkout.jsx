// ✅ src/pages/user/Checkout.jsx
import React, { useEffect, useState } from 'react';
import CheckoutForm from '../../components/user/checkout/CheckoutForm';
import CartSummary from '../../components/user/checkout/CartSummary';
import PaymentMethod from '../../components/user/checkout/PaymentMethod';
import { getShippingMethods } from '../../services/shippingService';

export default function Checkout() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('checkout_items')) || [];
    setCheckoutItems(items);

    const fetchShipping = async () => {
      try {
        const res = await getShippingMethods();
        setShippingMethods(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy phương thức giao hàng', err);
      }
    };
    fetchShipping();
  }, []);

  useEffect(() => {
    const subtotal = checkoutItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    setTotal(subtotal + shippingFee);
  }, [checkoutItems, shippingFee]);

  const handleShippingChange = (method) => {
    setSelectedShipping(method);
    setShippingFee(method.price || 0);
  };

  return (
    <section className="shop checkout section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <CheckoutForm />
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
            <PaymentMethod />
          </div>
        </div>
      </div>
    </section>
  );
}
