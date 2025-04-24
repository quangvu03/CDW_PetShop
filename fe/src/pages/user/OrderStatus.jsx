import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';


export default function OrderManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    // Init main table
    $('#example').DataTable();

    // Fake click event to show modal for now
    $('.clickTR').on('click', () => {
      setShowModal(true);
      // TODO: Fetch order details here
      setOrderDetails([
        {
          name: 'Thú cưng A',
          size: 'L',
          quantity: 2,
          price: 1.5,
          total: 3.0,
        },
      ]);
    });

    return () => {
      $('.clickTR').off('click');
    };
  }, []);

  return (
    <section className="container_status">
      <h3 style={{ textAlign: 'center', position: 'relative' }}>Đơn hàng của bạn</h3>
      <table id="example" className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ghi chú</th>
            <th>Tổng tiền</th>
            <th>Địa chỉ</th>
            <th>Thời gian đặt</th>
            <th>Trạng thái đơn hàng</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái thanh toán</th>
            <th>Hoá đơn</th>
          </tr>
        </thead>
        <tbody>
          <tr data-id="1" className="clickTR" style={{ cursor: 'pointer' }}>
            <td>1</td>
            <td>Nguyễn Văn A</td>
            <td>0123456789</td>
            <td>test@email.com</td>
            <td>Giao trước 5h</td>
            <td>3 triệu</td>
            <td>Thủ Đức, HCM</td>
            <td>2025-04-18 10:30</td>
            <td>Đang xác nhận</td>
            <td>COD</td>
            <td>Chưa thanh toán</td>
            <td>Chỉ có khi thanh toán xong</td>
          </tr>
        </tbody>
      </table>

      {showModal && (
        <div>
          <div className="overlay" onClick={() => setShowModal(false)}></div>
          <div
            id="dialog-message"
            style={{
              position: 'fixed',
              top: '15%',
              left: '15%',
              zIndex: 999,
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              width: '70%',
            }}
          >
            <button
              id="btnClose"
              onClick={() => setShowModal(false)}
              style={{ float: 'right', border: 'none', background: 'transparent', fontSize: '20px' }}
            >
              ✖
            </button>
            <h3>Chi tiết đơn hàng</h3>
            <table className="display" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thú cưng</th>
                  <th>Kích thước</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price} triệu</td>
                    <td>{item.total} triệu</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
