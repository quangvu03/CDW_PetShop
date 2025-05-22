import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminUserManager = () => {
  useEffect(() => {
    $(function () {
      $('#userTable').DataTable({
      });
      $('#startDate, #endDate').datepicker({
        dateFormat: 'dd-mm-yy',
      });
    });
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <form method="get">
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
            <button className="btn btn-success">
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Thêm User</a>
            </button>
          </div>
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Danh sách User</h5>
                <div className="table-responsive">
                  <table id="userTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Nguyễn Văn A</td>
                        <td>email@example.com</td>
                        <td>0123456789</td>
                        <td>Hà Nội</td>
                        <td>
                          <button className="btn btn-danger btn-sm mx-1">Xóa</button>
                          <button className="btn btn-warning btn-sm mx-1">Sửa</button>
                        </td>
                      </tr>
                      {/* Thêm nhiều dòng nếu cần */}
                    </tbody>
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
