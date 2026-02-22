import axiosInstance from '@core/api/axios';

export const sellerApi = {
    login: (data) => axiosInstance.post('/seller/login', data),
    signup: (data) => axiosInstance.post('/seller/signup', data),
    // Products
    getProducts: (params) => axiosInstance.get('/products/seller/me', { params }),
    getProductById: (id) => axiosInstance.get(`/products/${id}`),
    createProduct: (data) => axiosInstance.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

    // Categories (Public)
    getCategories: () => axiosInstance.get('/admin/categories'),
    getCategoryTree: () => axiosInstance.get('/admin/categories?tree=true'),

    // Others
    getStats: () => axiosInstance.get('/seller/stats'),
    getOrders: () => axiosInstance.get('/orders/seller-orders'),
    updateOrderStatus: (orderId, data) => axiosInstance.put(`/orders/status/${orderId}`, data),
    getEarnings: () => axiosInstance.get('/seller/earnings'),
    getProfile: () => axiosInstance.get('/seller/profile'),
    updateProfile: (data) => axiosInstance.put('/seller/profile', data),
};
