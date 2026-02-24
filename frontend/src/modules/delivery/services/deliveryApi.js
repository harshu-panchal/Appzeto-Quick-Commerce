import axiosInstance from '@core/api/axios';

export const deliveryApi = {
    sendLoginOtp: (data) => axiosInstance.post('/delivery/send-login-otp', data),
    sendSignupOtp: (data) => axiosInstance.post('/delivery/send-signup-otp', data),
    verifyOtp: (data) => axiosInstance.post('/delivery/verify-otp', data),
    getProfile: () => axiosInstance.get('/delivery/profile'),
    updateProfile: (data) => axiosInstance.put('/delivery/profile', data),
    getAvailableOrders: () => axiosInstance.get('/orders/available'),
    acceptOrder: (orderId) => axiosInstance.put(`/orders/accept/${orderId}`),
    getOrderDetails: (orderId) => axiosInstance.get(`/orders/details/${orderId}`),
};
