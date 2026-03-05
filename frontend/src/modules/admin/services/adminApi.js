import axiosInstance from '@core/api/axios';

export const adminApi = {
    login: (data) => axiosInstance.post('/admin/login', data),
    signup: (data) => axiosInstance.post('/admin/signup', data),
    getStats: () => axiosInstance.get('/admin/stats'),
    getUsers: () => axiosInstance.get('/admin/users'),
    getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
    approveSeller: (id) => axiosInstance.post(`/admin/approve-seller/${id}`),
    getAdminWalletData: () => axiosInstance.get('/admin/wallet-data'),
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
    updateOrderStatus: (orderId, data) => axiosInstance.put(`/orders/status/${orderId}`, data),

    // Support Tickets
    getTickets: () => axiosInstance.get('/tickets/admin/all'),
    updateTicketStatus: (id, status) => axiosInstance.patch(`/tickets/admin/status/${id}`, { status }),
    replyTicket: (id, text) => axiosInstance.post(`/tickets/reply/${id}`, { text, isAdmin: true }),

    // Reviews
    getPendingReviews: () => axiosInstance.get('/reviews/admin/pending'),
    updateReviewStatus: (id, status) => axiosInstance.patch(`/reviews/admin/status/${id}`, { status }),

    // Delivery Partners
    getDeliveryPartners: (params) => axiosInstance.get('/admin/delivery-partners', { params }),
    approveDeliveryPartner: (id) => axiosInstance.patch(`/admin/delivery-partners/approve/${id}`),
    rejectDeliveryPartner: (id) => axiosInstance.delete(`/admin/delivery-partners/reject/${id}`),
    getActiveFleet: () => axiosInstance.get('/admin/active-fleet'),

    // Delivery Payouts / Funds
    getDeliveryTransactions: () => axiosInstance.get('/admin/delivery-transactions'),
    settleTransaction: (id) => axiosInstance.put(`/admin/transactions/${id}/settle`),
    bulkSettleDelivery: () => axiosInstance.put('/admin/transactions/bulk-settle-delivery'),

    // Seller Withdrawals
    getSellerWithdrawals: () => axiosInstance.get('/admin/seller-withdrawals'),
    getDeliveryWithdrawals: () => axiosInstance.get('/admin/delivery-withdrawals'),
    getSellerTransactions: () => axiosInstance.get('/admin/seller-transactions'),
    updateWithdrawalStatus: (id, data) => axiosInstance.put(`/admin/withdrawals/${id}`, data),
    // Cash Collection Hub
    getDeliveryCashBalances: () => axiosInstance.get('/admin/delivery-cash'),
    getRiderCashDetails: (id) => axiosInstance.get(`/admin/rider-cash-details/${id}`),
    settleRiderCash: (data) => axiosInstance.post('/admin/settle-cash', data),
    getCashSettlementHistory: () => axiosInstance.get('/admin/cash-history'),

    // FAQ Management
    getFAQs: (params) => axiosInstance.get('/admin/faqs', { params }),
    createFAQ: (data) => axiosInstance.post('/admin/faqs', data),
    updateFAQ: (id, data) => axiosInstance.put(`/admin/faqs/${id}`, data),
    deleteFAQ: (id) => axiosInstance.delete(`/admin/faqs/${id}`),
    // Public FAQs (for profile pages, etc.)
    getPublicFAQs: (params) => axiosInstance.get('/public/faqs', { params }),

    // Experience Studio / Content Manager
    getExperienceSections: (params) => axiosInstance.get('/admin/experience', { params }),
    createExperienceSection: (data) => axiosInstance.post('/admin/experience', data),
    updateExperienceSection: (id, data) => axiosInstance.put(`/admin/experience/${id}`, data),
    deleteExperienceSection: (id) => axiosInstance.delete(`/admin/experience/${id}`),
    reorderExperienceSections: (items) => axiosInstance.put('/admin/experience/reorder', { items }),
    uploadExperienceBanner: (formData) => axiosInstance.post('/admin/experience/upload-banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
