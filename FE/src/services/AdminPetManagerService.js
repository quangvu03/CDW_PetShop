import api from './axiosConfig';

// Service để lấy danh sách tất cả thú cưng (dành cho admin)
export const getAllPets = async () => {
  try {
    const response = await api.get('/admin/pet-manager', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Lấy token từ localStorage
      },
    });
    return response.data; 
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền truy cập API này. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi lấy danh sách thú cưng. Vui lòng thử lại sau.');
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

/**
 * Cập nhật thông tin pet.
 * @param {number} id ID của pet.
 * @param {object} petData Dữ liệu pet cần cập nhật.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response.
 */
export const updatePet = async (id, petData) => {
  try {
    const response = await api.put(`/admin/petUpdate/${id}`, petData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Lấy token từ localStorage
      },
    });

    console.log('Cập nhật pet thành công:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền cập nhật pet này. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi cập nhật thú cưng: ' + (error.response.data || error.message));
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};


/**
 * Lấy danh sách tất cả ảnh của một pet.
 * @param {number} petId ID của pet.
 * @returns {Promise<Array>} Promise chứa danh sách URL hoặc thông tin ảnh.
 */
export const getPetImages = async (petId) => {
  try {
    const response = await api.get(`/admin/images/${petId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Lấy token từ localStorage
      },
    });
    return response.data; // Giả sử API trả về danh sách ảnh (URL hoặc object)
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền truy cập ảnh của pet này. Vui lòng kiểm tra vai trò.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 404) {
        throw new Error('Không tìm thấy ảnh cho pet này.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi lấy danh sách ảnh. Vui lòng thử lại sau.');
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

/**
 * Thêm ảnh mới cho pet.
 * @param {number} petId ID của pet.
 * @param {File} imageFile File ảnh để tải lên.
 * @returns {Promise<Object>} Promise chứa thông tin ảnh vừa thêm.
 */
export const addPetImage = async (petId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile); // Tên 'file' phải khớp với @RequestParam trong controller

    const response = await api.post(`/admin/addImagePet/${petId}/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Giả sử API trả về PetImageDto
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền thêm ảnh cho pet này. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 400) {
        throw new Error('File ảnh không hợp lệ. Vui lòng kiểm tra định dạng hoặc kích thước file.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi thêm ảnh: ' + (error.response.data?.message || error.message));
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

// Xóa ảnh của pet
/**
 * Xóa ảnh của pet theo imageId.
 * @param {number} imageId ID của ảnh cần xóa.
 * @returns {Promise<string>} Promise chứa thông báo thành công hoặc lỗi.
 */
export const deletePetImage = async (imageId) => {
  try {
    const response = await api.delete(`/admin/deleteImage/${imageId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data; // Giả sử API trả về chuỗi thông báo (ví dụ: "Xóa ảnh thú cưng thành công")
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền xóa ảnh này. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 404) {
        throw new Error('Ảnh không tồn tại.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi xóa ảnh: ' + (error.response.data?.message || error.message));
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

// Đặt ảnh làm ảnh chính
/**
 * Đặt ảnh làm ảnh chính cho pet.
 * @param {number} petId ID của pet.
 * @param {number} imageId ID của ảnh cần đặt làm ảnh chính.
 * @returns {Promise<Object>} Promise chứa thông tin ảnh chính vừa cập nhật.
 */
export const setPetImageAsMain = async (petId, imageId) => {
  try {
    const response = await api.put(`/admin/updateMainImage?petId=${petId}&imageId=${imageId}`, {}, {
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      // },
    });
    return response.data; // Giả sử API trả về PetImageDto
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền đặt ảnh chính. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 404) {
        throw new Error('Ảnh hoặc pet không tồn tại.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi đặt ảnh chính: ' + (error.response.data?.message || error.message));
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};


/**
 * Thêm thú cưng mới với ảnh.
 * @param {Object} petData Dữ liệu thú cưng (PetDto).
 * @param {File} imageFile File ảnh để tải lên.
 * @returns {Promise<Object>} Promise chứa thông tin thú cưng vừa thêm.
 */
export const addPetWithImage = async (petData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('petDto', new Blob([JSON.stringify(petData)], { type: 'application/json' }));
    formData.append('imageFile', imageFile);

    const response = await api.post('/admin/addPetWithImage', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Giả sử API trả về PetDto
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Bạn không có quyền thêm thú cưng. Vui lòng kiểm tra vai trò admin.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 400) {
        throw new Error('Dữ liệu thú cưng hoặc file ảnh không hợp lệ. Vui lòng kiểm tra lại.');
      } else if (error.response.status === 500) {
        throw new Error('Lỗi server khi thêm thú cưng: ' + (error.response.data?.message || error.message));
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};
