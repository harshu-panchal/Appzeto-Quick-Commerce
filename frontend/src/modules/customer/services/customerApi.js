import axiosInstance from '@core/api/axios';

export const customerApi = {
    getProducts: () => axiosInstance.get('/customer/products'),
    getCart: () => axiosInstance.get('/customer/cart'),
    checkout: (data) => axiosInstance.post('/customer/checkout', data),
    getOrders: () => axiosInstance.get('/customer/orders'),
};
