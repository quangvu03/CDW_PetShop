import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById, getAllSpecies } from '../../services/petService';
import { getPetImages, updatePet, addPetImage, deletePetImage, setPetImageAsMain } from '../../services/AdminPetManagerService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUpdatePet = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    species: '',
    breed: '',
    price: 0.0,
    quantity: 0,
    imageUrl: '',
    gender: 'male',
    age: 0,
    color: '',
    size: 'small',
    origin: '',
    description: '',
    status: 'available',
    created_at: ''
  });
  const [error, setError] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [showCustomSpecies, setShowCustomSpecies] = useState(false);
  const [petImages, setPetImages] = useState([]);
  const [imageError, setImageError] = useState(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setImageError(null);
      setIsLoadingImages(true);

      const speciesResponse = await getAllSpecies();
      setSpeciesList(speciesResponse.data || []);

      const petResponse = await getPetById(id);
      const pet = petResponse.data;
      setFormData({
        id: pet.id || 0,
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        price: pet.price || 0.0,
        quantity: pet.quantity || 0,
        imageUrl: pet.imageUrl || '',
        gender: pet.gender || 'male',
        age: pet.age || 0,
        color: pet.color || '',
        size: pet.size || 'small',
        origin: pet.origin || '',
        description: pet.description || '',
        status: pet.status || 'available',
        created_at: pet.created_at || ''
      });

      try {
        const imagesResponse = await getPetImages(id);
        setPetImages(Array.isArray(imagesResponse) ? imagesResponse : []);
      } catch (imgErr) {
        setImageError('Không thể tải danh sách ảnh: ' + imgErr.message);
        setPetImages([]);
      }
    } catch (err) {
      setError('Không thể tải thông tin: ' + err.message);
      setPetImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'species' && value === 'other') {
      setShowCustomSpecies(true);
    } else {
      setShowCustomSpecies(false);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomSpeciesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      species: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Vui lòng chọn file ảnh định dạng JPG, PNG hoặc JPEG!', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file ảnh không được vượt quá 5MB!', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      setNewImage(file);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error('Vui lòng chọn một file ảnh!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoadingImages(true);
      await addPetImage(id, newImage);
      toast.success('Thêm ảnh thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setNewImage(null);
      document.getElementById('imageUpload').value = '';
      await fetchData();
    } catch (err) {
      toast.error('Lỗi khi thêm ảnh: ' + err.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      return;
    }
    try {
      setIsLoadingImages(true);
      await deletePetImage(imageId);
      toast.success('Xóa ảnh thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      await fetchData();
    } catch (err) {
      toast.error('Lỗi khi xóa ảnh: ' + err.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      setIsLoadingImages(true);
      await setPetImageAsMain(id, imageId);
      toast.success('Đặt ảnh chính thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      await fetchData(); // Tải lại danh sách ảnh
    } catch (err) {
      toast.error('Lỗi khi đặt ảnh chính: ' + err.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await updatePet(id, formData);
      if (response && (response.data || response)) {
        toast.success('Cập nhật thú cưng thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchData();
      } else {
        throw new Error('Cập nhật không thành công');
      }
    } catch (err) {
      toast.error('Lỗi khi cập nhật thú cưng: ' + (err.response?.data?.message || err.message), {
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
                <h4 className="mb-0 fw-bold text-black">Chỉnh sửa thú cưng</h4>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label fw-medium text-black">
                      ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="id"
                      name="id"
                      value={formData.id}
                      readOnly
                    />
                  </div>
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
                    />
                    <small className="text-black">
                      Không vượt quá 100 ký tự.
                    </small>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="species" className="form-label fw-medium text-black">
                        Loài <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select text-black"
                        id="species"
                        name="species"
                        value={formData.species}
                        onChange={handleInputChange}
                        style={{ background: 'rgba(255,255,255,0.2)' }}
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
                      />
                    </div>
                  </div>
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
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label fw-medium text-black">
                      URL ảnh <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="Nhập URL ảnh"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                    />
                  </div>
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
                      />
                    </div>
                  </div>
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
                      >
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="small">Nhỏ</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="medium">Trung bình</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="large">Lớn</option>
                      </select>
                    </div>
                  </div>
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
                      >
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="available">Có sẵn</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="sold">Đã bán</option>
                        <option style={{ background: 'rgba(255,255,255,0.2)' }} value="pending">Đang chờ</option>
                      </select>
                    </div>
                  </div>
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
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Cập nhật</button>
                </form>

                <div className="mt-5">
                  <h5 className="fw-bold text-black mb-4">Danh sách ảnh của thú cưng</h5>
                  <form onSubmit={handleAddImage} className="mb-4">
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <button
                        className="btn btn-success"
                        type="submit"
                        disabled={isLoadingImages || !newImage}
                      >
                        {isLoadingImages ? 'Đang tải...' : 'Thêm ảnh'}
                      </button>
                    </div>
                    <small className="text-muted mt-2">
                      Chọn file ảnh (JPG, PNG, JPEG) để thêm vào danh sách.
                    </small>
                  </form>
                  {imageError && <div className="alert alert-danger mt-3">{imageError}</div>}
                  {isLoadingImages ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                      </div>
                    </div>
                  ) : petImages.length === 0 ? (
                    <p className="text-muted">Không có ảnh nào cho pet này.</p>
                  ) : (
                    <div className="row mt-3">
                      {petImages.map((image) => (
                        <div key={image.id} className="col-md-4 mb-4">
                          <div className="card h-100 shadow-sm">
                            <img
                              src={`http://localhost:8080/${image.imageUrl}`}
                              className="card-img-top"
                              alt={`Ảnh của thú cưng ${formData.name}`}
                              style={{ height: '200px', objectFit: 'cover' }}
                              onError={(e) => {
                                console.error(`Lỗi tải ảnh: ${image.imageUrl}`);
                                e.target.src = 'https://via.placeholder.com/200?text=Ảnh+lỗi';
                              }}
                            />
                            <div className="card-body">
                              <p className="card-text mb-1">
                                <strong>ID ảnh:</strong> {image.id}
                              </p>
                              <p className="card-text mb-3">
                                <strong>Ảnh chính:</strong>{' '}
                                <span className={image.isMain ? 'badge bg-success' : 'badge bg-secondary'}>
                                  {image.isMain ? 'Có' : 'Không'}
                                </span>
                              </p>
                              <div className="d-flex gap-2">
                                {!image.isMain && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => handleSetMainImage(image.id)}
                                      disabled={isLoadingImages}
                                    >
                                      Chọn làm ảnh chính
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDeleteImage(image.id)}
                                      disabled={isLoadingImages}
                                    >
                                      Xóa
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminUpdatePet);