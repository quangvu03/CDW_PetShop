// src/pages/admin/AdminCartManager.jsx
import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminCartManager = () => {
  useEffect(() => {
    $('#cartTable').DataTable();
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
                <h5 className="card-title">Danh sách sản phẩm trong giỏ hàng</h5>
                <div className="table-responsive">
                  <table id="cartTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User ID</th>
                        <th>Product ID</th>
                        <th>Số lượng</th>
                        <th>Thêm vào lúc</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>101</td>
                        <td>5</td>
                        <td>2</td>
                        <td>2025-05-23 14:35</td>
                      </tr>
                      {/* Thêm các dòng dữ liệu từ backend */}
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

export default AdminCartManager;
