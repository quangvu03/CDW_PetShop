import api from './axiosConfig';

/**
 * Lấy toàn bộ danh sách phương thức vận chuyển.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng ShippingMethod[]).
 */
export const getAllShippingMethods = () => {
  const url = '/admin/getAllShippingMethod';
  console.log(`CLIENT-SIDE FETCH: Requesting shipping methods: ${url}`);
  return api.get(url);
};

/**
 * Thêm một phương thức vận chuyển mới.
 * @param {Object} shippingMethod Đối tượng chứa thông tin phương thức vận chuyển.
 * @param {string} shippingMethod.name Tên phương thức vận chuyển.
 * @param {string} shippingMethod.description Mô tả phương thức vận chuyển.
 * @param {number} shippingMethod.price Giá vận chuyển (VNĐ).
 * @param {string} shippingMethod.estimatedTime Thời gian dự kiến.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là đối tượng ShippingMethod đã lưu).
 */
export const addShippingMethod = (shippingMethod) => {
  const url = '/admin/addShipping';
  console.log(`CLIENT-SIDE FETCH: Adding shipping method: ${url}`, shippingMethod);
  return api.post(url, shippingMethod);
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
  const url = `/admin/updateShipping/${id}`;
  console.log(`CLIENT-SIDE FETCH: Updating shipping method: ${url}`, shippingMethod);
  return api.put(url, shippingMethod);
};