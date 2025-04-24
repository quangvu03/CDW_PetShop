import api from './axiosConfig';

export const updateProfile = (formData) => {
  return api.post('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};