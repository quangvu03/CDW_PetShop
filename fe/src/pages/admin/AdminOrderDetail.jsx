import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { getDetailOrder } from '../../services/AdminOrderManagerService';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [error, setError] = useState(null);

  // Ánh xạ trạng thái đơn hàng sang tiếng Việt
  const translateOrderStatus = (status) => {
    const statusMap = {
      pending: 'Đang chờ',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  // Ánh xạ trạng thái thanh toán sang tiếng Việt
  const translatePaymentStatus = (status) => {
    const paymentMap = {
      paid: 'Đã thanh toán',
      unpaid: 'Chưa thanh toán',
    };
    return paymentMap[status] || status;
  };

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Lấy chi tiết đơn hàng từ API
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await getDetailOrder(orderId);
        console.log('Chi tiết đơn hàng:', response.data.result);
        setOrderDetail(response.data.result);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  // Khởi tạo DataTable cho bảng sản phẩm
  useEffect(() => {
    if (orderDetail && orderDetail.petDtoList) {
      const table = $('#orderItemsTable').DataTable({
        destroy: true,
        pageLength: 10,
        language: {
          emptyTable: 'Không có sản phẩm trong đơn hàng',
          info: 'Hiển thị _START_ đến _END_ của _TOTAL_ sản phẩm',
          lengthMenu: 'Hiển thị _MENU_ sản phẩm mỗi trang',
          search: 'Tìm kiếm:',
          paginate: {
            first: 'Đầu',
            last: 'Cuối',
            next: 'Tiếp',
            previous: 'Trước',
          },
        },
        data: orderDetail.petDtoList,
        columns: [
          { data: null, render: (data, type, row, meta) => meta.row + 1 },
          {
            data: null,
            render: (data, type, row) =>
              `<a href="/user/pet/${row.id}" style="color: blue; text-decoration: underline; cursor: pointer;">
                #${row.id} - ${row.name}
              </a>`,
          },
          { data: 'quantity' },
          { data: 'price', render: data => formatPrice(data) },
          {
            data: 'id',
            render: (data) =>
              `<a href="/user/pet/${data}" class="btn btn-primary btn-sm">Xem chi tiết</a>`,
          },
        ],
      });

      return () => {
        table.destroy();
      };
    }
  }, [orderDetail]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!orderDetail) return <div className="text-center">Đang tải...</div>;

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h4 style={{ color: '#007bff' }}>Chi tiết đơn hàng #{orderDetail.orderId}</h4>
        <div className="card">
          <div className="card-body">
            <div className="row">
              {/* Cột thông tin đơn hàng */}
              <div className="col-md-6">
                <h5 style={{ color: '#007bff' }}>Thông tin đơn hàng</h5>
                <p>
                  <strong>Thời gian:</strong> {formatDate(orderDetail.orderDate)}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  <span
                    style={{
                      color:
                        orderDetail.status === 'completed'
                          ? 'green'
                          : orderDetail.status === 'cancelled'
                          ? 'red'
                          : '#007bff',
                    }}
                  >
                    {translateOrderStatus(orderDetail.status)}
                  </span>
                </p>
                <p>
                  <strong>Thanh toán:</strong>{' '}
                  <span
                    style={{
                      color: orderDetail.paymentStatus === 'paid' ? 'green' : 'red',
                    }}
                  >
                    {translatePaymentStatus(orderDetail.paymentStatus)}
                  </span>
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{' '}
                  <span style={{ color: '#333' }}>{formatPrice(orderDetail.totalPrice)}</span>
                </p>
              </div>

              {/* Cột thông tin vận chuyển */}
              <div className="col-md-6">
                <h5 style={{ color: '#007bff' }}>Thông tin vận chuyển</h5>
                <p>
                  <strong>Người đặt:</strong> {orderDetail.shippingAddress || 'N/A'}
                </p>
                <p>
                  <strong>Địa chỉ giao:</strong> {orderDetail.shippingAddress}
                </p>
                <p>
                  <strong>Vận chuyển:</strong> {orderDetail.shippingName}
                </p>
                <p>
                  <strong>Phí vận chuyển:</strong> {formatPrice(orderDetail.priceShipping)}
                </p>
              </div>
            </div>

            {/* Bảng sản phẩm */}
            <div className="table-responsive mt-4">
              <h5 style={{ color: '#007bff' }}>Danh sách sản phẩm</h5>
              <table id="orderItemsTable" className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;