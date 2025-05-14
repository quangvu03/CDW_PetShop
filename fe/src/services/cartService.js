import api from './axiosConfig';

// ✅ Lấy giỏ hàng hiện tại (dựa vào token)
export const getCartByUser = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// ✅ Thêm vào giỏ hàng (pet hoặc product)
export const addToCart = async ({ petId, productId, quantity = 1 }) => {
  const body = { quantity };
  if (petId) body.petId = petId;
  if (productId) body.productId = productId;
  const response = await api.post('/cart/add', body);
  return response.data;
};

// ✅ Xoá khỏi giỏ hàng (pet hoặc product)
export const removeItemFromCart = async ({ petId, productId }) => {
  const params = {};
  if (petId) params.petId = petId;
  if (productId) params.productId = productId;
  const response = await api.delete('/cart/remove', { params });
  return response.data;
};

// ✅ Cập nhật số lượng
export const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await api.put('/cart/update', { itemId, quantity });
  return response.data;
};
