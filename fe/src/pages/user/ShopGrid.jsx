import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopGrid() {
  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bread-inner">
                <ul className="bread-list">
                  <li><Link to="/">Trang chủ<i className="ti-arrow-right"></i></Link></li>
                  <li className="active">Lọc</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-area shop-sidebar shop section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <div className="shop-sidebar">
                <form>
                  <div className="single-widget category">
                    <h3 className="title">Danh mục</h3>
                    <div className="categor-list">
                      <label><input type="radio" name="category" value="all" defaultChecked /> Tất cả</label><br />
                      <label><input type="radio" name="category" value="dogs" /> Chó</label><br />
                      <label><input type="radio" name="category" value="cats" /> Mèo</label><br />
                      <label><input type="radio" name="category" value="others" /> Thú cưng khác</label>
                    </div>
                  </div>

                  <div className="single-widget range">
                    <h3 className="title">Mức giá</h3>
                    <ul className="check-box-list">
                      <li><label><input name="price" type="radio" value="below_2" /> Dưới 2 triệu</label></li>
                      <li><label><input name="price" type="radio" value="2_3_5" /> 2 triệu - 3.5 triệu</label></li>
                      <li><label><input name="price" type="radio" value="above_3_5" /> Hơn 3.5 triệu</label></li>
                      <li><label><input name="price" type="radio" value="" defaultChecked /> Mọi mức giá</label></li>
                    </ul>
                  </div>

                  <div className="single-widget">
                    <h3 className="title">Số lượng sản phẩm</h3>
                    <select name="limit" defaultValue="9">
                      <option value="9">09</option>
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                    </select>
                  </div>

                  <button type="submit" className="btn" style={{ margin: 10 }}>Lọc</button>
                </form>
              </div>
            </div>

            <div className="col-lg-9 col-md-8 col-12">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="single-product">
                    <div className="product-img">
                      <Link to="/pet-detail">
                        <img className="default-img" src="/assets/images/anhdaidienalaska.jpg" alt="pet" />
                        <img className="hover-img" src="/assets/images/anhdaidienalaska.jpg" alt="pet hover" />
                      </Link>
                      <div className="button-head">
                        <div className="product-action">
                          <a title="Quick View" href="#"><i className="ti-eye"></i><span>Xem chi tiết</span></a>
                          <a title="Wishlist" href="#"><i className="ti-heart"></i><span>Thêm vào yêu thích</span></a>
                        </div>
                        <div className="product-action-2">
                          <a title="Add to cart" href="#">Thêm giỏ hàng</a>
                        </div>
                      </div>
                    </div>
                    <div className="product-content">
                      <h3><Link to="/pet-detail">Alaska</Link></h3>
                      <div className="product-price">
                        <span>1 triệu đồng</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Lặp các sản phẩm khác ở đây */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
