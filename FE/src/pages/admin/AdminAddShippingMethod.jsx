import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addShippingMethod } from '../../services/AdminShippingManagerService';
import { toast } from 'react-toastify';

const AdminAddShippingMethod = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    estimatedTime: ''
  });
  const [errors, setErrors] = useState({});

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên phương thức là bắt buộc';
    else if (formData.name.length > 100) newErrors.name = 'Tên không được vượt quá 100 ký tự';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)
      newErrors.price = 'Giá phải là số không âm hợp lệ';
    if (!formData.estimatedTime.trim()) newErrors.estimatedTime = 'Thời gian dự kiến là bắt buộc';
    else if (formData.estimatedTime.length > 100) newErrors.estimatedTime = 'Thời gian dự kiến không được vượt quá 100 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ và đúng định dạng thông tin.');
      return;
    }

    try {
      const response = await addShippingMethod({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        estimatedTime: formData.estimatedTime
      });
      console.log('Added shipping method:', response.data);
      toast.success('Thêm phương thức vận chuyển thành công');
      setFormData({ name: '', description: '', price: '', estimatedTime: '' });
      navigate('/admin/shipping-methods'); // Chuyển hướng về danh sách
    } catch (error) {
      console.error('Error adding shipping method:', error);
      toast.error(error.response?.data || 'Không thể thêm phương thức vận chuyển');
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h5 className="card-title">Thêm phương thức vận chuyển</h5>

        <div className="card mt-3">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Tên phương thức
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên phương thức"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.name ? 'red' : '#ccc'}`,
                  }}
                  required
                />
                {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.description ? 'red' : '#ccc'}`,
                    minHeight: '100px',
                  }}
                  required
                />
                {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Giá (VNĐ)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá"
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.price ? 'red' : '#ccc'}`,
                  }}
                  required
                />
                {errors.price && <div style={{ color: 'red', fontSize: '12px' }}>{errors.price}</div>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Thời gian dự kiến
                </label>
                <input
                  type="text"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="Nhập thời gian dự kiến (ví dụ: 1-2 ngày)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.estimatedTime ? 'red' : '#ccc'}`,
                  }}
                  required
                />
                {errors.estimatedTime && <div style={{ color: 'red', fontSize: '12px' }}>{errors.estimatedTime}</div>}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    background: '#3085d6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/shipping-methods')}
                  style={{
                    padding: '8px 16px',
                    background: '#d33',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddShippingMethod;