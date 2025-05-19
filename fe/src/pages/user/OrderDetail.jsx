import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from '../../assets/user/css/OrderDetails.module.css';
import { getOrderDetail, cancelOrder } from '../../services/checkoutService';
import Swal from 'sweetalert2';

const OrderDetails = () => {
  const { state } = useLocation();
  const orderId = state?.orderId;
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    if (!orderId) {
      setError('Không tìm thấy đơn hàng.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getOrderDetail(orderId);
      setOrder(response.data.result);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
      setError('Không thể tải chi tiết đơn hàng.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy đơn hàng',
      text: `Bạn có muốn hủy đơn hàng với mã hóa đơn #${order.orderId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      try {
        const response = await cancelOrder(orderId, 'cancelled'); // Truyền status=cancelled
        if (response.data.result === 'success') {
          Swal.fire('Thành công!', 'Đơn hàng đã được hủy.', 'success');
          // Gọi lại fetchOrder để cập nhật trạng thái đơn hàng
          await fetchOrder();
        } else {
          Swal.fire('Lỗi!', 'Không thể hủy đơn hàng.', 'error');
        }
      } catch (err) {
        console.error('Lỗi khi hủy đơn hàng:', err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi hủy đơn hàng.', 'error');
      }
    }
  };

  if (loading) return <p className={styles.loading}>Đang tải chi tiết đơn hàng...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!order) return <p className={styles.error}>Không tìm thấy đơn hàng.</p>;

  const subtotal = order.petDtoList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.priceShipping || 0;
  const total = subtotal + shipping;

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate('/orderstatus')}
        className={styles.backButton}
      >
        Quay lại
      </button>

      <div className={styles.header}>
        <h1 className={styles.logo}>PetShop-LÊĐÌNHVĂN</h1>
        <div className={styles.headerRight}>
          <span className={styles.orderId}>Đơn hàng # {order.orderId}</span>
          {order.status === 'pending' && (
            <button
              className={styles.backButton}
              style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
              onClick={handleCancelOrder}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Thông tin thanh toán:</h2>
          <p className={styles.infoValue}>
            {order.paymentMethod || 'Không xác định'} - {order.paymentStatus || 'Không xác định'}
          </p>
        </div>
        <div className={`${styles.infoCard} ${styles.textRight}`}>
          <h2 className={styles.sectionTitle}>Địa chỉ giao hàng:</h2>
          <p className={styles.infoValue}>{order.shippingAddress || 'Không có địa chỉ'}</p>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Trạng thái đơn hàng:</h2>
          <p className={styles.infoValue}>{order.status || 'Không xác định'}</p>
        </div>
        <div className={`${styles.infoCard} ${styles.textRight}`}>
          <h2 className={styles.sectionTitle}>Ngày đặt hàng:</h2>
          <p className={styles.infoValue}>
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString('vi-VN')
              : 'Không xác định'}
          </p>
        </div>
      </div>

      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableCell}>Ảnh sản phẩm</th>
                <th className={styles.tableCell}>Sản phẩm</th>
                <th className={styles.tableCell}>Giá</th>
                <th className={styles.tableCell}>Số lượng</th>
                <th className={styles.tableCellRight}>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {order.petDtoList.map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    {item.imageUrl ? (
                      <img
                        src={`http://localhost:8080/${item.imageUrl}`}
                        alt={item.name}
                        className={styles.productImage}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      'Không có ảnh'
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    <Link
                      to={`/pet/${item.id}`}
                      style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className={styles.tableCell}>{item.price.toLocaleString('vi-VN')} VND</td>
                  <td className={styles.tableCell}>{item.quantity}</td>
                  <td className={styles.tableCellRight}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className={styles.totalRow}>
            <span>Đơn vị vận chuyển</span>
            <span>{order.shippingName || 'Không xác định'}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Phí vận chuyển</span>
            <span>{shipping.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className={styles.totalRowFinal}>
            <span>Tổng cộng</span>
            <span>{total.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => window.print()}
          className={styles.printButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-6 8v4h6v-4H7z"
              clipRule="evenodd"
            />
          </svg>
          In
        </button>
        <button className={styles.sendButton}>Gửi</button>
      </div>
    </div>
  );
};

export default OrderDetails;