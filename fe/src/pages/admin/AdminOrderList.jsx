// src/pages/admin/AdminOrderList.jsx
import { useEffect, useState } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminOrderList = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    $('#orderTable').DataTable();
  }, [orders]);

  const handleFilter = () => {
    // Gửi API hoặc lọc local theo thời gian
    console.log("Lọc đơn hàng từ", startDate, "đến", endDate);
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h5 className="card-title">Danh sách đơn hàng</h5>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />

        <button className="btn btn-primary" onClick={handleFilter}>Lọc</button>

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
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.user_id}</td>
                      <td>{order.order_date}</td>
                      <td>{order.total_price} ₫</td>
                      <td>{order.status}</td>
                      <td>{order.payment_status}</td>
                      <td>{order.shipping_method}</td>
                      <td>
                        <a href={`/admin/orders/${order.id}`} className="btn btn-info btn-sm">Chi tiết</a>
                      </td>
                    </tr>
                  ))}
                  {/* Thêm dữ liệu giả để demo */}
                  <tr>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>2025-05-22 12:00</td>
                    <td>2.000.000 ₫</td>
                    <td>confirmed</td>
                    <td>paid</td>
                    <td>Giao nhanh</td>
                    <td><a href="/admin/orders/1" className="btn btn-info btn-sm">Chi tiết</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;
