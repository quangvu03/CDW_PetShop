  import { useTranslation } from 'react-i18next';

export default function BannerSection() {
  const { t } = useTranslation();

  return (
    <section className="small-banner section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="single-banner">
              <img src="/assets/user/images/anhdaidienalaska.jpg" alt={t('banner_dog_list', { defaultValue: 'Chó Alaska' })} />
              <div className="content">
                <p>{t('banner_dog_list', { defaultValue: 'Danh sách chó' })}</p>
                <h3>
                  {t('banner_most_viewed', { defaultValue: 'Được xem' })}
                  <br />
                  {t('banner_most_viewed', { defaultValue: 'nhiều nhất' })}
                </h3>
                <a href="#">{t('banner_discover', { defaultValue: 'Khám phá ngay' })}</a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="single-banner">
              <img src="/assets/user/images/anhdaidienmeo.jpg" alt={t('banner_pet_category', { defaultValue: 'Mèo' })} />
              <div className="content">
                <p>{t('banner_pet_category', { defaultValue: 'Danh mục thú cưng' })}</p>
                <h3>
                  {t('banner_latest_2023', { defaultValue: 'Mới nhất' })}
                  <br />
                  2023
                </h3>
                <a href="#">{t('banner_discover', { defaultValue: 'Khám phá ngay' })}</a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="single-banner tab-height">
              <img src="/assets/user/images/anhdaidienchim.jpg" alt={t('banner_sale', { defaultValue: 'Chim' })} />
              <div className="content">
                <p>{t('banner_sale', { defaultValue: 'Giảm thần tốc' })}</p>
                <h3>
                  {t('banner_summer_sale', { defaultValue: 'Mùa hè' })}
                  <br />
                  {t('banner_up_to', { defaultValue: 'Giảm tới <span>40%</span>' })}
                </h3>
                <a href="#">{t('banner_discover', { defaultValue: 'Khám phá ngay' })}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}