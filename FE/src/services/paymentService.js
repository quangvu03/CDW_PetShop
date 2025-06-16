// src/services/paymentService.js
import api from './axiosConfig';

export const createPaymentLink = async (paymentData) => {
  try {
    const response = await api.post('/order/createPaymentLink', paymentData);
    if (response.data.error !== 0) {
      throw new Error(response.data.message || 'Tạo liên kết thanh toán thất bại');
    }
    return {
      ...response.data,
      expiryDateTime: response.data.expiryDateTime
    };
  } catch (error) {
    console.error('Lỗi khi tạo liên kết thanh toán:', error);
    throw error.response?.data?.message || error.message || 'Không thể tạo liên kết thanh toán';
  }
};

export const updatePaymentStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/order/updatePaymentStatus?orderId=${orderId}&status=${status}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Cập nhật trạng thái thanh toán thất bại');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    throw error.response?.data?.message || error.message || 'Không thể cập nhật trạng thái thanh toán';
  }
};

export default { createPaymentLink, updatePaymentStatus };