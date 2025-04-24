import React from 'react';

export default function CartSummary() {
  return (
    <div className="order-details">
      <div className="single-widget">
        <h2>Tổng giỏ hàng</h2>
        <div className="content">
          <ul>
            <li>Tổng hàng<span id="totalAmount">3</span> (triệu đồng)</li>
            <li>(+) Giao hàng<span id="shippingFee">0.1</span> (triệu đồng)</li>
            <li className="last">Tổng<span className="finalAmount">3.1</span> (triệu đồng)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
