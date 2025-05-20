import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUser } from '../../services/orderService';
import { toast } from 'react-toastify';

export default function OrderStatus() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Vui lòng đăng nhập để xem đơn hàng');
        navigate('/auth/login');
        return;
      }

      const response = await getOrdersByUser(userId);
      if (response.data.success === false) {
        setOrders([]);
        setFilteredOrders([]);
      } else {
        setOrders(response.data);
        setFilteredOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        navigate('/auth/login');
      } else {
        toast.error('Không thể tải danh sách đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter(
      (order) =>
        order.id.toString().toLowerCase().includes(term) ||
        order.status?.toLowerCase().includes(term) ||
        order.shippingAddress?.toLowerCase().includes(term) ||
        order.paymentMethod?.toLowerCase().includes(term) ||
        order.shippingName?.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
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

  const handleViewDetails = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lịch sử đơn hàng</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">Bạn chưa có đơn hàng nào</div>
      ) : (
        <>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm đơn hàng (mã, trạng thái, địa chỉ...)"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái đơn hàng</th>
                  <th>Phương thức thanh toán</th>
                  <th>Trạng thái thanh toán</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Phương thức giao hàng</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{(order.totalPrice ?? 0).toLocaleString('vi-VN')}đ</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
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
                    </td>
                    <td>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'unpaid' ? 'bg-warning' : 'bg-success'}`}>
                        {order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                      </span>
                    </td>
                    <td>{order.shippingAddress}</td>
                    <td>{order.shippingName || '---'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="alert alert-info mt-3">Không tìm thấy đơn hàng nào</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}