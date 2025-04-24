import React from 'react';

export default function BannerSection() {
  return (
    <section className="small-banner section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="single-banner">
              <img src="/assets/user/images/anhdaidienalaska.jpg" alt="Chó Alaska" />
              <div className="content">
                <p>Danh sách chó</p>
                <h3>Được xem<br />nhiều nhất</h3>
                <a href="#">Khám phá ngay</a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="single-banner">
              <img src="/assets/user/images/anhdaidienmeo.jpg" alt="Mèo" />
              <div className="content">
                <p>Danh mục thú cưng</p>
                <h3>Mới nhất<br />2023</h3>
                <a href="#">Khám phá ngay</a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="single-banner tab-height">
              <img src="/assets/user/images/anhdaidienchim.jpg" alt="Chim" />
              <div className="content">
                <p>Giảm thần tốc</p>
                <h3>Mùa hè<br />Giảm tới <span>40%</span></h3>
                <a href="#">Khám phá ngay</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
