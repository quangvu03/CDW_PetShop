// src/pages/admin/AdminBrowsingHistory.jsx
import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminBrowsingHistory = () => {
  useEffect(() => {
    $('#historyTable').DataTable();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <form id="filterForm" method="get">
          <DateRangePicker />
          <button type="submit" className="btn btn-primary ml-2 mt-4">Lọc</button>
        </form>

        <div className="row mt-3">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Lịch sử duyệt sản phẩm</h5>
                <div className="table-responsive">
                  <table id="historyTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User ID</th>
                        <th>Product ID</th>
                        <th>Viewed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>101</td>
                        <td>5</td>
                        <td>2025-05-23 14:12</td>
                      </tr>
                      {/* Map thêm dữ liệu tại đây */}
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

export default AdminBrowsingHistory;
