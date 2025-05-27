import api from './axiosConfig';

// Service để lấy danh sách tất cả người dùng (dành cho admin)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/findAllUser', {
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
      }
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

// Service để tạo người dùng mới (dành cho admin)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/createUser', userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Trả về { success: true, message: "..." }
  } catch (error) {
    console.error('❌ Lỗi từ createUser:', error);

    // Kiểm tra xem có phản hồi từ server không
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Lỗi không xác định từ server';
      if (status === 400) {
        throw new Error(message); // Ví dụ: "Tên đăng nhập đã tồn tại"
      } else if (status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (status === 403) {
        throw new Error('Bạn không có quyền tạo người dùng.');
      } else {
        throw new Error(`Lỗi ${status}: ${message}`);
      }
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra mạng hoặc cấu hình.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

// Lấy thông tin người dùng theo ID (dành cho admin)
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/findUserById/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(`Không tìm thấy người dùng với ID: ${id}`);
      } else if (error.response.status === 403) {
        throw new Error('Bạn không có quyền truy cập API này.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        throw new Error(`Lỗi ${error.response.status}: ${error.response.data?.message || 'Lỗi không xác định từ server'}`);
      }
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra mạng hoặc cấu hình.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};

// Cập nhật thông tin người dùng (dành cho admin)
export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put('/admin/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Người dùng không tồn tại');
      } else if (error.response.status === 403) {
        throw new Error('Bạn không có quyền cập nhật người dùng này.');
      } else if (error.response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data || 'Dữ liệu không hợp lệ.');
      } else {
        throw new Error(error.response.data?.message || 'Lỗi không xác định từ server');
      }
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra mạng.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }
};