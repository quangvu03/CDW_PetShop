// services/orderService.js
import api from './axiosConfig';

/**
 * Gửi đơn hàng gồm thông tin và danh sách sản phẩm.
 * @param {object} orderRequest - Đối tượng OrderRequest.
 * @returns {Promise} - Response từ server.
 */
export const saveOrder = (orderRequest) => {
  console.log('CLIENT-SIDE FETCH: Sending order to /saveOrder');
  return api.post('/order/saveOrder', orderRequest);
};

/**
 * Lấy danh sách đơn hàng của người dùng theo userId.
 * @param {number} userId - ID của người dùng.
 * @returns {Promise} - Danh sách đơn hàng.
 */
export const getOrdersByUser = (userId) => {
  console.log(`CLIENT-SIDE FETCH: Fetching orders for userId: ${userId}`);
  return api.get(`/order/getOrderByUser/${userId}`);
};

/**
 * Lấy chi tiết đơn hàng theo idOrder.
 * @param {number} idOrder - ID của đơn hàng.
 * @returns {Promise} - Thông tin chi tiết đơn hàng (OrderItemDto).
 */
export const getOrderDetail = (idOrder) => {
  console.log(`CLIENT-SIDE FETCH: Fetching order detail for orderId: ${idOrder}`);
  return api.get(`/order/getDetailOder/${idOrder}`);
};


/**
 * Hủy đơn hàng bằng cách cập nhật trạng thái.
 * @param {number} orderId - ID của đơn hàng.
 * @param {string} status - Trạng thái mới (ví dụ: "cancelled").
 * @returns {Promise} - Kết quả trả về từ API.
 */
export const cancelOrder = (orderId, status) => {
  console.log(`CLIENT-SIDE FETCH: Cancelling orderId: ${orderId} with status: ${status}`);
  return api.put('/order/cancelled', null, {
    params: {
      orderId,
      status,
    },
  });
};

