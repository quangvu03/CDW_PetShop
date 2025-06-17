// src/components/user/checkout/PaymentMethod.jsx
import React from 'react';

export default function PaymentMethod({ selectedMethod, onMethodChange }) {
  return (
    <div className="single-widget">
      <h2>Phương thức thanh toán</h2>
      <div className="content" style={{ margin: '10px 30px' }}>
        <label>
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={() => onMethodChange('COD')}
          />
          Thanh toán khi nhận hàng (COD)
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="payment"
            value="PAYOS"
            checked={selectedMethod === 'PAYOS'}
            onChange={() => onMethodChange('PAYOS')}
          />
          Thanh toán qua PayOS
        </label>
      </div>
    </div>
  );
}