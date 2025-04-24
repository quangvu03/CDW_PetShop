import React from 'react';

export default function HeroSlider() {
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
                      <h1><span>GIẢM TỚI 50% </span>Chó Alaska</h1>
                      <p>Một trong những loài được yêu thích nhất <br />Có lông rậm, kích thước to lớn <br />và mạnh mẽ.</p>
                      <div className="button">
                        <a href="#" className="btn">Mua ngay!</a>
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
