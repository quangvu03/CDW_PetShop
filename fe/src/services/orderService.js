import api from './axiosConfig'; 

// Đặt hàng
export const createOrder = (orderData) => {
  return api.post('/order/saveOrder', orderData);
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = (userId) => {
  return api.get(`/order/getOrderByUser/${userId}`);
};

// Lấy chi tiết đơn hàng theo idOrder
export const getOrderDetail = (orderId) => {
  return api.get(`/order/getDetailOder/${orderId}`);
};






