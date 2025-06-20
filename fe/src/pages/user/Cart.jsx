import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/user/css/User.css';
import {
  getCartByUser,
  updateCartItemQuantity,
  removeItemFromCart
} from '../../services/cartService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
    localStorage.setItem('checkout_items', JSON.stringify(cartItems));
    navigate('/user/checkout');
  };

  const getFullImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const fetchCart = async () => {
    try {
      const data = await getCartByUser();
      setCartItems(data);
    } catch (err) {
      toast.error(t('cart_fetch_error', { defaultValue: 'Lỗi khi lấy giỏ hàng' }));
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      await updateCartItemQuantity(itemId, newQty);
      window.dispatchEvent(new Event('cart-updated'));
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      toast.error(t('cart_update_quantity_error', { defaultValue: 'Cập nhật số lượng thất bại' }));
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItemFromCart({
        petId: item.pet?.id,
        productId: item.product?.id
      });
      toast.success(t('cart_remove_success', { defaultValue: 'Xoá sản phẩm khỏi giỏ hàng thành công' }));
      window.dispatchEvent(new Event('cart-updated'));
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      toast.error(t('cart_remove_error', { defaultValue: 'Xoá khỏi giỏ thất bại' }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.pet?.price || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <div className="shopping-cart section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {cartItems.length === 0 ? (
              <p className="text-center py-5">{t('cart_empty', { defaultValue: '🛒 Giỏ hàng của bạn đang trống.' })}</p>
            ) : (
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th>{t('cart_table_image', { defaultValue: 'Hình' })}</th>
                    <th>{t('cart_table_name', { defaultValue: 'Tên' })}</th>
                    <th className="text-center">{t('cart_table_price', { defaultValue: 'Giá' })}</th>
                    <th className="text-center">{t('cart_table_quantity', { defaultValue: 'Số lượng' })}</th>
                    <th className="text-center">{t('cart_table_total', { defaultValue: 'Tổng' })}</th>
                    <th className="text-center">
                      <i className="ti-trash remove-icon"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const name = item.pet?.name || item.product?.name || t('cart_unknown', { defaultValue: 'Không rõ' });
                    const image = item.pet?.imageUrl || item.product?.imageUrl || '/assets/user/images/logopetshop.jpg';
                    const price = item.pet?.price || item.product?.price || 0;
                    const total = price * item.quantity;

                    return (
                      <tr key={item.id}>
                        <td className="image">
                          <img src={getFullImageUrl(image)} alt={name} style={{ width: 120, height: 80, objectFit: 'cover' }} />
                        </td>
                        <td className="product-des">
                          <p className="product-name">{name}</p>
                          <p className="product-des">{t('cart_in_cart', { defaultValue: 'Sản phẩm trong giỏ' })}</p>
                        </td>
                        <td className="price text-center">
                          <span>{price.toLocaleString('vi-VN')} {t('cart_vnd', { defaultValue: 'VNĐ' })}</span>
                        </td>
                        <td className="qty text-center">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary px-2 py-1"
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                if (newQty < 1) {
                                  toast.warning(t('cart_min_quantity_warning', { defaultValue: '⚠️ Số lượng tối thiểu là 1!' }));
                                  return;
                                }
                                handleQuantityChange(item.id, newQty);
                              }}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              max={item.pet?.quantity || 99}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const max = item.pet?.quantity || 99;

                                if (isNaN(val) || val < 1) {
                                  toast.warning(t('cart_invalid_quantity', { defaultValue: '⚠️ Số lượng không hợp lệ!' }));
                                  return;
                                }
                                if (val > max) {
                                  toast.warning(t('cart_out_of_stock', { defaultValue: '🚫 Vượt quá số lượng tồn kho!' }));
                                  handleQuantityChange(item.id, max);
                                } else {
                                  handleQuantityChange(item.id, val);
                                }
                              }}
                              className="form-control text-center"
                              style={{ width: '60px', height: '32px', padding: '0 5px' }}
                            />

                            <button
                              className="btn btn-sm btn-outline-secondary px-2 py-1"
                              onClick={() => {
                                const max = item.pet?.quantity || 99;
                                const newQty = item.quantity + 1;
                                if (newQty > max) {
                                  toast.warning(t('cart_max_quantity_warning', { defaultValue: '🚫 Đã đạt số lượng tối đa trong kho!' }));
                                  return;
                                }
                                handleQuantityChange(item.id, newQty);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="total-amount text-center">
                          <span>{total.toLocaleString('vi-VN')} {t('cart_vnd', { defaultValue: 'VNĐ' })}</span>
                        </td>
                        <td className="action text-center">
                          <a href="#" onClick={(e) => {
                            e.preventDefault();
                            handleRemove(item);
                          }}>
                            <i className="ti-trash remove-icon"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="total-amount">
                <div className="row">
                  <div className="col-lg-8 col-md-5 col-12"></div>
                  <div className="col-lg-4 col-md-7 col-12">
                    <div className="right">
                      <ul>
                        <li>
                          {t('cart_subtotal', { defaultValue: 'Tổng giỏ hàng' })}
                          <span>{calculateTotal().toLocaleString('vi-VN')} {t('cart_vnd', { defaultValue: 'VNĐ' })}</span>
                        </li>
                        <li className="last">
                          {t('cart_total', { defaultValue: 'Tổng' })}
                          <span>{calculateTotal().toLocaleString('vi-VN')} {t('cart_vnd', { defaultValue: 'VNĐ' })}</span>
                        </li>
                      </ul>
                      <div className="button5">
                        <a href="#" onClick={handleCheckout} className="btn btn-success">
                          {t('cart_checkout', { defaultValue: 'Thanh toán' })}
                        </a>
                        <a href="/" className="btn btn-success">
                          {t('cart_continue_shopping', { defaultValue: 'Tiếp tục mua hàng' })}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}