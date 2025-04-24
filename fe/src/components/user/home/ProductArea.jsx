import React from 'react';

export default function ProductArea() {
  return (
    <div className="product-area section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h2>Thú cưng hot</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="product-info">
              <div className="nav-main">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <button className="filterByCategory">Chó</button>
                    <button className="filterByCategory">Mèo</button>
                  </li>
                </ul>
              </div>
              <div id="product-container" className="row">
                <div className="col-xl-3 col-lg-4 col-md-4 col-12">
                  <div className="single-product">
                    <div className="product-img">
                      <a href="#">
                        <img className="default-img" src="/assets/user/images/anhdaidienmeo.jpg" alt="" />
                        <img className="hover-img" src="/assets/user/images/anhdaidienmeo.jpg" alt="" />
                      </a>
                      <div className="button-head">
                        <div className="product-action">
                          <a data-toggle="modal" title="Quick View" href="#">
                            <i className="ti-eye"></i><span>Xem chi tiết</span>
                          </a>
                          <a title="Wishlist" href="#">
                            <i className="ti-heart"></i><span>Thêm vào yêu thích</span>
                          </a>
                        </div>
                        <div className="product-action-2">
                          <a title="Add to cart" href="#">Thêm vào giỏ hàng</a>
                        </div>
                      </div>
                    </div>
                    <div className="product-content">
                      <h3><a href="#">Tên sản phẩm</a></h3>
                      <div className="product-price">
                        <span>3 triệu đồng</span>
                      </div>
                    </div>
                  </div>
                </div>    
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
