// src/pages/admin/AdminVoucherEdit.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminVoucherEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState({
    code: '',
    discount_percent: '',
    max_uses: '',
    expiry_date: '',
  });

  useEffect(() => {
    axios.get(`/api/admin/vouchers/${id}`)
      .then(response => setVoucher(response.data))
      .catch(error => console.error('Lỗi khi tải voucher:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/admin/vouchers/${id}`, voucher)
      .then(() => navigate('/admin/vouchers'))
      .catch(error => console.error('Lỗi khi cập nhật voucher:', error));
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h4>Chỉnh sửa Voucher</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã code</label>
            <input type="text" name="code" value={voucher.code} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Phần trăm giảm</label>
            <input type="number" name="discount_percent" value={voucher.discount_percent} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Số lần sử dụng tối đa</label>
            <input type="number" name="max_uses" value={voucher.max_uses} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Hạn sử dụng</label>
            <input type="datetime-local" name="expiry_date" value={voucher.expiry_date} onChange={handleChange} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
        </form>
      </div>
    </div>
  );
};

export default AdminVoucherEdit;
