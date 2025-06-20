import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrderDetail, cancelOrder, updateAddress } from '../../services/orderService';
import { getCurrentUser } from '../../services/userService';
import { addReview, getReviewsByUserId, updateReview } from '../../services/ratingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function OrderDetail() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [ratings, setRatings] = useState({});
  const [pendingRatings, setPendingRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    fetchOrderDetails();
    fetchUserInfo();
    fetchProvinces();
    fetchUserReviews();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetail(orderId);
      console.log(t('order_detail_api_response_log', { defaultValue: 'API response:' }), response);
      if (response && response.result && response.order) {
        setOrderDetails(response.result);
        setOrder(response.order);
      } else {
        throw new Error(t('order_detail_not_found', { defaultValue: 'Không tìm thấy chi tiết đơn hàng' }));
      }
    } catch (error) {
      console.error(t('order_detail_fetch_error_log', { defaultValue: 'Lỗi khi lấy chi tiết đơn hàng:' }), error);
      toast.error(error.message || t('order_detail_fetch_error', { defaultValue: 'Không thể tải thông tin đơn hàng' }));
      setOrder(null);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      setUserInfo(res.data);
    } catch (err) {
      console.error(t('order_detail_user_error_log', { defaultValue: 'Lỗi khi lấy thông tin người dùng:' }), err);
      setUserInfo(null);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
      setProvinces(response.data);
    } catch (error) {
      console.error(t('order_detail_provinces_error_log', { defaultValue: 'Lỗi khi lấy danh sách tỉnh/thành:' }), error);
      toast.error(t('order_detail_provinces_error', { defaultValue: 'Không thể tải danh sách tỉnh/thành' }));
    }
  };

  const fetchUserReviews = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await getReviewsByUserId(userId);
      const userReviews = response.data;
      console.log(t('order_detail_reviews_log', { defaultValue: 'Danh sách đánh giá:' }), userReviews);
      const ratingsMap = {};
      const reviewsMap = {};
      userReviews.forEach((review) => {
        if (review.orderId === parseInt(orderId)) {
          ratingsMap[review.petId] = review.rating;
          reviewsMap[review.petId] = review.id;
        }
      });
      setRatings(ratingsMap);
      setReviews(reviewsMap);
    } catch (error) {
      console.error(t('order_detail_reviews_error_log', { defaultValue: 'Lỗi khi lấy danh sách đánh giá:' }), error);
      toast.error(t('order_detail_reviews_error', { defaultValue: 'Không thể tải danh sách đánh giá' }));
    }
  };

  const fetchDistricts = (provinceCode) => {
    const province = provinces.find((p) => p.code === parseInt(provinceCode));
    setDistricts(province ? province.districts : []);
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const fetchWards = (districtCode) => {
    const district = districts.find((d) => d.code === parseInt(districtCode));
    setWards(district ? district.wards : []);
    setSelectedWard('');
  };

  const handleCancelOrder = async () => {
    Swal.fire({
      title: t('order_detail_cancel_confirm_title', { defaultValue: 'Bạn có muốn hủy đơn hàng không?' }),
      text: t('order_detail_cancel_confirm_text', { defaultValue: 'Hành động này không thể hoàn tác!' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('order_detail_cancel_yes', { defaultValue: 'Có, hủy đơn hàng' }),
      cancelButtonText: t('order_detail_cancel_no', { defaultValue: 'Không' }),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelOrder(orderId);
          toast.success(t('order_detail_cancel_success', { defaultValue: 'Hủy đơn hàng thành công' }));
          await fetchOrderDetails();
        } catch (error) {
          console.error(t('order_detail_cancel_error_log', { defaultValue: 'Lỗi khi hủy đơn hàng:' }), error);
          toast.error(error.message || t('order_detail_cancel_error', { defaultValue: 'Không thể hủy đơn hàng' }));
        }
      }
    });
  };

  const handleChangeAddress = () => {
    setShowAddressModal(true);
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setStreet(order?.shippingAddress?.split(', ').slice(0, -3).join(', ') || '');
  };

  const handleUpdateAddress = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !street) {
      toast.error(t('order_detail_address_required', { defaultValue: 'Vui lòng điền đầy đủ thông tin địa chỉ' }));
      return;
    }

    const provinceName = provinces.find((p) => p.code === parseInt(selectedProvince))?.name;
    const districtName = districts.find((d) => d.code === parseInt(selectedDistrict))?.name;
    const wardName = wards.find((w) => w.code === parseInt(selectedWard))?.name;

    if (!provinceName || !districtName || !wardName) {
      toast.error(t('order_detail_address_invalid', { defaultValue: 'Địa chỉ không hợp lệ' }));
      return;
    }

    const newAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;
    try {
      const response = await updateAddress(orderId, encodeURIComponent(newAddress));
      if (response.success) {
        toast.success(t('order_detail_address_success', { defaultValue: response.message || 'Cập nhật địa chỉ thành công' }));
        await fetchOrderDetails();
        setShowAddressModal(false);
      } else {
        toast.error(t('order_detail_address_failure', { defaultValue: response.message || 'Cập nhật địa chỉ thất bại' }));
      }
    } catch (error) {
      console.error(t('order_detail_address_error_log', { defaultValue: 'Lỗi khi cập nhật địa chỉ:' }), error);
      toast.error(error.message || t('order_detail_address_error', { defaultValue: 'Không thể cập nhật địa chỉ' }));
    }
  };

  const handleStarClick = (petId, star) => {
    setPendingRatings((prev) => ({ ...prev, [petId]: star }));
  };

  const handleStarHover = (petId, star) => {
    setHoverRatings((prev) => ({ ...prev, [petId]: star }));
  };

  const handleStarLeave = (petId) => {
    setHoverRatings((prev) => ({ ...prev, [petId]: 0 }));
  };

  const handleSubmitRating = async (petId) => {
    const rating = pendingRatings[petId];
    if (!rating || rating < 1 || rating > 5) {
      toast.error(t('order_detail_rating_invalid', { defaultValue: 'Vui lòng chọn số sao từ 1 đến 5' }));
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error(t('order_detail_rating_login_required', { defaultValue: 'Vui lòng đăng nhập để gửi đánh giá' }));
        navigate('/auth/login');
        return;
      }

      if (reviews[petId]) {
        await updateReview(reviews[petId], userId, petId, rating, orderId);
        toast.success(t('order_detail_rating_update_success', { defaultValue: 'Đánh giá đã được cập nhật thành công!' }));
      } else {
        await addReview(userId, petId, rating, orderId);
        toast.success(t('order_detail_rating_submit_success', { defaultValue: 'Đánh giá đã được gửi thành công!' }));
        const response = await getReviewsByUserId(userId);
        const newReview = response.data.find((r) => r.petId === petId && r.orderId === parseInt(orderId));
        if (newReview) {
          setReviews((prev) => ({ ...prev, [petId]: newReview.id }));
        }
      }

      setRatings((prev) => ({ ...prev, [petId]: rating }));
      setPendingRatings((prev) => ({ ...prev, [petId]: undefined }));
    } catch (error) {
      console.error(t('order_detail_rating_error_log', { defaultValue: 'Lỗi khi gửi/cập nhật đánh giá:' }), error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t('order_detail_rating_session_expired', { defaultValue: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }));
        localStorage.clear();
        navigate('/auth/login');
      } else {
        toast.error(error.message || t('order_detail_rating_error', { defaultValue: 'Không thể gửi/cập nhật đánh giá' }));
      }
    }
  };

  const handleCancelRating = (petId) => {
    setPendingRatings((prev) => ({ ...prev, [petId]: undefined }));
    setHoverRatings((prev) => ({ ...prev, [petId]: 0 }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'confirmed':
        return 'bg-info';
      case 'shipped':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }) : '---';
  };

  const isPaymentLinkValid = (expiredAt) => {
    if (!expiredAt) return false;
    const expiryDate = new Date(expiredAt);
    return expiryDate > new Date();
  };

  const handlePayNow = (checkoutUrl) => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      toast.error(t('order_detail_no_payment_link', { defaultValue: 'Không có liên kết thanh toán' }));
    }
  };

  const canCancelOrder = order && order.status?.toLowerCase() === 'pending';
  const canChangeAddress = order && order.status?.toLowerCase() === 'pending';
  const canReview = order && order.status?.toLowerCase() === 'completed';

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('order_detail_loading', { defaultValue: 'Loading...' })}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order || !orderDetails) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{t('order_detail_not_found_alert', { defaultValue: 'Không tìm thấy thông tin đơn hàng' })}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{t('order_detail_title', { defaultValue: 'Chi tiết đơn hàng #{order.id}' })}</h3>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
            {canCancelOrder && (
              <button
                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                style={{ minWidth: '120px', height: '36px' }}
                onClick={handleCancelOrder}
              >
                {t('order_detail_cancel_order', { defaultValue: 'Hủy đơn hàng' })}
              </button>
            )}
            {canChangeAddress && (
              <button
                className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                style={{ minWidth: '120px', height: '36px' }}
                onClick={handleChangeAddress}
              >
                {t('order_detail_change_address', { defaultValue: 'Thay đổi địa chỉ' })}
              </button>
            )}
            {order.paymentMethod === 'PAYOS' && order.paymentStatus === 'unpaid' && isPaymentLinkValid(order.expiredAt) && order.status === 'pending' && (
              <button
                className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                style={{ minWidth: '120px', height: '36px' }}
                onClick={() => handlePayNow(order.checkoutUrl)}
              >
                {t('order_detail_pay_now', { defaultValue: 'Thanh toán ngay' })}
              </button>
            )}
            <span
              className={`badge ${getStatusBadgeClass(order.status)} d-flex align-items-center justify-content-center`}
              style={{ minWidth: '120px', height: '36px', fontSize: '0.875rem', marginLeft: '10px' }}
            >
              {order.status === 'pending'
                ? t('order_status_pending', { defaultValue: 'Chờ xác nhận' })
                : order.status === 'confirmed'
                  ? t('order_status_confirmed', { defaultValue: 'Đã xác nhận' })
                  : order.status === 'shipped'
                    ? t('order_status_shipped', { defaultValue: 'Đang giao hàng' })
                    : order.status === 'completed'
                      ? t('order_status_completed', { defaultValue: 'Hoàn thành' })
                      : order.status === 'cancelled'
                        ? t('order_status_cancelled', { defaultValue: 'Đã hủy' })
                        : order.status}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>{t('order_detail_customer_info', { defaultValue: 'Thông tin khách hàng' })}</h5>
              <p><strong>{t('order_detail_customer_name', { defaultValue: 'Họ tên:' })}</strong> {order.shippingName || userInfo?.fullName || '---'}</p>
              <p><strong>{t('order_detail_customer_phone', { defaultValue: 'Số điện thoại:' })}</strong> {order.phoneNumber || userInfo?.phone || '---'}</p>
              <p><strong>{t('order_detail_customer_email', { defaultValue: 'Email:' })}</strong> {userInfo?.email || '---'}</p>
              <p><strong>{t('order_detail_customer_address', { defaultValue: 'Địa chỉ:' })}</strong> {order.shippingAddress || '---'}</p>
            </div>
            <div className="col-md-6">
              <h5>{t('order_detail_order_info', { defaultValue: 'Thông tin đơn hàng' })}</h5>
              <p><strong>{t('order_detail_order_date', { defaultValue: 'Ngày đặt:' })}</strong> {formatDate(order.orderDate)}</p>
              <p><strong>{t('order_detail_payment_method', { defaultValue: 'Phương thức thanh toán:' })}</strong> {order.paymentMethod === 'COD' ? t('order_status_cod', { defaultValue: 'Thanh toán khi nhận hàng' }) : order.paymentMethod}</p>
              <p>
                <strong>{t('order_detail_payment_status', { defaultValue: 'Trạng thái thanh toán:' })}</strong>{' '}
                <span className={`badge ${order.paymentStatus === 'unpaid' ? 'bg-warning' : 'bg-success'}`}>
                  {order.paymentStatus === 'unpaid' ? t('order_status_unpaid', { defaultValue: 'Chưa thanh toán' }) : t('order_status_paid', { defaultValue: 'Đã thanh toán' })}
                </span>
              </p>
              {order.paymentMethod === 'PAYOS' && order.paymentStatus === 'unpaid' && (
                <p>
                  <strong>{t('order_detail_payment_link', { defaultValue: 'Link thanh toán:' })}</strong>{' '}
                  {isPaymentLinkValid(order.expiredAt) ? (
                    <a href={order.checkoutUrl} target="_blank" rel="noopener noreferrer">{t('order_detail_payment_access', { defaultValue: 'Truy cập' })}</a>
                  ) : (
                    t('order_detail_payment_expired', { defaultValue: 'Hết hạn' })
                  )}
                </p>
              )}
              <p><strong>{t('order_detail_payment_expiry', { defaultValue: 'Hết hạn thanh toán:' })}</strong> {formatDate(order.expiredAt)}</p>
              <p><strong>{t('order_detail_shipping_method', { defaultValue: 'Phương thức giao hàng:' })}</strong> {orderDetails?.shippingName || '---'}</p>
              <p><strong>{t('order_detail_shipping_fee', { defaultValue: 'Phí giao hàng:' })}</strong> {(orderDetails?.priceShipping ?? 0).toLocaleString('vi-VN')}đ</p>
              <p><strong>{t('order_detail_note', { defaultValue: 'Ghi chú:' })}</strong> {orderDetails?.note || t('order_detail_no_note', { defaultValue: 'Không có' })}</p>
            </div>
          </div>

          <h5>{t('order_detail_products', { defaultValue: 'Danh sách sản phẩm' })}</h5>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>{t('order_detail_product_image', { defaultValue: 'Ảnh sản phẩm' })}</th>
                  <th>{t('order_detail_product_name', { defaultValue: 'Sản phẩm' })}</th>
                  <th>{t('order_detail_quantity', { defaultValue: 'Số lượng' })}</th>
                  <th>{t('order_detail_unit_price', { defaultValue: 'Đơn giá' })}</th>
                  <th>{t('order_detail_total_price', { defaultValue: 'Thành tiền' })}</th>
                  {canReview && <th>{t('order_detail_rating', { defaultValue: 'Đánh giá' })}</th>}
                </tr>
              </thead>
              <tbody>
                {orderDetails?.petDtoList && orderDetails.petDtoList.length > 0 ? (
                  orderDetails.petDtoList.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        {item.imageUrl ? (
                          <img
                            src={`http://localhost:8080/${item.imageUrl}`}
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          t('order_detail_no_image', { defaultValue: 'Không có ảnh' })
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/user/pet/${item.id}`}
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          #{item.id} - {item.name}
                        </Link>
                      </td>
                      <td>{Number(item.quantity) || 1}</td>
                      <td>{(Number(item.price) || 0).toLocaleString('vi-VN')}đ</td>
                      <td>
                        {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString('vi-VN')}đ
                      </td>
                      {canReview && (
                        <td>
                          <div className="d-flex gap-2 align-items-center">
                            <div className="star-rating" style={{ minWidth: '120px', flexGrow: 1 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`fa fa-star ${
                                    star <= (hoverRatings[item.id] || pendingRatings[item.id] || ratings[item.id] || 0)
                                      ? 'fa-star-rated'
                                      : ''
                                  }`}
                                  onClick={() => handleStarClick(item.id, star)}
                                  onMouseEnter={() => handleStarHover(item.id, star)}
                                  onMouseLeave={() => handleStarLeave(item.id)}
                                  style={{ cursor: 'pointer', fontSize: '16px', margin: '0 3px' }}
                                ></i>
                              ))}
                              {(pendingRatings[item.id] || ratings[item.id]) && (
                                <p style={{ fontSize: '12px', marginTop: '5px', color: '#000', fontWeight: 'bold' }}></p>
                              )}
                            </div>
                            <button
                              className="btn btn-outline-success"
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                              onClick={() => handleSubmitRating(item.id)}
                              disabled={!pendingRatings[item.id]}
                            >
                              {t('order_detail_submit_rating', { defaultValue: 'Gửi' })}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                              onClick={() => handleCancelRating(item.id)}
                              disabled={!pendingRatings[item.id]}
                            >
                              {t('order_detail_cancel_rating', { defaultValue: 'Hủy' })}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canReview ? 6 : 5} className="text-center">
                      {t('order_detail_no_products', { defaultValue: 'Không có sản phẩm' })}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>{t('order_detail_subtotal', { defaultValue: 'Tổng tiền hàng:' })}</strong>
                  </td>
                  <td>
                    <strong>
                      {((order.totalPrice ?? 0) - (orderDetails?.priceShipping ?? 0)).toLocaleString('vi-VN')}đ
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>{t('order_detail_shipping_fee', { defaultValue: 'Phí giao hàng:' })}</strong>
                  </td>
                  <td>
                    <strong>{(orderDetails?.priceShipping ?? 0).toLocaleString('vi-VN')}đ</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>{t('order_detail_total', { defaultValue: 'Tổng cộng:' })}</strong>
                  </td>
                  <td>
                    <strong>{(order.totalPrice ?? 0).toLocaleString('vi-VN')}đ</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-3 d-flex justify-content-start">
            <button className="btn btn-secondary" onClick={() => navigate('/order-history')}>
              {t('order_detail_back', { defaultValue: 'Quay lại' })}
            </button>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '0',
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>{t('order_detail_change_address_title', { defaultValue: 'Thay đổi địa chỉ' })}</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {t('order_detail_province', { defaultValue: 'Tỉnh/Thành' })}
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  fetchDistricts(e.target.value);
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">{t('order_detail_select_province', { defaultValue: 'Chọn tỉnh/thành' })}</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {t('order_detail_district', { defaultValue: 'Quận/Huyện' })}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  fetchWards(e.target.value);
                }}
                disabled={!districts.length}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">{t('order_detail_select_district', { defaultValue: 'Chọn quận/huyện' })}</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {t('order_detail_ward', { defaultValue: 'Phường/Xã' })}
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!wards.length}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">{t('order_detail_select_ward', { defaultValue: 'Chọn phường/xã' })}</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {t('order_detail_street', { defaultValue: 'Số nhà, tên đường' })}
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={t('order_detail_street_placeholder', { defaultValue: 'Nhập số nhà, tên đường' })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleUpdateAddress}
                style={{
                  padding: '8px 16px',
                  background: '#3085d6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {t('order_detail_update_address', { defaultValue: 'Cập nhật' })}
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{
                  padding: '8px 16px',
                  background: '#d33',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {t('order_detail_cancel', { defaultValue: 'Hủy' })}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          .fa-star {
            color: #333333 !important;
          }
          .fa-star-rated {
            color: #f1c40f !important;
          }
        `}
      </style>
    </div>
  );
}