import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import DateRangePicker from '../../components/common/DateRangePicker';
import { getAllPets, updateOrderStatus } from '../../services/AdminOrderManagerService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const AdminOrderList = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [originalOrders, setOriginalOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filterMessage, setFilterMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // Tab hiện tại: all, pending, confirmed, shipped, completed, cancelled

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

  // Lấy dữ liệu đơn hàng từ API
  const fetchOrders = async () => {
    try {
      const response = await getAllPets();
      console.log('Dữ liệu đơn hàng nhận được:', response.data);
      setOriginalOrders(response.data);
      setOrders(activeTab === 'all' ? response.data : response.data.filter(order => order.status === activeTab));
      setError(null);
      setFilterMessage(null);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    }
  };

  // Lấy dữ liệu khi component mount hoặc tab thay đổi
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Xử lý chuyển trạng thái đơn hàng
  const handleChangeStatus = async (orderId, currentStatus) => {
    let nextStatus;
    let confirmMessage;
    let paymentStatus;

    switch (currentStatus) {
      case 'pending':
        nextStatus = 'confirmed';
        confirmMessage = 'Bạn có muốn xác nhận đơn hàng này không?';
        break;
      case 'confirmed':
        nextStatus = 'shipped';
        confirmMessage = 'Bạn có muốn chuyển đơn hàng này sang trạng thái đang giao không?';
        break;
      case 'shipped':
        nextStatus = 'completed';
        confirmMessage = 'Bạn có muốn đánh dấu đơn hàng này là hoàn thành không?';
        paymentStatus = 'paid'; // Tự động cập nhật trạng thái thanh toán thành "Đã thanh toán" khi hoàn thành
        break;
      default:
        toast.error('Không thể chuyển trạng thái từ trạng thái hiện tại.');
        return;
    }

    const result = await Swal.fire({
      title: confirmMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      try {
        const response = await updateOrderStatus(orderId, nextStatus, paymentStatus);
        console.log('Update status response:', response.data);
        if (response.data.result) {
          toast.success('Cập nhật trạng thái đơn hàng thành công');
          await fetchOrders(); // Làm mới danh sách đơn hàng
        } else {
          toast.error('Cập nhật trạng thái đơn hàng thất bại');
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
      }
    }
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Bạn có muốn hủy đơn hàng này không?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, hủy đơn hàng',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      try {
        const response = await updateOrderStatus(orderId, 'cancelled');
        console.log('Cancel order response:', response.data);
        if (response.data.result) {
          toast.success('Hủy đơn hàng thành công');
          await fetchOrders(); // Làm mới danh sách đơn hàng
        } else {
          toast.error('Hủy đơn hàng thất bại');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
      }
    }
  };

  // Khởi tạo DataTable khi orders thay đổi
  useEffect(() => {
    const table = $('#orderTable').DataTable({
      destroy: true,
      pageLength: 10,
      language: {
        emptyTable: 'Không có dữ liệu đơn hàng',
        info: 'Hiển thị _START_ đến _END_ của _TOTAL_ đơn hàng',
        lengthMenu: 'Hiển thị _MENU_ đơn hàng mỗi trang',
        search: 'Tìm kiếm:',
        paginate: {
          first: 'Đầu',
          last: 'Cuối',
          next: 'Tiếp',
          previous: 'Trước',
        },
      },
      data: orders,
      columns: [
        { data: null, render: (data, type, row, meta) => meta.row + 1 },
        { data: 'shippingAddress', defaultContent: 'N/A' },
        { data: 'orderDate', render: data => formatDate(data) },
        { data: 'totalPrice', render: data => formatPrice(data) },
        { data: 'status', render: data => translateOrderStatus(data) },
        { data: 'paymentStatus', render: data => translatePaymentStatus(data) },
        { data: 'shippingName' },
        {
          data: null,
          render: (data, type, row) => {
            let actions = `<a href="/admin/orders/${row.id}" class="btn btn-info btn-sm me-1">Chi tiết</a>`;
            // Nút chuyển trạng thái
            if (row.status === 'pending') {
              actions += `<button class="btn btn-primary btn-sm me-1" data-action="change-status" data-id="${row.id}" data-status="${row.status}">Xác nhận</button>`;
              actions += `<button class="btn btn-danger btn-sm" data-action="cancel-order" data-id="${row.id}">Hủy</button>`;
            } else if (row.status === 'confirmed') {
              actions += `<button class="btn btn-primary btn-sm me-1" data-action="change-status" data-id="${row.id}" data-status="${row.status}">Giao hàng</button>`;
              actions += `<button class="btn btn-danger btn-sm" data-action="cancel-order" data-id="${row.id}">Hủy</button>`;
            } else if (row.status === 'shipped') {
              actions += `<button class="btn btn-primary btn-sm" data-action="change-status" data-id="${row.id}" data-status="${row.status}">Hoàn thành</button>`;
            }
            return actions;
          },
        },
      ],
      // Xử lý sự kiện click cho các nút hành động
      createdRow: (row, data) => {
        $(row).find('[data-action="change-status"]').on('click', () => {
          handleChangeStatus(data.id, data.status);
        });
        $(row).find('[data-action="cancel-order"]').on('click', () => {
          handleCancelOrder(data.id);
        });
      },
    });

    return () => {
      table.destroy();
    };
  }, [orders]);

  // Hàm lọc đơn hàng theo khoảng thời gian
  const handleFilter = () => {
    console.log('Lọc đơn hàng từ:', startDate, 'đến:', endDate);
    if (!startDate || !endDate) {
      setFilterMessage('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
      return;
    }

    let start = startDate instanceof Date ? startDate : new Date(startDate);
    let end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Ngày không hợp lệ:', { startDate, endDate });
      setFilterMessage('Định dạng ngày không hợp lệ. Vui lòng chọn lại.');
      return;
    }

    const filteredOrders = originalOrders
      .filter(order => activeTab === 'all' || order.status === activeTab)
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });

    if (filteredOrders.length === 0) {
      setFilterMessage('Không có đơn hàng nào trong khoảng thời gian đã chọn.');
    } else {
      setFilterMessage(`Đã tìm thấy ${filteredOrders.length} đơn hàng.`);
    }

    setOrders(filteredOrders);
  };

  // Hàm hủy lọc
  const handleResetFilter = () => {
    if (!startDate && !endDate) return;
    console.log('Hủy lọc');
    setStartDate('');
    setEndDate('');
    setFilterMessage(null);
    setOrders(activeTab === 'all' ? originalOrders : originalOrders.filter(order => order.status === activeTab));
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

  // Kiểm tra ngày hợp lệ cho nút lọc
  const isFilterDisabled = !startDate || !endDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime());

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h5 className="card-title">Danh sách đơn hàng</h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {filterMessage && (
          <div className={filterMessage.includes('Không') ? 'alert alert-warning' : 'alert alert-info'}>
            {filterMessage}
          </div>
        )}

        {/* Tabs cho trạng thái đơn hàng */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('pending')}
            >
              Đang chờ
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'confirmed' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('confirmed')}
            >
              Đã xác nhận
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'shipped' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('shipped')}
            >
              Đang giao
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('completed')}
            >
              Hoàn thành
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveTab('cancelled')}
            >
              Đã hủy
            </a>
          </li>
        </ul>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            console.log('Ngày chọn:', { start, end });
            setStartDate(start);
            setEndDate(end);
            setFilterMessage(null);
          }}
        />

        <div className="mt-2">
          <button
            className="btn btn-primary me-2"
            onClick={handleFilter}
            disabled={isFilterDisabled}
          >
            Lọc
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleResetFilter}
            disabled={!startDate && !endDate}
          >
            Hủy lọc
          </button>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="table-responsive">
              <table id="orderTable" className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Người đặt</th>
                    <th>Thời gian</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Hình thức giao</th>
                    <th>Hành động</th>
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

export default AdminOrderList;