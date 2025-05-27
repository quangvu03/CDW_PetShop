import { useState } from 'react';
import Swal from 'sweetalert2';
import { createUser } from '../../services/AdminUserManagerService'; // Import the createUser service

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (formData.username.length < 4) {
      setError('Tên đăng nhập phải có ít nhất 4 ký tự.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Tên đăng nhập phải có ít nhất 4 ký tự.',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu phải có ít nhất 4 ký tự.',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Địa chỉ email không hợp lệ.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Địa chỉ email không hợp lệ.',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await createUser(formData);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm người dùng thành công!',
          confirmButtonText: 'OK',
        });
        setFormData({
          username: '',
          email: '',
          password: '',
        });
      } else {
        throw new Error(response.message || 'Đã xảy ra lỗi khi thêm người dùng.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi thêm người dùng.';
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .form-control {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          .form-control:focus {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
        `}
      </style>
      <section
        className="vh-100"
        style={{ backgroundColor: 'rgb(7, 144, 131)', paddingTop: '100px' }}
      >
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-6">
              <h1 className="text-white mb-4">Thêm Người Dùng Mới</h1>
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Tên đăng nhập</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="text"
                          name="username"
                          className="form-control form-control-lg"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Địa chỉ email</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg"
                          placeholder="example@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Mật khẩu</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-lg"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="px-5 py-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? 'Đang gửi...' : 'Thêm người dùng'}
                      </button>
                    </div>

                    {error && <p className="text-danger text-center">{error}</p>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminAddUser;