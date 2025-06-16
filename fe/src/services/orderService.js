// src/services/orderService.js
import api from './axiosConfig';

// Đặt hàng
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/order/saveOrder', orderData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Đặt hàng thất bại');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    throw error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng';
  }
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = async (userId) => {
  try {
    const response = await api.get(`/order/getOrderByUser/${userId}`);
    console.log('Get orders response:', response); // Debug
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};

// Lấy chi tiết đơn hàng theo idOrder
export const getOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/order/getDetailOder/${orderId}`);
    console.log('Get order detail response:', response.data); // Debug
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Phản hồi API không hợp lệ');
    }
    if (!response.data.result) {
      throw new Error(response.data.message || 'Không tìm thấy chi tiết đơn hàng');
    }
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error.response?.data?.message || error.message || 'Không thể tải chi tiết đơn hàng';
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/order/updateOrderStatus/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    throw error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng';
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/order/cancelOrder?orderId=${orderId}`);
    if (!response.data.result || response.data.result !== 'success') {
      throw new Error(response.data.message || 'Hủy đơn hàng thất bại');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    throw error.response?.data?.message || 'Không thể hủy đơn hàng';
  }
};

// Cập nhật địa chỉ đơn hàng
export const updateAddress = async (orderId, address) => {
  try {
    const response = await api.put(`/order/updateAddress?orderId=${orderId}&shippingAddress=${encodeURIComponent(address)}`);
    console.log(`Cập nhật địa chỉ đơn hàng thành công: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ đơn hàng:', error);
    throw error.response?.data?.message || 'Không thể cập nhật địa chỉ đơn hàng';
  }
};

export default { createOrder, getOrdersByUser, getOrderDetail, updateOrderStatus, cancelOrder, updateAddress };