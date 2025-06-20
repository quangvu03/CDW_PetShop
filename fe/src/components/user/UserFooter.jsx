import React from 'react';
import { useTranslation } from 'react-i18next';

export default function UserFooter() {
  const { t } = useTranslation();

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
                <p className="text">{t('footer_slogan', { defaultValue: 'Đó là protein, không phải cuộc đua...' })}</p>
                <p className="call">{t('footer_call_us', { defaultValue: 'Thắc mắc? Gọi cho chúng tôi 24/7' })} <span><a href="tel:123456789">{t('footer_phone', { defaultValue: '0835169543' })}</a></span></p>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-12">
              <div className="single-footer links">
                <h4>{t('footer_info_title', { defaultValue: 'Thông tin' })}</h4>
                <ul>
                  <li><a href="#">{t('footer_about_us', { defaultValue: 'Về chúng tôi' })}</a></li>
                  <li><a href="#">{t('footer_faq', { defaultValue: 'Câu hỏi' })}</a></li>
                  <li><a href="#">{t('footer_terms', { defaultValue: 'Điều khoản & điều kiện' })}</a></li>
                  <li><a href="#">{t('footer_contact', { defaultValue: 'Liên hệ' })}</a></li>
                  <li><a href="#">{t('footer_help', { defaultValue: 'Giúp đỡ' })}</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-12">
              <div className="single-footer links">
                <h4>{t('footer_customer_service_title', { defaultValue: 'Dịch vụ khách hàng' })}</h4>
                <ul>
                  <li><a href="#">{t('footer_payment_methods', { defaultValue: 'Phương thức thanh toán' })}</a></li>
                  <li><a href="#">{t('footer_refund', { defaultValue: 'Hoàn tiền' })}</a></li>
                  <li><a href="#">{t('footer_return', { defaultValue: 'Trả hàng' })}</a></li>
                  <li><a href="#">{t('footer_shipping', { defaultValue: 'Giao hàng' })}</a></li>
                  <li><a href="#">{t('footer_privacy', { defaultValue: 'Chính sách bảo mật' })}</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-footer social">
                <h4>{t('footer_contact_title', { defaultValue: 'Liên lạc' })}</h4>
                <div className="contact">
                  <ul>
                    <li>{t('footer_address_1', { defaultValue: 'Chung cư HT Pearl' })}</li>
                    <li>{t('footer_address_2', { defaultValue: 'Linh Xuân, Tp.Thủ Đức' })}</li>
                    <li>{t('footer_email', { defaultValue: 'petshop@gmail.com' })}</li>
                    <li>{t('footer_phone', { defaultValue: '0835169543' })}</li>
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
                  <p>{t('footer_copyright', { defaultValue: 'Copyright © 2020 PetShop - All Rights Reserved.' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}