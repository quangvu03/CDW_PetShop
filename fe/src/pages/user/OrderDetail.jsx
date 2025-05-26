import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Thêm Link
import { getOrderDetail, cancelOrder } from '../../services/orderService';
import { getCurrentUser } from '../../services/userService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    fetchUserInfo();
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
                          to={`/pet/${item.id}`}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không có sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end">
                    <strong>Tổng tiền hàng:</strong>
                  </td>
                  <td>
                    <strong>
                      {((order.totalPrice ?? 0) - (order.priceShipping ?? 0)).toLocaleString('vi-VN')}đ
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-end">
                    <strong>Phí giao hàng:</strong>
                  </td>
                  <td>
                    <strong>{(order.priceShipping ?? 0).toLocaleString('vi-VN')}đ</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-end">
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
    </div>
  );
}