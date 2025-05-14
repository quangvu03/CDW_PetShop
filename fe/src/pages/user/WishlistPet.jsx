import React, { useEffect, useState } from 'react';
import { getWishlistByUser } from '../../services/wishlistService';
import { removePetToWishlist } from '../../services/wishlistService';
import { toast } from 'react-toastify';
export default function WishlistPet() {
  const [wishlist, setWishlist] = useState([]);
  const BACKEND_BASE_URL = 'http://localhost:8080';
  const defaultImageUrl = "/assets/user/images/default-pet-placeholder.png";

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistByUser();
        console.log('Wishlist response:', response); // Thêm dòng này
        if (Array.isArray(response)) {
          setWishlist(response);
        } else if (response && Array.isArray(response.data)) {
          setWishlist(response.data);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, []);

  // Hàm format giá giống ProductArea
  const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (price === null || price === undefined || isNaN(numericPrice)) {
      return "Liên hệ";
    }
    if (numericPrice >= 1000000) {
      return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu đồng`;
    }
    return `${numericPrice.toLocaleString('vi-VN')} đồng`;
  };

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
                    {wishlist.length > 0 ? (
                      wishlist.map((pet) => {
                        let imageSource = defaultImageUrl;
                        if (pet && pet.imageUrl && typeof pet.imageUrl === 'string' && pet.imageUrl.trim() !== '') {
                          if (pet.imageUrl.startsWith('http://') || pet.imageUrl.startsWith('https://')) {
                            imageSource = pet.imageUrl;
                          } else {
                            const relativePath = pet.imageUrl.startsWith('/') ? pet.imageUrl.substring(1) : pet.imageUrl;
                            imageSource = `${BACKEND_BASE_URL}/${relativePath}`;
                          }
                        }
                        return (
                          <div key={pet.id} className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
                            <div className="single-product">
                              <div className="product-img position-relative">
                                <a href={`/product/${pet.id}`}>
                                  <img className="default-img" src={imageSource} alt={pet.name} onError={e => { e.target.onerror = null; e.target.src = defaultImageUrl; }} />
                                  <img className="hover-img" src={imageSource} alt={pet.name} onError={e => { e.target.onerror = null; e.target.src = defaultImageUrl; }} />
                                </a>
                                {/* Badge trạng thái */}
                                <div className={`pet-status-overlay ${
                                  pet.status === 'available'
                                    ? 'status-available'
                                    : pet.status === 'pending'
                                    ? 'status-pending'
                                    : 'status-sold'
                                }`}>
                                  {pet.status === 'available'
                                    ? 'Có sẵn'
                                    : pet.status === 'pending'
                                    ? 'Đang nhập'
                                    : 'Hết hàng'}
                                </div>
                                <div className="button-head">
                                  <div className="product-action">
                                    <a href={`/product/${pet.id}`} title="Xem chi tiết"><i className="ti-eye"></i><span>Xem chi tiết</span></a>
                                    <a href="#"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      try {
                                        await removePetToWishlist(pet.id);
                                        toast.success('Đã xoá khỏi danh sách yêu thích!');
                                        setWishlist(prev => prev.filter(item => item.id !== pet.id));
                                      } catch (err) {
                                        toast.error('Có lỗi khi xoá sản phẩm vào danh sách yêu thích!');
                                      }
                                    }}
                                    title="Xoá khỏi yêu thích"><i className="ti-trash"></i></a>
                                  </div>
                                  <div className="product-action-2">
                                    <a href="#" title="Thêm vào giỏ hàng">Thêm vào giỏ hàng</a>
                                  </div>
                                </div>
                              </div>
                              <div className="product-content">
                                <h3><a href={`/product/${pet.id}`}>{pet.name || 'Chưa có tên'}</a></h3>
                                <div className="product-price">
                                  <span>{formatPrice(pet.price)}</span>
                                </div>
                                {/* <div className="product-meta mt-2">
                                  <div><strong>Loài:</strong> {pet.species || 'N/A'}</div>
                                  <div><strong>Giống:</strong> {pet.breed || 'N/A'}</div>
                                  <div><strong>Số lượng:</strong> {pet.quantity ?? '1'}</div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-12 text-center">
                        <p>Bạn chưa có thú cưng nào trong danh sách yêu thích</p>
                      </div>
                    )}
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
