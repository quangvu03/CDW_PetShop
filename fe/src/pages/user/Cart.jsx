import React, { useEffect, useState } from 'react';
import '../../assets/user/css/User.css';

import {
  getCartByUser,
  updateCartItemQuantity,
  removeItemFromCart
} from '../../services/cartService';
import { toast } from 'react-toastify';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    fetchCart();
  }, []);

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
      toast.error('Lỗi khi lấy giỏ hàng');
    }
  };
  const handleQuantityChange = async (itemId, newQty) => {
    try {
      await updateCartItemQuantity(itemId, newQty);
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      toast.error('Cập nhật số lượng thất bại');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItemFromCart({
        petId: item.pet?.id,
        productId: item.product?.id
      });
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      toast.error('Xoá khỏi giỏ thất bại');
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
              <p className="text-center py-5">🛒 Giỏ hàng của bạn đang trống.</p>
            ) : (
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th>Hình</th>
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
                  {cartItems.map((item) => {
                    const name = item.pet?.name || item.product?.name || 'Không rõ';
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
                          <p className="product-des">Sản phẩm trong giỏ</p>
                        </td>
                        <td className="price text-center">
                          <span>{price.toLocaleString('vi-VN')} VNĐ</span>
                        </td>
                        <td className="qty text-center">
  <div className="d-flex align-items-center justify-content-center gap-2">
    <button
      className="btn btn-sm btn-outline-secondary px-2 py-1"
      onClick={() => {
        const newQty = item.quantity - 1;
        if (newQty < 1) {
          toast.warning("⚠️ Số lượng tối thiểu là 1!");
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
          toast.warning("⚠️ Số lượng không hợp lệ!");
          return;
        }
        if (val > max) {
          toast.warning("🚫 Vượt quá số lượng tồn kho!");
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
          toast.warning("🚫 Đã đạt số lượng tối đa trong kho!");
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
                          <span>{total.toLocaleString('vi-VN')} VNĐ</span>
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
                          Tổng giỏ hàng
                          <span>{calculateTotal().toLocaleString('vi-VN')} VNĐ</span>
                        </li>
                        <li className="last">
                          Tổng
                          <span>{calculateTotal().toLocaleString('vi-VN')} VNĐ</span>
                        </li>
                      </ul>
                      <div className="button5">
                        <a href="#" className="btn btn-success">
                          Thanh toán
                        </a>
                        <a href="/" className="btn btn-success">
                          Tiếp tục mua hàng
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
