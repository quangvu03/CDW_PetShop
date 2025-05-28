// src/components/AdminUpdateUser.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUserById, updateUserProfile } from '../../services/AdminUserManagerService';

const AdminUpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    gender: '',
    birthday: '',
    phone: '',
    country: '',
    district: '',
    ward: '',
    address: '',
    role: 'user',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch provinces
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getUserById(id);
        const addressParts = user.address ? user.address.split(', ').reverse() : ['', '', '', ''];
        setFormData({
          username: user.username || '',
          email: user.email || '',
          fullName: user.fullName || '',
          gender: user.gender || '',
          birthday: user.birthday ? user.birthday.split('T')[0] : '', // Chuyển sang yyyy-MM-dd
          phone: user.phone || '',
          country: addressParts[0] || '',
          district: addressParts[1] || '',
          ward: addressParts[2] || '',
          address: addressParts[3] || '',
          role: user.role || 'user',
        });
        setAvatarPreview(user.avatar ? `http://localhost:8080/uploads/avatars/${user.avatar}` : null);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.message || 'Không thể tải thông tin người dùng',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Update districts
  useEffect(() => {
    const selectedProvince = provinces.find((p) => p.name === formData.country);
    setDistricts(selectedProvince ? selectedProvince.districts : []);
    setFormData((prev) => ({ ...prev, district: '', ward: '' }));
  }, [formData.country, provinces]);

  // Update wards
  useEffect(() => {
    const selectedDistrict = districts.find((d) => d.name === formData.district);
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    setFormData((prev) => ({ ...prev, ward: '' }));
  }, [formData.district, districts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Kích thước tệp vượt quá 50MB!',
        confirmButtonText: 'OK',
      });
      return;
    }
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username) {
      setError('Tên đăng nhập là bắt buộc.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Tên đăng nhập là bắt buộc.',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    // Thêm username và role
    data.append('username', formData.username);
    data.append('role', formData.role || 'user');

    // Thêm các trường của UsersDto
    if (formData.fullName) data.append('fullName', formData.fullName);
    if (formData.gender) data.append('gender', formData.gender);
    if (formData.birthday) data.append('birthday', formData.birthday);
    if (formData.phone) data.append('phone', formData.phone); // Sử dụng 'phone' để khớp với UsersDto
    if (formData.address || formData.ward || formData.district || formData.country) {
      data.append('address', `${formData.address || ''}, ${formData.ward || ''}, ${formData.district || ''}, ${formData.country || ''}`);
    }
    // Chỉ gửi image nếu có file
    if (avatar) {
      data.append('image', avatar);
    }

    try {
      await updateUserProfile(data);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật thông tin người dùng thành công!',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/admin/users');
      });
      setAvatar(null);
      document.getElementById('formFileLg').value = null;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Đã xảy ra lỗi khi cập nhật người dùng.';
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
          select.form-control,
          select.form-control option {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          select.form-control:focus {
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
            <div className="col-xl-9">
              <h1 className="text-white mb-4">Cập nhật thông tin người dùng</h1>
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body">
                  {loading && <p>Đang tải dữ liệu...</p>}
                  {error && <p className="text-danger text-center">{error}</p>}
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row align-items-center pt-4 pb-3">
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
                          readOnly // Không cho sửa username
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Họ và tên</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="text"
                          name="fullName"
                          className="form-control form-control-lg"
                          value={formData.fullName}
                          onChange={handleInputChange}
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
                          disabled
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Giới tính</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <select
                          name="gender"
                          className="form-control form-control-lg"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Ngày sinh</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="date"
                          name="birthday"
                          className="form-control form-control-lg"
                          value={formData.birthday}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Số điện thoại</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="text"
                          name="phone"
                          className="form-control form-control-lg"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Tỉnh/Thành phố</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <select
                          name="country"
                          className="form-control form-control-lg"
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map((p) => (
                            <option key={p.code} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Quận/Huyện</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <select
                          name="district"
                          className="form-control form-control-lg"
                          value={formData.district}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((d) => (
                            <option key={d.code} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Xã/Phường</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <select
                          name="ward"
                          className="form-control form-control-lg"
                          value={formData.ward}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn xã/phường</option>
                          {wards.map((w) => (
                            <option key={w.code} value={w.name}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Địa chỉ cụ thể</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <input
                          type="text"
                          name="address"
                          className="form-control form-control-lg"
                          placeholder="Nhập địa chỉ cụ thể"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Vai trò</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        <select
                          name="role"
                          className="form-control form-control-lg"
                          value={formData.role}
                          onChange={handleInputChange}
                        >
                          <option value="user">Người dùng</option>
                          <option value="admin">Quản trị viên</option>
                          <option value="staff">Nhân viên</option>
                          <option value="vet">Bác sĩ thú y</option>
                        </select>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="row align-items-center py-3">
                      <div className="col-md-3 ps-5">
                        <h6 className="mb-0">Ảnh đại diện hiện tại</h6>
                      </div>
                      <div className="col-md-9 pe-5">
                        {avatarPreview && (
                          <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            style={{ maxWidth: '100px', marginBottom: '10px' }}
                          />
                        )}
                        <input
                          className="form-control form-control-lg"
                          id="formFileLg"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <div className="small text-muted mt-2">
                          Tải lên ảnh đại diện mới. Kích thước tối đa 50 MB.
                        </div>
                      </div>
                    </div>

                    <hr className="mx-n3" />

                    <div className="px-5 py-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? 'Đang gửi...' : 'Sửa thông tin'}
                      </button>
                    </div>
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

export default AdminUpdateUser;