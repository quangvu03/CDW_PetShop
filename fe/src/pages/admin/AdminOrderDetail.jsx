// src/pages/admin/AdminOrderDetail.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';

const AdminOrderDetail = () => {
  const { orderId } = useParams();

  useEffect(() => {
    $('#orderItemsTable').DataTable();
  }, []);

  // Fake data for now
  const orderInfo = {
    id: orderId,
    user: 'Nguyen Van A',
    date: '2024-05-22 14:30',
    total: '2,000,000đ',
    paymentStatus: 'Paid',
    shippingMethod: 'Giao nhanh',
    address: '123 ABC, TP.HCM',
    status: 'Shipped'
  };

  const items = [
    { id: 1, name: 'Chó Poodle', quantity: 1, price: '1,200,000đ' },
    { id: 2, name: 'Mèo Anh lông ngắn', quantity: 1, price: '800,000đ' }
  ];

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h4>Chi tiết đơn hàng #{orderInfo.id}</h4>
        <div className="card">
          <div className="card-body">
            <p><strong>Người đặt:</strong> {orderInfo.user}</p>
            <p><strong>Thời gian:</strong> {orderInfo.date}</p>
            <p><strong>Trạng thái:</strong> {orderInfo.status}</p>
            <p><strong>Thanh toán:</strong> {orderInfo.paymentStatus}</p>
            <p><strong>Vận chuyển:</strong> {orderInfo.shippingMethod}</p>
            <p><strong>Địa chỉ giao:</strong> {orderInfo.address}</p>
            <p><strong>Tổng tiền:</strong> {orderInfo.total}</p>

            <div className="table-responsive">
              <table id="orderItemsTable" className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
