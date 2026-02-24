import axiosInstance from '@core/api/axios';

export const customerApi = {
    sendLoginOtp: (data) => axiosInstance.post('/customer/send-login-otp', data),
    sendSignupOtp: (data) => axiosInstance.post('/customer/send-signup-otp', data),
    verifyOtp: (data) => axiosInstance.post('/customer/verify-otp', data),
    getProfile: () => axiosInstance.get('/customer/profile'),
    updateProfile: (data) => axiosInstance.put('/customer/profile', data),
    getCategories: (params) => axiosInstance.get('/categories', { params }),
    getProducts: (params) => axiosInstance.get('/products', { params }),
    getProductById: (id) => axiosInstance.get(`/products/${id}`),

    // Cart
    getCart: () => axiosInstance.get('/cart'),
    addToCart: (data) => axiosInstance.post('/cart/add', data),
    updateCartQuantity: (data) => axiosInstance.put('/cart/update', data),
    removeFromCart: (productId) => axiosInstance.delete(`/cart/remove/${productId}`),
    clearCart: () => axiosInstance.delete('/cart/clear'),

    // Wishlist
    getWishlist: () => axiosInstance.get('/wishlist'),
    addToWishlist: (data) => axiosInstance.post('/wishlist/add', data),
    toggleWishlist: (data) => axiosInstance.post('/wishlist/toggle', data),
    removeFromWishlist: (productId) => axiosInstance.delete(`/wishlist/remove/${productId}`),

    // Orders
    placeOrder: (data) => axiosInstance.post('/orders/place', data),
    getMyOrders: () => axiosInstance.get('/orders/my-orders'),
    getOrderDetails: (orderId) => axiosInstance.get(`/orders/details/${orderId}`),
    cancelOrder: (orderId, data) => axiosInstance.put(`/orders/cancel/${orderId}`, data),

    // Payments
    createPaymentOrder: (data) => axiosInstance.post('/payments/create-order', data),
    verifyPayment: (data) => axiosInstance.post('/payments/verify', data),
};
