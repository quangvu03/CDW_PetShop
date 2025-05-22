// src/pages/admin/AdminReviewManager.jsx
import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminReviewManager = () => {
  useEffect(() => {
    $('#reviewTable').DataTable();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <form id="filterForm" method="get">
          <DateRangePicker />
          <button type="submit" className="btn btn-primary ml-2 mt-4">Lọc</button>
        </form>

        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Danh sách đánh giá sản phẩm</h5>
            <div className="table-responsive">
              <table id="reviewTable" className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Người dùng</th>
                    <th>ID sản phẩm</th>
                    <th>ID thú cưng</th>
                    <th>Đánh giá</th>
                    <th>Bình luận</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>123</td>
                    <td>456</td>
                    <td>5</td>
                    <td>Sản phẩm tuyệt vời!</td>
                    <td>2025-05-23</td>
                    <td>
                      <button className="btn btn-danger btn-sm">Xóa</button>
                    </td>
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

export default AdminReviewManager;
