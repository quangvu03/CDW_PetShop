import React from 'react';

export default function UserFooter() {
  return (
    <footer className="footer">
      <div className="footer-top section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-6 col-12">
              <div className="single-footer about">
                <div className="logo">
                  <a href="/"><img src="/assets/images/logopetshop.jpg" alt="#" /></a>
                </div>
                <p className="text">Đó là protein, không phải cuộc đua...</p>
                <p className="call">Thắc mắc? Gọi cho chúng tôi 24/7 <span><a href="tel:123456789">0835169543</a></span></p>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-12">
              <div className="single-footer links">
                <h4>Thông tin</h4>
                <ul>
                  <li><a href="#">Về chúng tôi</a></li>
                  <li><a href="#">Câu hỏi</a></li>
                  <li><a href="#">Điều khoản & điều kiện</a></li>
                  <li><a href="#">Liên hệ</a></li>
                  <li><a href="#">Giúp đỡ</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-12">
              <div className="single-footer links">
                <h4>Dịch vụ khách hàng</h4>
                <ul>
                  <li><a href="#">Phương thức thanh toán</a></li>
                  <li><a href="#">Hoàn tiền</a></li>
                  <li><a href="#">Trả hàng</a></li>
                  <li><a href="#">Giao hàng</a></li>
                  <li><a href="#">Chính sách bảo mật</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer social">
                <h4>Liên lạc</h4>
                <div className="contact">
                  <ul>
                    <li>Chung cư HT Pearl</li>
                    <li>Linh Xuân, Tp.Thủ Đức</li>
                    <li>petshop@gmail.com</li>
                    <li>0835169543</li>
                  </ul>
                </div>
                <ul>
                  <li><a href="https://www.facebook.com/truong.lechi.902/"><i className="ti-facebook"></i></a></li>
                  <li><a href="https://www.tiktok.com/@lechitruong23211"><i className="ti-twitter"></i></a></li>
                  <li><a href="#"><i className="ti-flickr"></i></a></li>
                  <li><a href="https://www.instagram.com/emg_dniw/"><i className="ti-instagram"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="left">
                  <p>Copyright © 2020 PetShop - All Rights Reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}