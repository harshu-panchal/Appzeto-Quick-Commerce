import axiosInstance from '@core/api/axios';

export const customerApi = {
    login: (data) => axiosInstance.post('/customer/login', data),
    signup: (data) => axiosInstance.post('/customer/signup', data),
    verifyOtp: (data) => axiosInstance.post('/customer/verify-otp', data),
    getProfile: () => axiosInstance.get('/customer/profile'),
    updateProfile: (data) => axiosInstance.put('/customer/profile', data),
    getCategories: () => axiosInstance.get('/admin/categories?status=active'),
};
