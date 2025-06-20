import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrdersByUser } from '../../services/orderService';
import { toast } from 'react-toastify';

export default function OrderStatus() {
  const { t } = useTranslation();
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
        toast.error(t('order_status_login_required', { defaultValue: 'Vui lòng đăng nhập để xem đơn hàng' }));
        navigate('/auth/login');
        return;
      }

      const data = await getOrdersByUser(userId);
      console.log(t('order_status_api_response_log', { defaultValue: 'API response data:' }), data);

      if (Array.isArray(data)) {
        setOrders(data);
        filterOrdersByTab('all', data, searchTerm);
      } else if (data && typeof data === 'object') {
        if (data.success !== undefined || data.message === 'Bạn chưa có đơn đặt hàng nào!') {
          setOrders([]);
          setFilteredOrders([]);
        } else {
          throw new Error(t('order_status_api_format_error', { defaultValue: 'Định dạng phản hồi API không mong đợi' }));
        }
      } else {
        throw new Error(t('order_status_api_invalid_response', { defaultValue: 'Phản hồi API không hợp lệ' }));
      }
    } catch (error) {
      console.error(t('order_status_fetch_error_log', { defaultValue: 'Lỗi khi lấy đơn hàng:' }), error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t('order_status_session_expired', { defaultValue: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }));
        localStorage.clear();
        navigate('/auth/login');
      } else {
        toast.error(error.message || t('order_status_fetch_error', { defaultValue: 'Không thể tải danh sách đơn hàng' }));
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
          order.shippingName?.toLowerCase().includes(term) ||
          order.phoneNumber?.toLowerCase().includes(term)
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

  const handleViewDetails = (orderId) => {
    navigate(`/user/order-detail/${orderId}`);
  };

  const handlePayNow = (checkoutUrl) => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      toast.error(t('order_status_no_payment_link', { defaultValue: 'Không có liên kết thanh toán' }));
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('order_status_loading', { defaultValue: 'Loading...' })}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">{t('order_status_title', { defaultValue: 'Lịch sử đơn hàng' })}</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            {t('order_status_all', { defaultValue: 'Tất cả' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            {t('order_status_pending', { defaultValue: 'Chờ xác nhận' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => handleTabChange('confirmed')}
          >
            {t('order_status_confirmed', { defaultValue: 'Đã xác nhận' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'shipped' ? 'active' : ''}`}
            onClick={() => handleTabChange('shipped')}
          >
            {t('order_status_shipped', { defaultValue: 'Đang giao hàng' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
          >
            {t('order_status_completed', { defaultValue: 'Hoàn thành' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => handleTabChange('cancelled')}
          >
            {t('order_status_cancelled', { defaultValue: 'Đã hủy' })}
          </button>
        </li>
      </ul>

      {orders.length === 0 ? (
        <div className="alert alert-info">{t('order_status_no_orders', { defaultValue: 'Bạn chưa có đơn hàng nào' })}</div>
      ) : (
        <>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t('order_status_search_placeholder', { defaultValue: 'Tìm kiếm đơn hàng (mã, trạng thái, địa chỉ, tên, số điện thoại...)' })}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>{t('order_status_order_id', { defaultValue: 'Mã đơn hàng' })}</th>
                  <th>{t('order_status_order_date', { defaultValue: 'Ngày đặt' })}</th>
                  <th>{t('order_status_total', { defaultValue: 'Tổng tiền' })}</th>
                  <th>{t('order_status_status', { defaultValue: 'Trạng thái đơn hàng' })}</th>
                  <th>{t('order_status_payment_method', { defaultValue: 'Phương thức thanh toán' })}</th>
                  <th>{t('order_status_payment_status', { defaultValue: 'Trạng thái thanh toán' })}</th>
                  <th>{t('order_status_shipping_address', { defaultValue: 'Địa chỉ giao hàng' })}</th>
                  <th>{t('order_status_shipping_name', { defaultValue: 'Tên người nhận' })}</th>
                  <th>{t('order_status_phone', { defaultValue: 'Số điện thoại' })}</th>
                  <th>{t('order_status_payment', { defaultValue: 'Thanh toán' })}</th>
                  <th>{t('order_status_details', { defaultValue: 'Chi tiết' })}</th>
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
                    </td>
                    <td>{order.paymentMethod === 'COD' ? t('order_status_cod', { defaultValue: 'Thanh toán khi nhận hàng' }) : order.paymentMethod}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'unpaid' ? 'bg-warning' : 'bg-success'}`}>
                        {order.paymentStatus === 'unpaid' ? t('order_status_unpaid', { defaultValue: 'Chưa thanh toán' }) : t('order_status_paid', { defaultValue: 'Đã thanh toán' })}
                      </span>
                    </td>
                    <td>{order.shippingAddress || '---'}</td>
                    <td>{order.shippingName || '---'}</td>
                    <td>{order.phoneNumber || '---'}</td>
                    <td>
                      {order.status === 'cancelled' ? (
                        '---'
                      ) : order.paymentMethod === 'PAYOS' && order.paymentStatus === 'unpaid' && isPaymentLinkValid(order.expiredAt) ? (
                        <button
                          className="btn btn-outline-success"
                          style={{ fontSize: '12px', padding: '2px 8px' }}
                          onClick={() => handlePayNow(order.checkoutUrl)}
                        >
                          {t('order_status_pay_now', { defaultValue: 'Thanh toán ngay' })}
                        </button>
                      ) : order.paymentMethod === 'PAYOS' && order.paymentStatus === 'unpaid' ? (
                        <span className="text-danger">{t('order_status_payment_expired', { defaultValue: 'Link thanh toán đã hết hạn' })}</span>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary"
                        style={{ fontSize: '12px', padding: '2px 8px' }}
                        onClick={() => handleViewDetails(order.id)}
                      >
                        {t('order_status_view_details', { defaultValue: 'Xem chi tiết' })}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="alert alert-info mt-3">
                {t('order_status_no_results', { defaultValue: 'Không tìm thấy đơn hàng nào trong tab này' })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}