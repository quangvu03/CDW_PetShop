import { useEffect } from 'react';
import $ from 'jquery';

const AdminPetList = () => {
  useEffect(() => {
    $('#petTable').DataTable(); // Không cần truyền language nữa
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-12">
            <button className="add-catalog">
              <a href="/admin/addsanpham">Thêm thú cưng</a>
            </button>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Danh sách thú cưng</h5>
                <div className="table-responsive">
                  <table id="petTable" className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên thú cưng</th>
                        <th>Kích thước</th>
                        <th>Giới tính</th>
                        <th>Thông tin cơ bản</th>
                        <th>Thông tin cụ thể</th>
                        <th>Xuất xứ</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Ngày sinh</th>
                        <th>Ảnh</th>
                        <th>Loại</th>
                        <th>Chuyên mục</th>
                        <th>Hành động</th>
                        <th>Bình luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Bella</td>
                        <td>Nhỏ</td>
                        <td>♀</td>
                        <td>Dễ thương, ngoan</td>
                        <td>Chi tiết thêm...</td>
                        <td>Việt Nam</td>
                        <td>5</td>
                        <td>2.000.000₫</td>
                        <td>01/01/2023</td>
                        <td>
                          <img src="/assets/images/pet.jpg" alt="Thú cưng" width="100" height="100" />
                        </td>
                        <td>Chó</td>
                        <td>Phổ biến</td>
                        <td>
                          <button className="btn btn-danger btn-sm mr-2">
                            <a href="/admin/delete/1" className="text-white">Xóa</a>
                          </button>
                          <button className="btn btn-success btn-sm">
                            <a href="/admin/edit/1" className="text-white">Sửa</a>
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-warning btn-sm">
                            <a href="/admin/comments/1" className="text-white">Bình luận</a>
                          </button>
                        </td>
                      </tr>
                      {/* Render thêm các hàng ở đây nếu có dữ liệu */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overlay toggle-menu"></div>
      </div>
    </div>
  );
};

export default AdminPetList;
