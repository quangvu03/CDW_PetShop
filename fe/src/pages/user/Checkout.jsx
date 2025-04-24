// 📁 src/pages/user/Checkout.jsx
import React from 'react';
import CheckoutForm from '../../components/user/checkout/CheckoutForm';
import CartSummary from '../../components/user/checkout/CartSummary';
import PaymentMethod from '../../components/user/checkout/PaymentMethod';

export default function Checkout() {
  return (
    <section className="shop checkout section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <CheckoutForm />
          </div>
          <div className="col-lg-4 col-12">
            <CartSummary />
            <PaymentMethod />
          </div>
        </div>
      </div>
    </section>
  );
}