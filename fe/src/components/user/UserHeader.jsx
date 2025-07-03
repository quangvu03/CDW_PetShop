import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { getCartByUser } from '../../services/cartService';
import { findPetByName } from '../../services/petService';
import '../../assets/user/css/UserHeader.css';

export default function UserHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language); // Theo dõi ngôn ngữ hiện tại

  // Danh sách ngôn ngữ
  const languageOptions = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' },
  ];

  const totalTypes = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.pet?.price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const getImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    return path.startsWith('http') ? path : `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Đồng bộ ngôn ngữ từ localStorage và theo dõi thay đổi
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    console.log('Initial check - Saved language from localStorage:', savedLanguage, 'Current i18n.language:', i18n.language);
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('Attempting to change language to:', savedLanguage);
      i18n.changeLanguage(savedLanguage).then(() => {
        console.log('Language changed successfully to:', i18n.language);
        setCurrentLanguage(i18n.language);
      }).catch((err) => {
        console.error('Failed to change language on init:', err);
      });
    }

    const handleLanguageChange = (lng) => {
      console.log('Global language changed event triggered, new language:', lng);
      setCurrentLanguage(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/user/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
      setSearchQuery('');
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

  // Handle language change
  const handleLanguageChange = (selectedOption) => {
    const selectedLanguage = selectedOption.value;
    console.log('User selected language:', selectedLanguage, 'Current i18n.language before change:', i18n.language);
    i18n.changeLanguage(selectedLanguage).then(() => {
      console.log('Language changed successfully to:', i18n.language, 'Current localStorage:', localStorage.getItem('i18nextLng'));
      localStorage.setItem('i18nextLng', selectedLanguage);
      setCurrentLanguage(i18n.language);
    }).catch((err) => {
      console.error('Failed to change language:', err);
    });
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
                  <span><i className="ti-location-pin"></i>{t('location', { defaultValue: 'Linh Xuân, Tp.Thủ Đức' })}</span>
                  <div className="topbar-right">
                    {/* React-Select cho ngôn ngữ */}
                    <Select
                      id="language-select"
                      className="language-select"
                      classNamePrefix="react-select"
                      options={languageOptions}
                      value={languageOptions.find((option) => option.value === currentLanguage || option.value === i18n.language)}
                      onChange={handleLanguageChange}
                      isSearchable={false}
                      aria-label={t('change_language', { defaultValue: 'Change Language' })}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '20px',
                          border: '1px solid #ddd',
                          padding: '2px 8px',
                          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          minWidth: '120px',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '8px',
                          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                          fontSize: '14px',
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#e6f0ff' : state.isFocused ? '#f0f2f5' : 'white',
                          color: '#333',
                          padding: '8px 12px',
                          cursor: 'pointer',
                        }),
                        // ✅ Thêm đoạn này để ẩn separator
                        indicatorSeparator: () => ({
                          display: 'none',
                        }),
                      }}
                    />

                    {isLoggedIn ? (
                      <div className="user-dropdown" ref={dropdownRef}>
                        <div
                          className="dropdown-toggle"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          <i className="fa fa-user-circle" style={{ fontSize: '16px' }}></i>
                          {fullName && <span className="user-name">{fullName}</span>}
                          <i className="fa fa-caret-down caret-icon" style={{ marginLeft: '6px' }}></i>
                        </div>
                        {dropdownOpen && (
                          <div className="dropdown-menu show">
                            <Link to="/user/profile" className="dropdown-item">
                              <i className="fa fa-user"></i> <span>{t('profile', { defaultValue: 'Trang cá nhân' })}</span>
                            </Link>
                            <Link to="/user/order-history" className="dropdown-item">
                              <i className="fa fa-shopping-bag"></i> <span>{t('order_history', { defaultValue: 'Xem đơn hàng' })}</span>
                            </Link>
                            <Link to="/auth/change-password" className="dropdown-item">
                              <i className="fa fa-lock"></i> <span>{t('change_password', { defaultValue: 'Đổi mật khẩu' })}</span>
                            </Link>
                            <button onClick={handleLogout} className="dropdown-item logout-btn">
                              <i className="fa fa-sign-out"></i> <span>{t('logout', { defaultValue: 'Đăng xuất' })}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link to="/auth/login" className="header-icon-label">
                        <i className="fa fa-sign-in"></i> {t('login_register', { defaultValue: 'Đăng nhập/Đăng ký' })}
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
                  <span style={{ marginRight: '30px' }}>{t('search', { defaultValue: 'Tìm kiếm' })}</span>
                  <input
                    name="search"
                    id="timkiem"
                    placeholder={t('search_placeholder', { defaultValue: 'Nhập tên thú cưng...' })}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                          to={`/user/pet/${pet.id}`}
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => setSearchResults([])}
                        >
                          <img
                            src={getImageUrl(pet.imageUrl)}
                            alt={pet.name || t('unknown', { defaultValue: 'Không rõ' })}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <div>
                            <div>{pet.name || t('unknown', { defaultValue: 'Không rõ' })}</div>
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
                  <Link to="/user/wishlist" className="single-icon"><i className="fa fa-heart-o" aria-hidden="true"></i></Link>
                </div>
                <div className="sinlge-bar">
                  <Link to="/user/profile" className="single-icon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></Link>
                </div>
                <div className="sinlge-bar shopping">
                  <Link to="/user/cart" className="single-icon">
                    <i className="ti-bag"></i> {totalTypes > 0 && <span className="total-count">{totalTypes}</span>}
                  </Link>
                  <div className="shopping-item">
                    <div className="dropdown-cart-header">
                      <span>{totalTypes}</span> <Link to="/user/cart">{t('cart', { defaultValue: 'Giỏ hàng' })}</Link>
                    </div>
                    <ul className="shopping-list">
                      {cartItems.length === 0 ? (
                        <li className="text-center">{t('empty_cart', { defaultValue: 'Giỏ hàng trống' })}</li>
                      ) : (
                        cartItems.map((item) => (
                          <li key={item.id}>
                            <Link to="/user/cart" className="cart-img">
                              <img
                                src={getImageUrl(item.pet?.imageUrl || item.product?.imageUrl)}
                                alt={item.pet?.name || item.product?.name || t('unknown', { defaultValue: 'Không rõ' })}
                                style={{ width: 80, height: 50, objectFit: 'cover' }}
                              />
                            </Link>
                            <h4>
                              <Link to="/user/cart">{item.pet?.name || item.product?.name || t('unknown', { defaultValue: 'Không rõ' })}</Link>
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
                        <span>{t('total', { defaultValue: 'Tổng' })}</span>
                        <span className="total-amount">{totalPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <Link to="/user/checkout" className="btn animate">{t('checkout', { defaultValue: 'Thanh toán' })}</Link>
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
                    <i className="fa fa-bars" style={{ marginRight: '3px' }}></i>{t('categories', { defaultValue: 'DANH MỤC' })}
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
                            <Link to="/">{t('home', { defaultValue: 'Trang chủ' })}</Link>
                          </li>
                          <li>
                            <Link to="/user/shop">{t('pets', { defaultValue: 'Thú cưng' })}</Link>
                          </li>
                          <li>
                            <a href="#">
                              {t('shop', { defaultValue: 'Shop' })}<i className="ti-angle-down"></i>
                              <span className="new">{t('new', { defaultValue: 'Mới' })}</span>
                            </a>
                            <ul className="dropdown">
                              <li><Link to="/user/shop">{t('filter', { defaultValue: 'Lọc' })}</Link></li>
                              <li><Link to="/user/cart">{t('cart', { defaultValue: 'Giỏ hàng' })}</Link></li>
                              <li><Link to="/user/checkout">{t('checkout', { defaultValue: 'Thanh toán' })}</Link></li>
                            </ul>
                          </li>
                          <li>
                            <Link to="/user/contact">{t('contact', { defaultValue: 'Liên hệ' })}</Link>
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