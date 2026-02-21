import axiosInstance from '@core/api/axios';

export const adminApi = {
    login: (data) => axiosInstance.post('/admin/login', data),
    signup: (data) => axiosInstance.post('/admin/signup', data),
    getStats: () => axiosInstance.get('/admin/stats'),
    getUsers: () => axiosInstance.get('/admin/users'),
    approveSeller: (id) => axiosInstance.post(`/admin/approve-seller/${id}`),
    getReports: () => axiosInstance.get('/admin/reports'),
};
