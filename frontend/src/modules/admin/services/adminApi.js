import axiosInstance from '@core/api/axios';

export const adminApi = {
    login: (data) => axiosInstance.post('/admin/login', data),
    signup: (data) => axiosInstance.post('/admin/signup', data),
    getStats: () => axiosInstance.get('/admin/stats'),
    getUsers: () => axiosInstance.get('/admin/users'),
    approveSeller: (id) => axiosInstance.post(`/admin/approve-seller/${id}`),
    getReports: () => axiosInstance.get('/admin/reports'),
    getProfile: () => axiosInstance.get('/admin/profile'),
    updateProfile: (data) => axiosInstance.put('/admin/profile', data),
    updatePassword: (data) => axiosInstance.put('/admin/profile/password', data),

    // Category Management
    getCategories: () => axiosInstance.get('/admin/categories'),
    getCategoryTree: () => axiosInstance.get('/admin/categories?tree=true'),
    createCategory: (formData) => axiosInstance.post('/admin/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateCategory: (id, formData) => axiosInstance.put(`/admin/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteCategory: (id) => axiosInstance.delete(`/admin/categories/${id}`),
    getParentUnits: () => axiosInstance.get('/admin/categories?flat=true'),

    // Product Management
    getProducts: (params) => axiosInstance.get('/products', { params }),
    createProduct: (formData) => axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProduct: (id, formData) => axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
    getOrders: () => axiosInstance.get('/orders/seller-orders'),
    getOrderDetails: (orderId) => axiosInstance.get(`/orders/details/${orderId}`),
};
