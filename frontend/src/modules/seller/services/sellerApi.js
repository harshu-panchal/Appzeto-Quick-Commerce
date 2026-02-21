import axiosInstance from '@core/api/axios';

export const sellerApi = {
    login: (data) => axiosInstance.post('/seller/login', data),
    signup: (data) => axiosInstance.post('/seller/signup', data),
    getStats: () => axiosInstance.get('/seller/stats'),
    getProducts: () => axiosInstance.get('/seller/products'),
    updateProduct: (id, data) => axiosInstance.put(`/seller/products/${id}`, data),
    getOrders: () => axiosInstance.get('/seller/orders'),
    getEarnings: () => axiosInstance.get('/seller/earnings'),
    getProfile: () => axiosInstance.get('/seller/profile'),
    updateProfile: (data) => axiosInstance.put('/seller/profile', data),
};
