import React from 'react';

export default function CheckoutForm() {
  return (
    <div className="col-lg-8 col-12">
      <div className="checkout-form">
        <h2>Thanh toán của bạn</h2>
        <p>Vui lòng điền thông tin</p>
        <form className="form">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Họ và tên<span>*</span></label>
                <input type="text" name="fullName" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Số điện thoại<span>*</span></label>
                <input type="tel" name="phoneNumber" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Email<span>*</span></label>
                <input type="email" name="email" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Tỉnh/Thành Phố<span>*</span></label>
                <select name="country_checkout">
                  <option value="">Chọn tỉnh/thành</option>
                </select>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Quận/Huyện<span>*</span></label>
                <select name="district_checkout">
                  <option value="">Chọn quận/huyện</option>
                </select>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label>Xã/Phường<span>*</span></label>
                <select name="ward_checkout">
                  <option value="">Chọn xã/phường</option>
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Địa chỉ cụ thể<span>*</span></label>
                <input type="text" name="address_checkout" required />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Ghi chú khác(*)</label>
                <textarea name="note" rows="5" placeholder="Điền các thông tin cần ghi chú vào đây"></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
