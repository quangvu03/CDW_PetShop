// src/services/shippingService.js
import api from './axiosConfig';

export const getShippingMethods = () => api.get('/shipping');
