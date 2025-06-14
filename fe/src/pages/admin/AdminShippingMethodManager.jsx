import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { getAllShippingMethods } from '../../services/AdminShippingManagerService';
import { toast } from 'react-toastify';

const AdminShippingMethodManager = () => {
  const navigate = useNavigate();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [error, setError] = useState(null);

  // Lấy danh sách phương thức vận chuyển từ API
  const fetchShippingMethods = async () => {
    try {
      const response = await getAllShippingMethods();
      console.log('Dữ liệu phương thức vận chuyển:', response.data);
      setShippingMethods(response.data);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy phương thức vận chuyển:', error);
      setError('Không thể tải danh sách phương thức vận chuyển. Vui lòng thử lại.');
      toast.error('Không thể tải danh sách phương thức vận chuyển.');
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchShippingMethods();
  }, []);

  // Khởi tạo DataTable khi shippingMethods thay đổi
  useEffect(() => {
    const table = $('#shippingTable').DataTable({
      destroy: true,
      pageLength: 10,
      language: {
        emptyTable: 'Không có dữ liệu phương thức vận chuyển',
        info: 'Hiển thị _START_ đến _END_ của _TOTAL_ phương thức',
        lengthMenu: 'Hiển thị _MENU_ phương thức mỗi trang',
        search: 'Tìm kiếm:',
        paginate: {
          first: 'Đầu',
          last: 'Cuối',
          next: 'Tiếp',
          previous: 'Trước',
        },
      },
      data: shippingMethods,
      columns: [
        { data: null, render: (data, type, row, meta) => meta.row + 1 },
        { data: 'name', defaultContent: 'N/A' },
        { data: 'description', defaultContent: 'N/A' },
        {
          data: 'price',
          render: data => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data),
        },
        { data: 'estimatedTime', defaultContent: 'N/A' },
        {
          data: 'id',
          render: data => `
            <button class="btn btn-success btn-sm me-2" data-id="${data}" data-action="edit">Sửa</button>
            <button class="btn btn-danger btn-sm" data-id="${data}" data-action="delete">Xóa</button>
          `,
        },
      ],
      createdRow: (row, data) => {
        $(row).find('[data-action="edit"]').on('click', () => {
          console.log('Sửa phương thức vận chuyển:', data.id);
          navigate(`/admin/editShipping/${data.id}`);
        });
        $(row).find('[data-action="delete"]').on('click', () => {
          console.log('Xóa phương thức vận chuyển:', data.id);
          toast.info('Chức năng xóa đang được phát triển');
        });
      },
    });

    return () => {
      table.destroy();
    };
  }, [shippingMethods, navigate]);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h5 className="card-title">Danh sách phương thức vận chuyển</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mt-2">
          <Link
            to="/admin/addShipping"
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Thêm
          </Link>
        </div>

        <div className="card mt-3">
          <div className="card-body">
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
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShippingMethodManager;