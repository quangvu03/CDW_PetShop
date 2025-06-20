import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/user/css/User.css';
import { updateProfile } from '../../services/userService';
import { toast } from 'react-toastify';
import api from '../../services/axiosConfig';

export default function PersonalInfo() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    birthday: '',
    gender: '',
    email: '',
    phoneNumber: '',
    country: '',
    district: '',
    ward: '',
    address: '',
    avatar: null,
    avatarPreview: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [initialDistrict, setInitialDistrict] = useState('');
  const [initialWard, setInitialWard] = useState('');

  useEffect(() => {
    api.get('/auth/me').then(res => {
      const user = res.data;
      const addressParts = (user.address || '').split(',').map(part => part.trim());
      const partsCount = addressParts.length;

      const addr = partsCount >= 4 ? addressParts[0] : '';
      const ward = partsCount >= 4 ? addressParts[1] : '';
      const district = partsCount >= 4 ? addressParts[2] : '';
      const country = partsCount >= 4 ? addressParts[3] : '';

      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        phoneNumber: user.phone || '',
        email: user.email || '',
        address: addr,
        country: country,
        avatarPreview: user.avatar ? `http://localhost:8080/uploads/avatars/${user.avatar}` : '',
      }));

      setInitialDistrict(district);
      setInitialWard(ward);
    });
  }, []);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  useEffect(() => {
    const selectedProvince = provinces.find(p => p.name === formData.country);
    setDistricts(selectedProvince ? selectedProvince.districts : []);
    setFormData(prev => ({ ...prev, district: '', ward: '' }));
  }, [formData.country]);

  useEffect(() => {
    if (initialDistrict && districts.length > 0) {
      setFormData(prev => ({ ...prev, district: initialDistrict }));
      setInitialDistrict('');
    }
  }, [districts]);

  useEffect(() => {
    const selectedDistrict = districts.find(d => d.name === formData.district);
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    setFormData(prev => ({ ...prev, ward: '' }));
  }, [formData.district]);

  useEffect(() => {
    if (initialWard && wards.length > 0) {
      setFormData(prev => ({ ...prev, ward: initialWard }));
      setInitialWard('');
    }
  }, [wards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.avatarPreview && formData.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.avatarPreview);
      }

      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: preview
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('birthday', formData.birthday);
    data.append('gender', formData.gender);
    data.append('phoneNumber', formData.phoneNumber);
    data.append(
      'address',
      `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.country}`
    );
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      await updateProfile(data);
      toast.success(t('personal_info_update_success', { defaultValue: '✅ Cập nhật thông tin thành công' }));
    } catch (err) {
      toast.error(t('personal_info_update_error', { defaultValue: err.response?.data.message || '❌ Có lỗi xảy ra khi cập nhật' }));
    }
  };

  return (
    <section className="shop checkout section">
      <div className="container">
        <div className="checkout-form">
          <h2 style={{ margin: '20px 10px' }}>{t('personal_info_title', { defaultValue: 'Thông tin của bạn' })}</h2>
          <form className="form d-flex" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row col-lg-8">
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_full_name', { defaultValue: 'Họ và tên' })}<span>*</span></label>
                <input
                  name="fullName"
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_birthday', { defaultValue: 'Ngày sinh' })}<span>*</span></label>
                <input
                  name="birthday"
                  type="date"
                  className="form-control"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_gender', { defaultValue: 'Giới tính' })}<span>*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">{t('personal_info_select_gender', { defaultValue: 'Chọn giới tính' })}</option>
                  <option value="Nam">{t('personal_info_male', { defaultValue: 'Nam' })}</option>
                  <option value="Nữ">{t('personal_info_female', { defaultValue: 'Nữ' })}</option>
                  <option value="Khác">{t('personal_info_other', { defaultValue: 'Khác' })}</option>
                </select>
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_email', { defaultValue: 'Email' })}<span>*</span></label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  readOnly
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_phone', { defaultValue: 'Số điện thoại' })}<span>*</span></label>
                <input
                  name="phoneNumber"
                  type="text"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_province', { defaultValue: 'Tỉnh/Thành phố' })}<span>*</span></label>
                <select name="country" value={formData.country} onChange={handleChange} className="form-control" required>
                  <option value="">{t('personal_info_select_province', { defaultValue: 'Chọn tỉnh/thành phố' })}</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_district', { defaultValue: 'Quận/Huyện' })}<span>*</span></label>
                <select name="district" value={formData.district} onChange={handleChange} className="form-control" required>
                  <option value="">{t('personal_info_select_district', { defaultValue: 'Chọn quận/huyện' })}</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6 col-md-6 col-12 form-group">
                <label>{t('personal_info_ward', { defaultValue: 'Xã/Phường' })}<span>*</span></label>
                <select name="ward" value={formData.ward} onChange={handleChange} className="form-control" required>
                  <option value="">{t('personal_info_select_ward', { defaultValue: 'Chọn xã/phường' })}</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 form-group">
                <label>{t('personal_info_address', { defaultValue: 'Địa chỉ cụ thể' })}<span>*</span></label>
                <input
                  name="address"
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 form-group">
                <button type="submit" className="btn btn-primary">{t('personal_info_save', { defaultValue: 'Lưu thông tin' })}</button>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-header">{t('personal_info_avatar_title', { defaultValue: 'Ảnh đại diện' })}</div>
                <div className="card-body text-center">
                  <img
                    id="imgAvatar"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ccc',
                    }}
                    src={
                      formData.avatarPreview ||
                      '/assets/user/images/default-avatar.png'
                    }
                    alt={t('personal_info_avatar_alt', { defaultValue: 'avatar' })}
                  />
                  <input
                    type="file"
                    name="avatar"
                    id="inputAvatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                  <label htmlFor="inputAvatar" className="btn btn-outline-primary mt-2">
                    <i className="fa-solid fa-arrow-up-from-bracket"></i> {t('personal_info_upload', { defaultValue: 'Tải lên' })}
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}