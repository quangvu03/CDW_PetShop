import { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { getAllPets } from '../../services/AdminPetManagerService';
import { Link } from 'react-router-dom';


const AdminPetList = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getAllPets();
        setPets(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (!tableRef.current) return;

    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    dataTableRef.current = $(tableRef.current).DataTable({
      data: pets,
      columns: [
        { data: 'id' },
        {
          data: 'name',
          render: (data, type, row) => `
            <a href="http://localhost:3000/user/pet/${row.id}" class="text-primary">${data}</a>
          `,
        },
        {
          data: 'imageUrl',
          render: (data, type, row) =>
            `<img src="http://localhost:8080/${data}" alt="${row.name}" width="100" height="100" onerror="this.src='/assets/images/pet.jpg'" />`,
        },
        { data: 'size' },
        { data: 'gender', render: (data) => (data === 'male' ? '♂' : '♀') },
        { data: 'description' },
        { data: 'color', render: (data) => `Màu: ${data}` },
        { data: 'origin' },
        { data: 'quantity' },
        {
          data: 'price',
          render: (data) =>
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(data),
        },
        {
          data: 'age',
          render: (data) => {
            const currentYear = new Date().getFullYear();
            return `01/01/${currentYear - data}`;
          },
        },
        { data: 'species' },
        { data: 'breed' },
        {
          data: 'id',
          render: (data) => `
            <button class="btn btn-danger btn-sm mr-2">
              <a href="/admin/delete/${data}" class="text-white">Xóa</a>
            </button>
            <button class="btn btn-success btn-sm">
              <a href="/admin/updatepet/${data}" class="text-white">Sửa</a>
            </button>
          `,
        },
        {
          data: 'id',
          render: (data) => `
            <button class="btn btn-warning btn-sm">
              <a href="/admin/comments/${data}" class="text-white">Bình luận</a>
            </button>
          `,
        },
      ],
      pageLength: 10,
      paging: true,
      searching: true,
      ordering: true,
      destroy: true,
      language: {
        paginate: {
          first: 'Đầu',
          last: 'Cuối',
          next: 'Sau',
          previous: 'Trước',
        },
        search: 'Tìm kiếm:',
        lengthMenu: 'Hiển thị _MENU_ bản ghi',
        info: 'Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi',
        infoEmpty: 'Không có bản ghi nào',
        emptyTable: 'Không có dữ liệu trong bảng',
      },
    });

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [pets]);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row mt-3">
        <div className="col-lg-12">
          <Link to="/admin/addPet" className="btn btn-success add-catalog">
            Thêm thú cưng
          </Link>
        </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Danh sách thú cưng</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table
                    id="petTable"
                    className="table table-striped"
                    ref={tableRef}
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên thú cưng</th>
                        <th>Ảnh</th>
                        <th>Kích thước</th>
                        <th>Giới tính</th>
                        <th>Thông tin cơ bản</th>
                        <th>Thông tin cụ thể</th>
                        <th>Xuất xứ</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Ngày sinh</th>
                        <th>Loại</th>
                        <th>Chuyên mục</th>
                        <th>Hành động</th>
                        <th>Bình luận</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
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