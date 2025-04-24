import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/user/css/UserHeader.css';

export default function UserHeader() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('full_name');
    const token = localStorage.getItem('token');
    setFullName(name || '');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/auth/login');
  };

  return (
    <header className="header shop">
      {/* Topbar */}
      <div className="topbar">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-12">
              <div className="top-left">
                <ul className="list-main">
                  <li><i className="ti-headphone-alt"></i>0835169543</li>
                  <li><i className="ti-email"></i>petshop@gmail.com</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-12">
              <div className="right-content">
                <div className="list-main-right">
                  <span><i className="ti-location-pin"></i>Linh Xuân, Tp.Thủ Đức</span>
                  <div className="topbar-right">
      {isLoggedIn ? (
        <div className="user-dropdown" ref={dropdownRef}>
          <div className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
  <i className="fa fa-user-circle" style={{ fontSize: '16px' }}></i>
  {fullName && <span className="user-name">{fullName}</span>}
  <i className="fa fa-caret-down caret-icon" style={{ marginLeft: '6px' }}></i>
</div>

          {dropdownOpen && (
            <div className="dropdown-menu show">
              <Link to="/profile" className="dropdown-item">
                <i className="fa fa-user"></i> <span>Trang cá nhân</span>
              </Link>
              <Link to="/auth/change-password" className="dropdown-item">
                <i className="fa fa-lock"></i> <span>Đổi mật khẩu</span>
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                <i className="fa fa-sign-out"></i> <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/auth/login" className="header-icon-label">
          <i className="fa fa-sign-in"></i> Đăng nhập/Đăng ký
        </Link>
      )}
    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <div className="middle-inner">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-2 col-12">
              <div className="logo">
                <Link to="/">
                  <img src="/assets/user/images/logopetshop.jpg" alt="logo" style={{ width: '80px', height: '80px' }} />
                </Link>
              </div>
            </div>
            <div className="col-lg-8 col-md-7 col-12">
              <div className="search-bar-top">
                <div className="search-bar">
                  <span style={{ marginRight: '30px' }}>Tìm kiếm</span>
                  <input name="search" id="timkiem" placeholder="Nhập tên thú cưng....." type="search" />
                  <button className="btnn"><i className="ti-search"></i></button>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-12">
              <div className="right-bar">
                <div className="sinlge-bar">
                  <Link to="/wishlist" className="single-icon"><i className="fa fa-heart-o" aria-hidden="true"></i></Link>
                </div>
                <div className="sinlge-bar">
                  <Link to="/profile" className="single-icon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></Link>
                </div>
                <div className="sinlge-bar shopping">
                  <Link to="/cart" className="single-icon">
                    <i className="ti-bag"></i> <span className="total-count">3</span>
                  </Link>
                  <div className="shopping-item">
                    <div className="dropdown-cart-header">
                      <span>2</span> <Link to="/cart">Giỏ hàng</Link>
                    </div>
                    <ul className="shopping-list">
                      <li>
                        <a className="remove" title="Remove this item"><i className="fa fa-remove"></i></a>
                        <a className="cart-img" href="#"><img src="" alt="#" /></a>
                        <h4><a href="#">Tên sản phẩm</a></h4>
                        <p className="quantity">2 - <span className="amount">3 triệu đồng</span></p>
                      </li>
                    </ul>
                    <div className="bottom">
                      <div className="total">
                        <span>Tổng</span> <span className="total-amount">3 triệu đồng</span>
                      </div>
                      <Link to="/checkout" className="btn animate">Thanh toán</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="header-inner">
        <div className="container">
          <div className="cat-nav-head">
            <div className="row">
              <div className="col-lg-3">
                <div className="all-category">
                  <h3 className="cat-heading">
                    <i className="fa fa-bars" style={{ marginRight: '3px' }}></i>DANH MỤC
                  </h3>
                </div>
              </div>
              <div className="col-lg-9 col-12">
                <div className="menu-area">
                  <nav className="navbar navbar-expand-lg">
                    <div className="navbar-collapse">
                      <div className="nav-inner">
                        <ul className="nav main-menu menu navbar-nav">
                          <li className="active"><Link to="/">Trang chủ</Link></li>
                          <li><Link to="/shop">Thú cưng</Link></li>
                          <li>
                            <a href="#">Shop<i className="ti-angle-down"></i><span className="new">Mới</span></a>
                            <ul className="dropdown">
                              <li><Link to="/shop">Lọc</Link></li>
                              <li><Link to="/cart">Giỏ hàng</Link></li>
                              <li><Link to="/checkout">Thanh toán</Link></li>
                            </ul>
                          </li>
                          <li><Link to="/contact">Liên hệ</Link></li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
