import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderDetail, cancelOrder, updateAddress } from '../../services/orderService';
import { getCurrentUser } from '../../services/userService';
import { addReview, getReviewsByUserId, updateReview } from '../../services/ratingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
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
  const [ratings, setRatings] = useState({}); // Lưu rating đã gửi cho mỗi petId
  const [pendingRatings, setPendingRatings] = useState({}); // Lưu rating tạm thời
  const [hoverRatings, setHoverRatings] = useState({}); // Lưu trạng thái hover
  const [reviews, setReviews] = useState({}); // Lưu reviewId cho mỗi petId

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
      setOrder(response.data.result);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      setUserInfo(res.data);
    } catch (err) {
      setUserInfo(null);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành');
    }
  };

  const fetchUserReviews = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await getReviewsByUserId(userId);
      const userReviews = response.data;
      console.log('User reviews:', userReviews);
      const ratingsMap = {};
      const reviewsMap = {};
      userReviews.forEach((review) => {
        if (review.orderId === parseInt(orderId)) {
          ratingsMap[review.petId] = review.rating;
          reviewsMap[review.petId] = review.id;
        }
      });
      console.log('Ratings map:', ratingsMap);
      console.log('Reviews map:', reviewsMap);
      setRatings(ratingsMap);
      setReviews(reviewsMap);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      toast.error('Không thể tải danh sách đánh giá.');
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
      title: 'Bạn có muốn hủy đơn hàng không?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, hủy đơn hàng',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelOrder(orderId);
          toast.success('Hủy đơn hàng thành công');
          await fetchOrderDetails();
        } catch (error) {
          console.error('Error cancelling order:', error);
          toast.error('Không thể hủy đơn hàng');
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
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    const provinceName = provinces.find((p) => p.code === parseInt(selectedProvince))?.name;
    const districtName = districts.find((d) => d.code === parseInt(selectedDistrict))?.name;
    const wardName = wards.find((w) => w.code === parseInt(selectedWard))?.name;

    if (!provinceName || !districtName || !wardName) {
      toast.error('Địa chỉ không hợp lệ');
      return;
    }

    const newAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;
    try {
      const response = await updateAddress(orderId, encodeURIComponent(newAddress));
      if (response.data.success) {
        toast.success(response.data.message || 'Cập nhật địa chỉ thành công');
        await fetchOrderDetails();
        setShowAddressModal(false);
      } else {
        toast.error(response.data.message || 'Cập nhật địa chỉ thất bại');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật địa chỉ');
    }
  };

  const handleStarClick = (petId, star) => {
    console.log(`Star clicked: petId=${petId}, star=${star}`);
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
      toast.error('Vui lòng chọn số sao từ 1 đến 5');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Vui lòng đăng nhập để gửi đánh giá');
        navigate('/auth/login');
        return;
      }

      if (reviews[petId]) {
        await updateReview(reviews[petId], userId, petId, rating, orderId);
        toast.success('Đánh giá đã được cập nhật thành công!');
      } else {
        await addReview(userId, petId, rating, orderId);
        toast.success('Đánh giá đã được gửi thành công!');
        const response = await getReviewsByUserId(userId);
        const newReview = response.data.find((r) => r.petId === petId && r.orderId === parseInt(orderId));
        if (newReview) {
          setReviews((prev) => ({ ...prev, [petId]: newReview.id }));
        }
      }

      setRatings((prev) => ({ ...prev, [petId]: rating }));
      setPendingRatings((prev) => ({ ...prev, [petId]: undefined }));
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        navigate('/auth/login');
      } else {
        toast.error('Không thể gửi/cập nhật đánh giá. Vui lòng thử lại.');
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancelOrder = order && order.status?.toLowerCase() === 'pending';
  const canChangeAddress = order && order.status?.toLowerCase() === 'pending';
  const canReview = order && order.status?.toLowerCase() === 'completed';

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Không tìm thấy thông tin đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Chi tiết đơn hàng #{order.orderId || order.id}</h3>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
            {canCancelOrder && (
              <button
                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                style={{ minWidth: '120px', height: '36px' }}
                onClick={handleCancelOrder}
              >
                Hủy đơn hàng
              </button>
            )}
            {canChangeAddress && (
              <button
                className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                style={{ minWidth: '120px', height: '36px' }}
                onClick={handleChangeAddress}
              >
                Thay đổi địa chỉ
              </button>
            )}
            <span
              className={`badge ${getStatusBadgeClass(order.status)} d-flex align-items-center justify-content-center`}
              style={{ minWidth: '120px', height: '36px', fontSize: '0.875rem', marginLeft: '10px' }}
            >
              {order.status === 'pending'
                ? 'Chờ xác nhận'
                : order.status === 'confirmed'
                ? 'Đã xác nhận'
                : order.status === 'shipped'
                ? 'Đang giao hàng'
                : order.status === 'completed'
                ? 'Hoàn thành'
                : order.status === 'cancelled'
                ? 'Đã hủy'
                : order.status}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Thông tin khách hàng</h5>
              <p>
                <strong>Họ tên:</strong>{' '}
                {order.fullName || order.user?.fullName || userInfo?.fullName || '---'}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{' '}
                {order.phoneNumber ||
                  order.user?.phoneNumber ||
                  order.user?.phone ||
                  userInfo?.phone ||
                  userInfo?.phoneNumber ||
                  '---'}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                {order.email || order.user?.email || userInfo?.email || '---'}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{' '}
                {order.shippingAddress || order.address || order.user?.address || userInfo?.address || '---'}
              </p>
            </div>
            <div className="col-md-6">
              <h5>Thông tin đơn hàng</h5>
              <p>
                <strong>Ngày đặt:</strong> {formatDate(order.orderDate)}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong>{' '}
                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{' '}
                <span
                  className={`badge ${order.paymentStatus === 'unpaid' ? 'bg-warning' : 'bg-success'}`}
                >
                  {order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                </span>
              </p>
              <p>
                <strong>Phương thức giao hàng:</strong> {order.shippingName || '---'}
              </p>
              <p>
                <strong>Phí giao hàng:</strong> {(order.priceShipping ?? 0).toLocaleString('vi-VN')}đ
              </p>
              <p>
                <strong>Ghi chú:</strong> {order.note || 'Không có'}
              </p>
            </div>
          </div>

          <h5>Danh sách sản phẩm</h5>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Ảnh sản phẩm</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  {canReview && <th>Đánh giá</th>}
                </tr>
              </thead>
              <tbody>
                {order.petDtoList && order.petDtoList.length > 0 ? (
                  order.petDtoList.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        {item.imageUrl ? (
                          <img
                            src={`http://localhost:8080/${item.imageUrl}`}
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          'Không có ảnh'
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
                            <div
                              className="star-rating"
                              style={{ minWidth: '120px', flexGrow: 1 }}
                            >
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
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    margin: '0 3px',
                                  }}
                                ></i>
                              ))}
                              {(pendingRatings[item.id] || ratings[item.id]) && (
                                <p style={{ fontSize: '12px', marginTop: '5px', color: '#000', fontWeight: 'bold' }}>
                                  {/* Bạn đã chọn {pendingRatings[item.id] || ratings[item.id]} sao */}
                                </p>
                              )}
                            </div>
                            <button
                              className="btn btn-outline-success"
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                              onClick={() => handleSubmitRating(item.id)}
                              disabled={!pendingRatings[item.id]}
                            >
                              Gửi
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                              onClick={() => handleCancelRating(item.id)}
                              disabled={!pendingRatings[item.id]}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canReview ? 6 : 5} className="text-center">
                      Không có sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>Tổng tiền hàng:</strong>
                  </td>
                  <td>
                    <strong>
                      {((order.totalPrice ?? 0) - (order.priceShipping ?? 0)).toLocaleString('vi-VN')}đ
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>Phí giao hàng:</strong>
                  </td>
                  <td>
                    <strong>{(order.priceShipping ?? 0).toLocaleString('vi-VN')}đ</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="text-end">
                    <strong>Tổng cộng:</strong>
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
              Quay lại
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
            <h3 style={{ marginBottom: '20px' }}>Thay đổi địa chỉ</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tỉnh/Thành
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  fetchDistricts(e.target.value);
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Chọn tỉnh/thành</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Quận/Huyện
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
                <option value="">Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phường/Xã
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!wards.length}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Số nhà, tên đường
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nhập số nhà, tên đường"
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
                Cập nhật
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
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Inline CSS cho ngôi sao */}
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