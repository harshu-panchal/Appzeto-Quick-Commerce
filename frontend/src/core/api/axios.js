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
        const pagePath = window.location.pathname;

        // Determination strategy: 
        // 1. If we are on a module-specific page (e.g. /seller/dashboard), prioritize that module's token
        // This is crucial for shared APIs like /products or /admin/categories
        if (pagePath.startsWith('/seller')) {
            token = localStorage.getItem('auth_seller');
        } else if (pagePath.startsWith('/admin')) {
            token = localStorage.getItem('auth_admin');
        } else if (pagePath.startsWith('/delivery')) {
            token = localStorage.getItem('auth_delivery');
        } else if (pagePath.startsWith('/customer')) {
            token = localStorage.getItem('auth_customer');
        }

        // 2. Fallback to URL-based detection
        if (!token) {
            if (url.startsWith('/seller')) token = localStorage.getItem('auth_seller');
            else if (url.startsWith('/admin')) token = localStorage.getItem('auth_admin');
            else if (url.startsWith('/delivery')) token = localStorage.getItem('auth_delivery');
            else if (url.startsWith('/customer') || url.startsWith('/cart') || url.startsWith('/wishlist') || url.startsWith('/categories') || url.startsWith('/products')) {
                token = localStorage.getItem('auth_customer');
            }
        }

        // 3. Final default: if we are on a general page and STILL no token, try customer token
        if (!token && !pagePath.startsWith('/admin') && !pagePath.startsWith('/seller') && !pagePath.startsWith('/delivery')) {
            token = localStorage.getItem('auth_customer');
        }

        // 3. Last fallback: Check common 'token' key if implemented
        if (!token) {
            token = localStorage.getItem('token');
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

            // Determine which token was used or which module we are in
            const pagePath = window.location.pathname;
            let storageKey = null;

            if (pagePath.startsWith('/seller')) storageKey = 'auth_seller';
            else if (pagePath.startsWith('/admin')) storageKey = 'auth_admin';
            else if (pagePath.startsWith('/delivery')) storageKey = 'auth_delivery';
            else if (pagePath.startsWith('/customer')) storageKey = 'auth_customer';

            if (storageKey) {
                localStorage.removeItem(storageKey);
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
