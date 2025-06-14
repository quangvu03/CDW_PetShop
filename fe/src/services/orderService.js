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

// Update order status
async function updateOrderStatus(orderId, status) {
  try {
    return await api.put(`/order/updateOrderStatus/${orderId}`, { status });
  } catch (error) {
    throw error;
  }
}

// Cancel order 
export async function cancelOrder(orderId) {
  try {
    return await api.put(`/order/cancelOrder?orderId=${orderId}`);
  } catch (error) {
    throw error;
  }
}

export async function updateAddress(orderId, address) {
  try {
    const result = await api.put(`/order/updateAddress?orderId=${orderId}&shippingAddress=${address}`);
    console.log(`Order address updated successfully: ${JSON.stringify(result.data)}`);
    return result;
  } catch (error) {
    throw error;
  }
}


export default { createOrder, getOrdersByUser, getOrderDetail, updateOrderStatus, cancelOrder };






