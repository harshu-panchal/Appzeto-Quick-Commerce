import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    (config) => {
        let token = null;
        const url = config.url;

        // Determine which token to use based on the API route
        if (url.startsWith('/seller')) {
            const sellerData = JSON.parse(localStorage.getItem('auth_seller'));
            token = sellerData?.token;
        } else if (url.startsWith('/admin')) {
            const adminData = JSON.parse(localStorage.getItem('auth_admin'));
            token = adminData?.token;
        } else if (url.startsWith('/delivery')) {
            const deliveryData = JSON.parse(localStorage.getItem('auth_delivery'));
            token = deliveryData?.token;
        } else if (url.startsWith('/customer')) {
            const customerData = JSON.parse(localStorage.getItem('auth_customer'));
            token = customerData?.token;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Map URL to storage key for targeted logout
            const url = originalRequest.url;
            let storageKey = 'auth_customer';
            if (url.startsWith('/seller')) storageKey = 'auth_seller';
            if (url.startsWith('/admin')) storageKey = 'auth_admin';
            if (url.startsWith('/delivery')) storageKey = 'auth_delivery';

            localStorage.removeItem(storageKey);
            window.location.reload(); // Refresh to update auth state
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
