import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HeroSlider() {
  const { t, i18n } = useTranslation();


  return (
    <section className="hero-slider">
      <div className="single-slider">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-lg-9 offset-lg-3 col-12">
              <div className="text-inner">
                <div className="row">
                  <div className="col-lg-7 col-12">
                    <div className="hero-text">
                      <h1>
                        <span style={{color: '#fff'}}>{t('hero_discount', { defaultValue: 'GIẢM TỚI 50%' })}</span>{' '}
                        {t('hero_alaska', { defaultValue: 'Chó Alaska' })}
                      </h1>
                      <p style={{ fontSize: '18px', lineHeight: '1.6',color: '#fff' }}>
                        {t('hero_description', { defaultValue: 'Một trong những loài được yêu thích nhất Có lông rậm, kích thước to lớn và mạnh mẽ.' })}
                      </p>
                      <div className="button">
                        <a href="#" className="btn">{t('hero_buy_now', { defaultValue: 'Mua ngay!' })}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}