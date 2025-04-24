import React from 'react';

export default function Cart() {
  return (
    <div className="shopping-cart section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <table className="table shopping-summery">
              <thead>
                <tr className="main-hading">
                  <th>Thú cưng</th>
                  <th>Tên</th>
                  <th className="text-center">Giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Tổng</th>
                  <th className="text-center">
                    <i className="ti-trash remove-icon"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="image">
                    <img src="/assets/user/images/logopetshop.jpg" alt="#" />
                  </td>
                  <td className="product-des">
                    <p className="product-name">
                      <a href="#">Chihuahua</a>
                    </p>
                    <p className="product-des">Thú cưng mini, dễ thương</p>
                  </td>
                  <td className="price text-center">
                    <span>1 triệu đồng</span>
                  </td>
                  <td className="qty text-center">
                    <div className="input-group justify-content-center">
                      <button className="btn btn-sm btn-minus">
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="quantity">3</span>
                      <button className="btn btn-sm btn-plus">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td className="total-amount text-center">
                    <span>3 triệu đồng</span>
                  </td>
                  <td className="action text-center">
                    <a href="#">
                      <i className="ti-trash remove-icon"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="total-amount">
              <div className="row">
                <div className="col-lg-8 col-md-5 col-12">
                  <div className="left"></div>
                </div>
                <div className="col-lg-4 col-md-7 col-12">
                  <div className="right">
                    <ul>
                      <li>
                        Tổng giỏ hàng<span>1 triệu đồng</span>
                      </li>
                      <li className="last">
                        Tổng<span>1 triệu đồng</span>
                      </li>
                    </ul>
                    <div className="button5">
                      <a href="#" className="btn btn-success">
                        Thanh toán
                      </a>
                      <a href="#" className="btn btn-success">
                        Tiếp tục mua hàng
                      </a>
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
