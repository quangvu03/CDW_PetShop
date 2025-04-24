import React from 'react';

export default function PaymentMethod() {
  return (
    <div className="single-widget">
      <h2>Phương thức thanh toán</h2>
      <div className="content" style={{ margin: '10px 25px' }}>
        <div className="radio">
          <input type="radio" id="paymentMethod2" name="payment_method" value="1" />
          <label htmlFor="paymentMethod2">Thanh toán khi nhận hàng</label>
          <br />
          <input type="radio" id="paymentMethod3" name="payment_method" value="2" />
          <label htmlFor="paymentMethod3">Thanh toán VNPay (Sau khi đặt hàng)</label>
        </div>
      </div>
      <div className="get-button">
        <div className="content">
          <div className="button">
            <button className="btn" type="submit">Đặt hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}