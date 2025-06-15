import api from './axiosConfig';


export const addReview = (userId, petId, rating, orderId) => {
  console.log(`CLIENT-SIDE FETCH: Adding review for userId: ${userId}, petId: ${petId}, rating: ${rating}, orderId: ${orderId}`);
  return api.post('/review/add', { userId, petId, rating, orderId });
};


export const getReviewsByUserId = (userId) => {
  console.log(`CLIENT-SIDE FETCH: Requesting reviews for userId: ${userId}`);
  return api.get(`/review/getReview/${userId}`);
};


export const updateReview = (reviewId, userId, petId, rating, orderId) => {
  console.log(`CLIENT-SIDE FETCH: Updating review for reviewId: ${reviewId}, userId: ${userId}, petId: ${petId}, rating: ${rating}, orderId: ${orderId}`);
  return api.put(`/review/update/${reviewId}`, { userId, petId, rating, orderId });
};



export const getReviewsByPetId = (petId) => {
  console.log(`CLIENT-SIDE FETCH: Requesting reviews for petId: ${petId}`);
  return api.get(`/review/getReviewByPet/${petId}`);
};