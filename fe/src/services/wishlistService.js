import api from './axiosConfig';

export const getWishlistByUser = async () => {
    const response = await api.get(`/wishlist/user`);
    return response.data;
};

export const addPetToWishlist = async (petId) => {
    const response = await api.post(`/wishlist/pet/${petId}`);
    return response.data;
};
export const addProductToWishlist = async (productId) => {
    const response = await api.post(`/wishlist/product/${productId}`);
    return response.data;
};

export const removePetToWishlist = async (petId) => {
    const response = await api.delete(`/wishlist/pet/${petId}`);
    return response.data;
};
export const removeProductToWishlist = async (productId) => {
    const response = await api.delete(`/wishlist/product/${productId}`);
    return response.data;
};

  

  
  