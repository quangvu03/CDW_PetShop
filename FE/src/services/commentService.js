import api from './axiosConfig';

export const addComment = (addCommentDto) => {
  console.log('CLIENT-SIDE FETCH: Adding new comment: /api/comment/add', addCommentDto);
  return api.post('/comment/add', addCommentDto);
};

export const getCommentsByPetId = (petId) => {
  console.log(`CLIENT-SIDE FETCH: Requesting comments for pet: /api/comment/getCommentByPet/${petId}`);
  return api.get(`/comment/getCommentByPet/${petId}`);
};

export const deleteComment = (commentId) => {
  console.log(`CLIENT-SIDE FETCH: Deleting comment: /api/comment/delete/${commentId}`);
  return api.delete(`/comment/delete/${commentId}`);
};


export const reportComment = (commentId) => {
  console.log(`CLIENT-SIDE FETCH: Reporting comment: /api/comment/report/${commentId}`);
  return api.put(`/comment/report/${commentId}`);
};