import api from './axiosConfig';



/**
 * Thêm lịch sử duyệt cho thú cưng.
 * @param {number} petId ID của thú cưng.
 * @param {number} userId ID của người dùng.
 * @returns {Promise<any>} Promise chứa response (dự kiến là chuỗi "done").
 */
export const addPetBrowsingHistory = async (petId, userId) => {
  const fullUrl = `${api.defaults.baseURL}/browsing-history/add/pet?userId=${userId}&petId=${petId}`;

  console.log('📡 Gửi POST đến:', fullUrl);

  try {
    const response = await api.post(`/browsing-history/add/pet?userId=${userId}&petId=${petId}`);
    console.log('✅ Thêm lịch sử duyệt thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi thêm lịch sử duyệt:');
    logErrorDetails(error);
    throw new Error(error.response?.data || 'Lỗi không xác định khi lưu lịch sử duyệt');
  }
};


/**
 * Hàm tiện ích để log chi tiết lỗi.
 * @param {Error} error Đối tượng lỗi từ axios.
 */
const logErrorDetails = (error) => {
  if (error.response) {
    console.error('🛑 Status:', error.response.status);
    console.error('📄 Data:', error.response.data);
    console.error('📨 Headers:', error.response.headers);
  } else if (error.request) {
    console.error('📡 Không nhận được phản hồi. Request:', error.request);
  } else {
    console.error('⚠️ Lỗi khi tạo request:', error.message);
  }
  console.error('📚 Stack trace:', error.stack);
};