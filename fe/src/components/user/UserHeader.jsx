import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartByUser } from '../../services/cartService';
import { findPetByName } from '../../services/petService';
import '../../assets/user/css/UserHeader.css';

export default function UserHeader() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const totalTypes = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.pet?.price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const getImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    return path.startsWith('http') ? path : `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const name = localStorage.getItem('full_name');
    const token = localStorage.getItem('token');
    setFullName(name || '');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartByUser();
        setCartItems(data || []);
      } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng ở header:', err);
      }
    };

    if (isLoggedIn) {
      fetchCart();
      const handleCartUpdate = () => fetchCart();
      window.addEventListener('cart-updated', handleCartUpdate);
      return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        findPetByName(searchQuery)
          .then((response) => {
            setSearchResults(response.data || []);
          })
          .catch((error) => {
            console.error('Lỗi khi tìm kiếm thú cưng:', error);
            setSearchResults([]);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle search submission (Enter or button click)
  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]); // Clear dropdown results
      setSearchQuery(''); // Clear input
    }
  };

  // Handle Enter keypress
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

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
                            <Link to="/order-history" className="dropdown-item">
                              <i className="fa fa-shopping-bag"></i> <span>Xem đơn hàng</span>
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
                <div className="search-bar position-relative" ref={searchBarRef}>
                  <span style={{ marginRight: '30px' }}>Tìm kiếm</span>
                  <input
                    name="search"
                    id="timkiem"
                    placeholder="Nhập tên thú cưng....."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress} // Handle Enter key
                  />
                  <button className="btnn" onClick={handleSearchSubmit}>
                    <i className="ti-search"></i>
                  </button>
                  {searchResults.length > 0 && (
                    <div
                      className="dropdown-menu show w-100 mt-1"
                      style={{ position: 'absolute', zIndex: 1000, left: '50%', transform: 'translateX(-50%)' }}
                    >
                      {searchResults.slice(0, 5).map((pet) => (
                        <Link
                          key={pet.id}
                          to={`/pet/${pet.id}`}
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => setSearchResults([])}
                        >
                          <img
                            src={getImageUrl(pet.imageUrl)}
                            alt={pet.name || 'Không rõ'}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <div>
                            <div>{pet.name || 'Không rõ'}</div>
                            <div className="text-muted">{(pet.price || 0).toLocaleString('vi-VN')}₫</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-12">
              <div className="right-bar">
                <div className="sinlge-bar">
                  <Link to="/wishlist" className="single-icon">
                    <i className="fa fa-heart-o" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="sinlge-bar">
                  <Link to="/profile" className="single-icon">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="sinlge-bar shopping">
                  <Link to="/cart" className="single-icon">
                    <i className="ti-bag"></i> {totalTypes > 0 && <span className="total-count">{totalTypes}</span>}
                  </Link>
                  <div className="shopping-item">
                    <div className="dropdown-cart-header">
                      <span>{totalTypes}</span> <Link to="/cart">Giỏ hàng</Link>
                    </div>
                    <ul className="shopping-list">
                      {cartItems.length === 0 ? (
                        <li className="text-center">Giỏ hàng trống</li>
                      ) : (
                        cartItems.map((item) => (
                          <li key={item.id}>
                            <Link to="/cart" className="cart-img">
                              <img
                                src={getImageUrl(item.pet?.imageUrl || item.product?.imageUrl)}
                                alt={item.pet?.name || item.product?.name || 'Không rõ'}
                                style={{ width: 80, height: 50, objectFit: 'cover' }}
                              />
                            </Link>
                            <h4>
                              <Link to="/cart">{item.pet?.name || item.product?.name || 'Không rõ'}</Link>
                            </h4>
                            <p className="quantity">
                              {item.quantity} ×{' '}
                              <span className="total-amount">
                                {(item.pet?.price || item.product?.price || 0).toLocaleString('vi-VN')}₫
                              </span>
                            </p>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="bottom">
                      <div className="total">
                        <span>Tổng</span> <span className="total-amount">{totalPrice.toLocaleString('vi-VN')}₫</span>
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
                          <li className="active">
                            <Link to="/">Trang chủ</Link>
                          </li>
                          <li>
                            <Link to="/shop">Thú cưng</Link>
                          </li>
                          <li>
                            <a href="#">
                              Shop<i className="ti-angle-down"></i>
                              <span className="new">Mới</span>
                            </a>
                            <ul className="dropdown">
                              <li>
                                <Link to="/shop">Lọc</Link>
                              </li>
                              <li>
                                <Link to="/cart">Giỏ hàng</Link>
                              </li>
                              <li>
                                <Link to="/checkout">Thanh toán</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="/contact">Liên hệ</Link>
                          </li>
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