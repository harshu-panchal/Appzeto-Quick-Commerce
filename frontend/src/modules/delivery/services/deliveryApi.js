import axiosInstance from '@core/api/axios';

export const deliveryApi = {
    login: (data) => axiosInstance.post('/delivery/login', data),
    signup: (data) => axiosInstance.post('/delivery/signup', data),
    verifyOtp: (data) => axiosInstance.post('/delivery/verify-otp', data),
    getStats: () => axiosInstance.get('/delivery/stats'),
    getAssignments: () => axiosInstance.get('/delivery/tasks'),
    updateTaskStatus: (id, status) => axiosInstance.put(`/delivery/tasks/${id}`, { status }),
    getProfile: () => axiosInstance.get('/delivery/profile'),
    updateProfile: (data) => axiosInstance.put('/delivery/profile', data),
};
