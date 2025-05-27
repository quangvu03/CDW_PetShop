import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5'; // Nếu dùng Bootstrap 5
import DateRangePicker from '../../components/common/DateRangePicker';
import { getAllUsers } from '../../services/AdminUserManagerService'; // Đường dẫn tới file service
import Swal from 'sweetalert2'; // Thêm SweetAlert2 để hiển thị thông báo lỗi
import { Link } from 'react-router-dom';


const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message,
        confirmButtonText: 'OK',
      });
      if (err.message.includes('Token không hợp lệ') || err.message.includes('Bạn không có quyền')) {
        // Chuyển hướng về trang đăng nhập nếu cần
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo DataTable và datepicker
  useEffect(() => {
    fetchUsers(); // Gọi API khi component mount

    $(function () {
      const table = $('#userTable').DataTable({
        destroy: true, // Cho phép khởi tạo lại DataTable
        pageLength: 10,
        language: {
          emptyTable: 'Không có dữ liệu người dùng',
          loadingRecords: 'Đang tải...',
          zeroRecords: 'Không tìm thấy người dùng phù hợp',
        },
      });

      $('#startDate, #endDate').datepicker({
        dateFormat: 'dd-mm-yy',
      });

      return () => {
        table.destroy(); // Hủy DataTable khi component unmount
      };
    });
  }, []);

  // Cập nhật DataTable khi dữ liệu users thay đổi
  useEffect(() => {
    if (users.length > 0) {
      const table = $('#userTable').DataTable();
      table.clear(); // Xóa dữ liệu cũ
      users.forEach((user, index) => {
        table.row.add([
          index + 1,
          user.fullName || 'N/A',
          user.email || 'N/A',
          user.phone || 'N/A',
          user.address || 'N/A',
          user.role || 'N/A',
          `
            <button className="btn btn-danger btn-sm mx-1" onclick="deleteUser(${user.id})">Xóa</button>
            <a class="btn btn-warning btn-sm mx-1" href="/admin/updateUser/${user.id}">Sửa</a>
          `,
        ]);
      });
      table.draw(); // Vẽ lại bảng
    }
  }, [users]);

  // Hàm xử lý xóa người dùng (chỉ là ví dụ, cần implement API)
  window.deleteUser = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Xác nhận',
      text: `Bạn có chắc muốn xóa người dùng ID ${id}?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        // Gọi API xóa người dùng (cần implement)
        console.log(`Xóa người dùng ID: ${id}`);
        fetchUsers(); // Tải lại danh sách
      }
    });
  };

  // Hàm xử lý sửa người dùng (chỉ là ví dụ, cần implement)
  window.editUser = (id) => {
    console.log(`Sửa người dùng ID: ${id}`);
    // Chuyển hướng hoặc mở form sửa
  };

  // Xử lý submit form lọc
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const filterStatus = $('#filterStatus').val();
    console.log('Lọc:', { startDate, endDate, filterStatus });
    // Gọi lại API với tham số lọc (cần implement API tương ứng)
    // Ví dụ: getAllUsers({ startDate, endDate, filterStatus });
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <form onSubmit={handleFilterSubmit}>
          <DateRangePicker />
          <div className="row mt-3">
            <div className="col-lg-3">
              <label htmlFor="filterStatus">Lọc theo:</label>
              <select name="filterStatus" id="filterStatus" className="form-control">
                <option value="has-orders">Có đơn hàng</option>
                <option value="no-orders">Không có đơn hàng</option>
              </select>
            </div>
            <div className="col-lg-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary">Lọc</button>
            </div>
          </div>
        </form>
      </div>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-12 mb-3">
      <Link to="/admin/adduser" className="btn btn-success text-white text-decoration-none">
        Thêm User
      </Link>
          </div>
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Danh sách User</h5>
                {loading && <p>Đang tải dữ liệu...</p>}
                {error && <p className="text-danger">{error}</p>}
                <div className="table-responsive">
                  <table id="userTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Role</th>
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
      </div>
    </div>
  );
};

export default AdminUserManager;