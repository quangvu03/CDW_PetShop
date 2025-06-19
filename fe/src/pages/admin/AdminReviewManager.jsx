import { useEffect, useState } from 'react';
import $ from 'jquery';
import DateRangePicker from '../../components/common/DateRangePicker';
import { getAllReportedComments, unreportComment } from '../../services/AdminCommentManagerService';
import { deleteComment } from '../../services/commentService.js';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminReviewManager = () => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    getAllReportedComments()
      .then((response) => {
        setComments(response.data || []);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy bình luận:', error);
        setComments([]);
        toast.error('Lỗi khi tải dữ liệu bình luận!');
      })
  }, []);
  useEffect(() => {
    if (comments.length === 0) return;
  
    // Nếu bảng đã được khởi tạo => hủy trước
    if ($.fn.DataTable.isDataTable('#reviewTable')) {
      $('#reviewTable').DataTable().destroy();
    }
  
    // Đợi DOM cập nhật xong mới khởi tạo lại DataTable
    setTimeout(() => {
      $('#reviewTable').DataTable({
        pageLength: 10,
        searching: true,
        ordering: true,
        language: {
          emptyTable: 'Không có dữ liệu để hiển thị',
          lengthMenu: 'Hiển thị _MENU_ dòng',
          zeroRecords: 'Không tìm thấy kết quả phù hợp',
          info: '',
          infoEmpty: '',
          search: 'Tìm kiếm:',
          paginate: {
            previous: '‹',
            next: '›',
            first: '«',
            last: '»',
          },
        },
      });
      
      
    }, 100);
  }, [comments]);

  const handleCheck = (commentId) => {
    unreportComment(commentId)
      .then(() => {
        toast.success(`Đã bỏ báo cáo bình luận ID: ${commentId}`);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => {
        console.error('Lỗi khi bỏ báo cáo bình luận:', error);
        toast.error('Lỗi khi bỏ báo cáo bình luận!');
      });
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      deleteComment(commentId)
        .then(() => {
          toast.success(`Đã xóa bình luận ID: ${commentId}`);
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
        })
        .catch((error) => {
          console.error('Lỗi khi xóa bình luận:', error);
          toast.error('Lỗi khi xóa bình luận!');
        });
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    getAllReportedComments()
      .then((response) => {
        let filteredComments = response.data || [];
        if (status !== 'all') {
          filteredComments = filteredComments.filter(
            (comment) => comment.status === status
          );
        }
        setComments(filteredComments);
      })
      .catch((error) => {
        console.error('Lỗi khi lọc bình luận:', error);
        toast.error('Lỗi khi lọc dữ liệu bình luận!');
      });
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
      <form id="filterForm" onSubmit={handleFilterSubmit}>
  <DateRangePicker />

  <div
    className="d-flex mt-3"
    style={{
      width: '472px',
      gap: '8px',
    }}
  >
    {/* Ô TẤT CẢ */}
    <div style={{ flex: '0 0 384px' }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="form-control"
        style={{
          backgroundColor: '#3d9a94',
          color: '#fff',
          border: '1px solid #2f807a',
          borderRadius: '4px',
          fontSize: '15px',
        }}
      >
        <option value="all">Tất cả</option>
        <option value="pending">Chờ xử lý</option>
        <option value="resolved">Đã xử lý</option>
      </select>
    </div>

    {/* NÚT LỌC */}
    <div style={{ flex: '0 0 100px', alignSelf: 'stretch', marginLeft:'20px', height: '39px' }}>
      <button
        type="submit"
        className="btn w-100 h-100"
        style={{
          backgroundColor: '#3d9a94',
          color: '#fff',
          border: '1px solid #2f807a',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        Lọc
      </button>
    </div>
  </div>
</form>


        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Danh sách bình luận bị báo cáo</h5>
            <div className="table-responsive">
              <table id="reviewTable" className="table table-striped admin-review-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Người dùng</th>
                    <th>ID thú cưng</th>
                    <th>Bình luận</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <select className="form-control" disabled>
                          <option>Không có dữ liệu</option>
                        </select>
                      </td>
                    </tr>
                  ) : (
                    comments.map((comment, index) => (
                      <tr key={comment.id || index}>
                        <td>{comment.id}</td>
                        <td>{comment.username || 'N/A'}</td>

                        {/* <td>
                          {comment.petId ? (
                            <Link to={`/user/pet/${comment.petId}`}>
                              {comment.petId}
                            </Link>
                          ) : 'N/A'}
                        </td> */}
                        


<td>
  {comment.petId ? (
    <a
      href={`/user/pet/${comment.petId}`}
      style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer' }}
    >
      {comment.petId}
    </a>
  ) : 'N/A'}
</td>

                        <td>{comment.content || 'N/A'}</td>
                        <td>
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm mr-2"
                            onClick={() => handleCheck(comment.id)}
                          >
                            Check
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(comment.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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