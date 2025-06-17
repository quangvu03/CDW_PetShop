import api from './axiosConfig';
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


export const getShippingMethodById = (id) => {
  const url = `/admin/shipping/${id}`;
  console.log(`CLIENT-SIDE FETCH: Requesting shipping method by ID: ${url}`);
  return api.get(url);
};


export const updateShippingMethod = (id, shippingMethod) => {
  const url = `/admin/shipping/${id}`;
  console.log(`CLIENT-SIDE FETCH: Updating shipping method: ${url}`, shippingMethod);
  return api.put(url, shippingMethod);
};

export const getCompletedOrders = () => {
  const url = `/admin/getCompletedOrders`;
  console.log(`CLIENT-SIDE FETCH: Updating shipping method: ${url}`);
  return api.get(url);
};



export const getCompletedOrdersByDateRange = (startDate, endDate) => {
  const url = `/admin/getCompletedOrdersByDateRange`;
  console.log(`CLIENT-SIDE FETCH: Requesting completed orders by date range: ${url}?startDate=${startDate}&endDate=${endDate}`);
  
  const params = new URLSearchParams();
  params.append('startDate', startDate.replace(/\//g, '-')); // Chuyển yyyy/MM/dd thành yyyy-MM-dd
  params.append('endDate', endDate.replace(/\//g, '-')); // Chuyển yyyy/MM/dd thành yyyy-MM-dd

  return api.get(url, { params });
};