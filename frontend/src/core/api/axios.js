import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    (config) => {
        let token = null;
        const url = config.url;

        // 1. Try role-specific token first based on URL
        if (url.startsWith('/seller')) {
            token = localStorage.getItem('auth_seller');
        } else if (url.startsWith('/admin')) {
            token = localStorage.getItem('auth_admin');
        } else if (url.startsWith('/delivery')) {
            token = localStorage.getItem('auth_delivery');
        } else if (url.startsWith('/customer')) {
            token = localStorage.getItem('auth_customer');
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
            let storageKeys = []; // Array of keys to clear

            if (url.startsWith('/seller')) storageKeys.push('auth_seller');
            else if (url.startsWith('/admin')) storageKeys.push('auth_admin');
            else if (url.startsWith('/delivery')) storageKeys.push('auth_delivery');
            else if (url.startsWith('/customer')) storageKeys.push('auth_customer');
            else {
                // For shared routes, try to clear whatever exists
                storageKeys.push('auth_customer', 'auth_seller', 'auth_admin', 'auth_delivery');
            }

            storageKeys.forEach(key => localStorage.removeItem(key));
            window.location.reload(); // Refresh to update auth state
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
