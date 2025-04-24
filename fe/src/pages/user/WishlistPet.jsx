import React from 'react';

export default function WishlistPet() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bread-inner">
                <ul className="bread-list">
                  <li><a href="/">Trang chủ<i className="ti-arrow-right"></i></a></li>
                  <li className="active"><a href="/wishlist">Thú cưng yêu thích</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <section className="product-area shop-sidebar shop section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="shop-top">
                <div className="shop-shorter">
                  <div className="single-shorter">
                    <label>Hiển thị :</label>
                    <select>
                      <option selected="selected">09</option>
                      <option>15</option>
                      <option>25</option>
                      <option>30</option>
                    </select>
                  </div>
                  <div className="single-shorter">
                    <label>Sắp xếp theo :</label>
                    <select>
                      <option selected="selected">Tên</option>
                      <option>Giá</option>
                      <option>Kích thước</option>
                    </select>
                  </div>
                </div>
                <ul className="view-mode">
                  <li className="active">
                    <a href="#"><i className="fa fa-th-large"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa fa-th-list"></i></a>
                  </li>
                </ul>
              </div>

              <div className="product-info">
                <div className="tab-single">
                  <div className="row">
                    <div className="col-xl-3 col-lg-4 col-md-4 col-12">
                      <div className="single-product">
                        <div className="product-img">
                          <a href="/product/1">
                            <img className="default-img" src="/assets/images/sample.jpg" alt="Pet" />
                            <img className="hover-img" src="/assets/images/sample.jpg" alt="Pet" />
                            <span className="new">New</span>
                          </a>
                          <div className="button-head">
                            <div className="product-action">
                              <a href="#" title="Xem chi tiết"><i className="ti-eye"></i><span>Xem chi tiết</span></a>
                              <a href="#" title="Xoá khỏi yêu thích"><i className="ti-trash"></i></a>
                            </div>
                            <div className="product-action-2">
                              <a href="#" title="Thêm vào giỏ hàng">Thêm vào giỏ hàng</a>
                            </div>
                          </div>
                        </div>
                        <div className="product-content">
                          <h3><a href="/product/1">Tên thú cưng</a></h3>
                          <div className="product-price">
                            <span>1 triệu đồng</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Add more product cards here if needed */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
