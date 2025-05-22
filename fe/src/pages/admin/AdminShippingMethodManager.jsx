import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminShippingMethodManager = () => {
  useEffect(() => {
    $('#shippingTable').DataTable();
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
            <h5 className="card-title">Danh sách phương thức vận chuyển</h5>
            <div className="table-responsive">
              <table id="shippingTable" className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên phương thức</th>
                    <th>Mô tả</th>
                    <th>Giá (VNĐ)</th>
                    <th>Thời gian dự kiến</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Giao hàng tiêu chuẩn</td>
                    <td>Giao hàng trong 3-5 ngày làm việc</td>
                    <td>30.000</td>
                    <td>3-5 ngày</td>
                    <td>
                      <button className="btn btn-success btn-sm mr-2">Sửa</button>
                      <button className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Giao hàng nhanh</td>
                    <td>Giao trong 1-2 ngày làm việc</td>
                    <td>50.000</td>
                    <td>1-2 ngày</td>
                    <td>
                      <button className="btn btn-success btn-sm mr-2">Sửa</button>
                      <button className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Giao hàng hỏa tốc</td>
                    <td>Giao trong ngày cho đơn trước 10h sáng</td>
                    <td>100.000</td>
                    <td>Trong ngày</td>
                    <td>
                      <button className="btn btn-success btn-sm mr-2">Sửa</button>
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

export default AdminShippingMethodManager;
