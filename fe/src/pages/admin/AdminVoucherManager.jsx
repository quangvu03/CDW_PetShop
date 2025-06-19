// src/pages/admin/AdminVoucherManager.jsx
import { useEffect } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';

const AdminVoucherManager = () => {
  useEffect(() => {
    $('#voucherTable').DataTable({
      language: {
        emptyTable: 'Không có dữ liệu để hiển thị',
        lengthMenu: 'Hiển thị _MENU_ dòng',
        zeroRecords: 'Không tìm thấy kết quả phù hợp',
        info: '',
        infoEmpty: '',
        infoFiltered: '',
        search: 'Tìm kiếm:',
        paginate: {
          previous: '‹',
          next: '›',
          first: '«',
          last: '»',
        },
      },
    });
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
            <h5 className="card-title">Danh sách voucher/khuyến mãi</h5>
            <button className="btn btn-success mb-3">Thêm voucher</button>
            <div className="table-responsive">
              <table id="voucherTable" className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã</th>
                    <th>Giảm (%)</th>
                    <th>Lần dùng tối đa</th>
                    <th>Đã dùng</th>
                    <th>Hạn sử dụng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>SUMMER10</td>
                    <td>10%</td>
                    <td>100</td>
                    <td>25</td>
                    <td>2025-08-01</td>
                    <td>
                      <button className="btn btn-success btn-sm mr-2">Sửa</button>
                      <button className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>WELCOME20</td>
                    <td>20%</td>
                    <td>200</td>
                    <td>89</td>
                    <td>2025-12-31</td>
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

export default AdminVoucherManager;
