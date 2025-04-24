import React from 'react';

export default function SearchResults() {
  return (
    <div className="shopping-cart section">
      <div className="container">
        <div className="breadcrumbs">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="bread-inner">
                  <ul className="bread-list">
                    <li><a href="/">Trang chủ<i className="ti-arrow-right"></i></a></li>
                    <li className="active"><a href="#">Tìm kiếm</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content__product">
          <div className="content__main__product">
            <div className="content__product-detail">
              <div className="content__product-image">
                <img className="product-image" src="/assets/images/sample.jpg" alt="Tên thú cưng" />
              </div>
              <div className="content__product-description">
                <div className="product-name">Chó Alaska</div>
                <div className="product-discount">Giá: 3 triệu đồng</div>
                <div className="product_info">
                  Kích thước: <span className="product-by">Lớn</span>
                  <div className="product-stock">Xuất xứ: Việt Nam</div>
                  <div className="product-quantity">Số lượng: 5</div>
                  <div className="product-date">Ngày sinh: 08-12-2022</div>
                </div>
              </div>
              <div className="content__product-action">
                <div className="product-wishlist-head">
                  <a href="#"><i className="fas fa-heart"></i> Thêm vào yêu thích</a>
                </div>
                <div className="product-add-cart">
                  <a href="#"><i className="fas fa-archive"></i> Thêm vào giỏ hàng</a>
                </div>
              </div>
            </div>

            {/* Add more products here */}
          </div>
        </div>
      </div>
    </div>
  );
}
