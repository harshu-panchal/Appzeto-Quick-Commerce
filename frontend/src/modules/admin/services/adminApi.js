import axiosInstance from '@core/api/axios';

export const adminApi = {
    getStats: () => axiosInstance.get('/admin/stats'),
    getUsers: () => axiosInstance.get('/admin/users'),
    approveSeller: (id) => axiosInstance.post(`/admin/approve-seller/${id}`),
    getReports: () => axiosInstance.get('/admin/reports'),
};
