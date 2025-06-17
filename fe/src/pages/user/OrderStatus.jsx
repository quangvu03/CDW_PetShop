// src/pages/user/OrderStatus.jsx
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
  const [activeTab, setActiveTab] = useState('all');

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
      console.log('API response:', response.data); // Debug

      // Kiểm tra kiểu dữ liệu của response.data
      if (Array.isArray(response.data)) {
        // Trường hợp trả về mảng đơn hàng
        setOrders(response.data);
        filterOrdersByTab('all', response.data, searchTerm);
      } else if (response.data && typeof response.data === 'object') {
        // Trường hợp trả về object
        if (response.data.success === false || response.data.message === 'Bạn chưa có đơn đặt hàng nào!') {
          setOrders([]);
          setFilteredOrders([]);
        } else {
          throw new Error('Định dạng phản hồi API không mong đợi');
        }
      } else {
        throw new Error('Phản hồi API không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        navigate('/auth/login');
      } else {
        toast.error(error.message || 'Không thể tải danh sách đơn hàng');
      }
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = (tab, ordersToFilter, term) => {
    let filtered = ordersToFilter;
    if (tab !== 'all') {
      filtered = ordersToFilter.filter(
        (order) => order.status?.toLowerCase() === tab.toLowerCase()
      );
    }
    if (term) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().toLowerCase().includes(term) ||
          order.status?.toLowerCase().includes(term) ||
          order.shippingAddress?.toLowerCase().includes(term) ||
          order.paymentMethod?.toLowerCase().includes(term) ||
          order.shippingName?.toLowerCase().includes(term)
      );
    }
    setFilteredOrders(filtered);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOrdersByTab(activeTab, orders, term);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    filterOrdersByTab(tab, orders, '');
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
    navigate(`/user/order-detail/${orderId}`);
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Lịch sử đơn hàng</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            Tất cả
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            Chờ xác nhận
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => handleTabChange('confirmed')}
          >
            Đã xác nhận
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'shipped' ? 'active' : ''}`}
            onClick={() => handleTabChange('shipped')}
          >
            Đang giao hàng
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
          >
            Hoàn thành
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => handleTabChange('cancelled')}
          >
            Đã hủy
          </button>
        </li>
      </ul>

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
                        className="btn btn-outline-primary"
                        style={{ fontSize: '12px', padding: '2px 8px' }}
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
              <div className="alert alert-info mt-3">
                Không tìm thấy đơn hàng nào trong tab này
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}