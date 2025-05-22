// src/pages/admin/AdminVoucherAdd.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminVoucherAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: '',
    max_uses: '',
    expiry_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vouchers', formData);
      navigate('/admin/vouchers');
    } catch (error) {
      console.error('Failed to add voucher', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h4 className="mt-4">Thêm Voucher</h4>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã voucher</label>
                <input type="text" className="form-control" name="code" value={formData.code} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phần trăm giảm giá</label>
                <input type="number" className="form-control" name="discount_percent" value={formData.discount_percent} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Số lần sử dụng tối đa</label>
                <input type="number" className="form-control" name="max_uses" value={formData.max_uses} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Ngày hết hạn</label>
                <input type="datetime-local" className="form-control" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Thêm</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherAdd;
