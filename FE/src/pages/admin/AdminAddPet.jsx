import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSpecies } from '../../services/petService';
import { addPetWithImage } from '../../services/AdminPetManagerService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminAddPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    price: 1.0,
    quantity: 1,
    gender: 'male',
    age: 1,
    color: '',
    size: 'small',
    origin: '',
    description: '',
    status: 'available'
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [showCustomSpecies, setShowCustomSpecies] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesResponse = await getAllSpecies();
        setSpeciesList(speciesResponse.data || []);
      } catch (err) {
        setError('Không thể tải danh sách loài: ' + err.message);
      }
    };
    fetchSpecies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'species' && value === 'other') {
      setShowCustomSpecies(true);
      setFormData(prev => ({ ...prev, species: '' }));
    } else if (name === 'species') {
      setShowCustomSpecies(false);
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomSpeciesChange = (e) => {
    setFormData(prev => ({ ...prev, species: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImageFile(file);
    } else {
      toast.error('Vui lòng chọn file ảnh định dạng JPEG hoặc PNG!', {
        position: 'top-right',
        autoClose: 3000,
      });
      e.target.value = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.species) {
      toast.error('Vui lòng chọn hoặc nhập loài!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (!imageFile) {
      toast.error('Vui lòng chọn ảnh cho thú cưng!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await addPetWithImage(formData, imageFile);
      if (response) {
        toast.success('Thêm thú cưng thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/admin/products');
      } else {
        throw new Error('Thêm pet không thành công');
      }
    } catch (err) {
      toast.error('Lỗi khi thêm thú cưng: ' + (err.response?.data?.message || err.message), {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row mt-3 justify-content-center">
          <div className="col-md-10">
            <div className="card">
              <div
                className="card-header border-bottom"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <h4 className="mb-0 fw-bold text-black">Thêm thú cưng mới</h4>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-medium text-black">
                      Tên thú cưng <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Nhập tên thú cưng"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength="100"
                    />
                    <small className="text-black">
                      Không vượt quá 100 ký tự.
                    </small>
                  </div>

                  {/* Species and Breed */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="species" className="form-label fw-medium text-black">
                        Loài <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select text-black"
                        id="species"
                        name="species"
                        value={formData.species === '' ? 'other' : formData.species}
                        onChange={handleInputChange}
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                        required
                      >
                        <option value="">Chọn loài</option>
                        {speciesList.map((species, index) => (
                          <option
                            key={index}
                            value={species}
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                          >
                            {species}
                          </option>
                        ))}
                        <option
                          value="other"
                          style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                          Khác
                        </option>
                      </select>
                      {showCustomSpecies && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Nhập loài khác"
                          value={formData.species}
                          onChange={handleCustomSpeciesChange}
                          required
                        />
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="breed" className="form-label fw-medium text-black">
                        Giống <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="breed"
                        name="breed"
                        placeholder="Nhập giống"
                        value={formData.breed}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label fw-medium text-black">
                        Giá <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="price"
                        name="price"
                        placeholder="Nhập giá"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label fw-medium text-black">
                        Số lượng <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        placeholder="Nhập số lượng"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Image File */}
                  <div className="mb-3">
                    <label htmlFor="imageFile" className="form-label fw-medium text-black">
                      Ảnh đại diện <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="imageFile"
                      name="imageFile"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      required
                    />
                    <small className="text-black">
                      Chỉ chấp nhận file JPEG hoặc PNG.
                    </small>
                  </div>

                  {/* Gender and Age */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="gender" className="form-label fw-medium text-black">
                        Giới tính <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select text-black"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                        required
                      >
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="male">Đực</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="female">Cái</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="age" className="form-label fw-medium text-black">
                        Tuổi <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        placeholder="Nhập tuổi"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Color and Size */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="color" className="form-label fw-medium text-black">
                        Màu sắc <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="color"
                        name="color"
                        placeholder="Nhập màu sắc"
                        value={formData.color}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="size" className="form-label fw-medium text-black">
                        Kích thước <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select text-black"
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                        required
                      >
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="small">Nhỏ</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="medium">Trung bình</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="large">Lớn</option>
                      </select>
                    </div>
                  </div>

                  {/* Origin and Status */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="origin" className="form-label fw-medium text-black">
                        Xuất xứ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="origin"
                        name="origin"
                        placeholder="Nhập xuất xứ"
                        value={formData.origin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="status" className="form-label fw-medium text-black">
                        Trạng thái <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select text-black"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                        required
                      >
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="available">Có sẵn</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="sold">Đã bán</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="pending">Đang chờ</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-medium text-black">
                      Mô tả <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="6"
                      placeholder="Nhập mô tả"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                    <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary mt-3">Thêm pet</button>
                    <Link
                        to="/admin/products"
                        className="btn btn-secondary mt-3"
                        style={{ textDecoration: 'none' }}
                    >
                        Hủy
                    </Link>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminAddPet);