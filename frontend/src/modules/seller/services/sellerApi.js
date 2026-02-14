import axiosInstance from '@core/api/axios';

export const sellerApi = {
    getStats: () => axiosInstance.get('/seller/stats'),
    getProducts: () => axiosInstance.get('/seller/products'),
    updateProduct: (id, data) => axiosInstance.put(`/seller/products/${id}`, data),
    getOrders: () => axiosInstance.get('/seller/orders'),
    getEarnings: () => axiosInstance.get('/seller/earnings'),
};
