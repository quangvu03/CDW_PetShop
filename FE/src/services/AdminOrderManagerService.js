import api from './axiosConfig';

/**
 * Lấy toàn bộ danh sách thú cưng, sắp xếp theo ngày đặt hàng giảm dần.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng PetDTO[]).
 */
export const getAllPets = () => {
    const url = '/admin/findAllOrder';
    // const fullUrl = api.defaults.baseURL
    //     ? api.defaults.baseURL.replace(/\/$/, '') + url
    //     : url;
    // console.log(`[CLIENT-SIDE FETCH] GET ${fullUrl}`);
    const result = api.get(url);
    // console.log(`[CLIENT-SIDE FETCH] GET ${fullUrl} =>`, result);
    return result;
};

/**
 * Lấy chi tiết đơn hàng theo ID đơn hàng.
 * @param {number} idOrder ID của đơn hàng.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là đối tượng { result: OrderItemDto }).
 */
export const getDetailOrder = (idOrder) => {
  console.log(`CLIENT-SIDE FETCH: Requesting order details: /admin/getDetailOder/${idOrder}`);
  return api.get(`/admin/getDetailOder/${idOrder}`);
};

export const updateOrderStatus = (orderId, status, paymentStatus) => {
  console.log(`CLIENT-SIDE FETCH: Updating order status: /admin/updateOrderStatus?orderId=${orderId}&status=${status}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}`);
  
  const params = new URLSearchParams();
  params.append('orderId', orderId);
  params.append('status', status);
  if (paymentStatus) {
    params.append('paymentStatus', paymentStatus);
  }

  return api.put(`/admin/updateOrderStatus`, null, { params });
};

/**
 * Lấy thông tin phương thức vận chuyển theo ID.
 * @param {number} id ID của phương thức vận chuyển.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là đối tượng ShippingMethod).
 */
export const getShippingMethodById = (id) => {
  const url = `/admin/shipping/${id}`;
  console.log(`CLIENT-SIDE FETCH: Requesting shipping method by ID: ${url}`);
  return api.get(url);
};

/**
 * Cập nhật thông tin phương thức vận chuyển theo ID.
 * @param {number} id ID của phương thức vận chuyển.
 * @param {Object} shippingMethod Đối tượng chứa thông tin cập nhật.
 * @param {string} shippingMethod.name Tên phương thức vận chuyển.
 * @param {string} shippingMethod.description Mô tả phương thức vận chuyển.
 * @param {number} shippingMethod.price Giá vận chuyển (VNĐ).
 * @param {string} shippingMethod.estimatedTime Thời gian dự kiến.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là đối tượng ShippingMethod đã cập nhật).
 */
export const updateShippingMethod = (id, shippingMethod) => {
  const url = `/admin/shipping/${id}`;
  console.log(`CLIENT-SIDE FETCH: Updating shipping method: ${url}`, shippingMethod);
  return api.put(url, shippingMethod);
};