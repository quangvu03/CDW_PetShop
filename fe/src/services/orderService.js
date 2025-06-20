import api from './axiosConfig';

// Đặt hàng
export const createOrder = async (orderData) => {
  try {
    // Đảm bảo orderData chứa phoneNumber và shippingName
    const payload = {
      userId: orderData.userId,
      shippingAddress: orderData.shippingAddress,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      shippingMethodId: orderData.shippingMethodId,
      phoneNumber: orderData.phoneNumber, // Thêm số điện thoại
      shippingName: orderData.shippingName, // Thêm tên người nhận
      orderRequestList: orderData.orderRequestList,
    };
    console.log('Creating order with payload:', payload); // Debug

    const response = await api.post('/order/saveOrder', payload);
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
    // Response trả về danh sách OrdersDto với phoneNumber, shippingName, checkoutUrl, expiredAt
    return response.data; // FE cần xử lý các trường mới trong giao diện
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng';
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
    // Response chứa result (OrderItemDto) và order (OrdersDto với phoneNumber, shippingName, checkoutUrl, expiredAt)
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error.response?.data?.message || error.message || 'Không thể tải chi tiết đơn hàng';
  }
};

// Cập nhật trạng thái đơn hàng bởi admin
export const updateOrderStatus = (orderId, status, paymentStatus) => {
  console.log(`CLIENT-SIDE FETCH: Updating order status: /api/admin/updateOrderStatus?orderId=${orderId}&status=${status}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}`);
  
  const params = new URLSearchParams();
  params.append('orderId', orderId);
  params.append('status', status);
  if (paymentStatus) {
    params.append('paymentStatus', paymentStatus);
  }

  return api.put(`/admin/updateOrderStatus`, null, { params })
    .then(response => {
      console.log('Update status response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Update status error:', error.response || error);
      throw error.response?.data?.message || error.message || 'Không thể cập nhật trạng thái';
    });
};



// Cập nhật trạng thái đơn hàng bởi thanh toán
export const updateOrderStatusByPayOs = (orderId, status, paymentStatus) => {
  console.log(`CLIENT-SIDE FETCH: Updating order status: /api/admin/updateOrderStatus?orderId=${orderId}&status=${status}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}`);
  
  const params = new URLSearchParams();
  params.append('orderId', orderId);
  params.append('status', status);
  if (paymentStatus) {
    params.append('paymentStatus', paymentStatus);
  }

  return api.put(`/order/updateOrderStatus`, null, { params })
    .then(response => {
      console.log('Update status response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Update status error:', error.response || error);
      throw error.response?.data?.message || error.message || 'Không thể cập nhật trạng thái';
    });
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
    throw error.response?.data?.message || error.message || 'Không thể hủy đơn hàng';
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
    throw error.response?.data?.message || error.message || 'Không thể cập nhật địa chỉ đơn hàng';
  }
};

// export default { createOrder, getOrdersByUser, getOrderDetail, updateOrderStatus, cancelOrder, updateAddress };