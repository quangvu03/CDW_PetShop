import { useEffect } from 'react';
import $ from 'jquery';

const AdminCategoryManager = () => {
  useEffect(() => {
    $('#catalogsTable').DataTable();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 mb-3">
            <button className="btn btn-primary">
              <a href="#" className="text-white text-decoration-none">Thêm chuyên mục</a>
            </button>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Danh sách chuyên mục</h5>
                <div className="table-responsive">
                  <table id="catalogsTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên chuyên mục</th>
                        <th>Phân loại</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Chó cảnh</td>
                        <td>Thú cưng</td>
                        <td>
                          <button className="btn btn-danger btn-sm mr-2">
                            <a href="#" className="text-white">Xóa</a>
                          </button>
                          <button className="btn btn-success btn-sm">
                            <a href="#" className="text-white">Sửa</a>
                          </button>
                        </td>
                      </tr>
                      {/* Thêm các dòng khác nếu cần */}
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

export default AdminCategoryManager;
