import React from 'react';

export default function PaymentMethod() {
  return (
    <div className="single-widget">
        <h2>Phương thức thanh toán</h2>
        <div className="content" style={{ margin: '10px 30px' }}>
          <label>
            <input type="radio" name="payment" value="cod" defaultChecked /> Thanh toán khi nhận hàng
          </label>
          <br />
          <label>
            <input type="radio" name="payment" value="vnpay" /> Thanh toán VNPay (Sau khi đặt hàng)
          </label>
        </div>
        <div className="get-button">
        <div className="content" style={{ margin: '10px 100px' }}>
          <div className="button">
            <button className="btn" type="submit">Đặt hàng</button>
          </div>
        </div>
      </div>
      </div>
  );
}
