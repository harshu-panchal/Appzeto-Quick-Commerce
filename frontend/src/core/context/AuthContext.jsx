import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const ROLE_STORAGE_KEYS = {
    customer: 'auth_customer',
    seller: 'auth_seller',
    admin: 'auth_admin',
    delivery: 'auth_delivery'
};

export const AuthProvider = ({ children }) => {
    // Current role based on URL
    const getCurrentRoleFromUrl = () => {
        const path = window.location.pathname;
        if (path.startsWith('/seller')) return 'seller';
        if (path.startsWith('/admin')) return 'admin';
        if (path.startsWith('/delivery')) return 'delivery';
        return 'customer';
    };

    const [authData, setAuthData] = useState({
        customer: JSON.parse(localStorage.getItem(ROLE_STORAGE_KEYS.customer)) || null,
        seller: JSON.parse(localStorage.getItem(ROLE_STORAGE_KEYS.seller)) || null,
        admin: JSON.parse(localStorage.getItem(ROLE_STORAGE_KEYS.admin)) || null,
        delivery: JSON.parse(localStorage.getItem(ROLE_STORAGE_KEYS.delivery)) || null,
    });

    const currentRole = getCurrentRoleFromUrl();
    const user = authData[currentRole];
    const isAuthenticated = !!user;

    const login = (userData) => {
        const role = userData.role?.toLowerCase() || 'customer';
        const storageKey = ROLE_STORAGE_KEYS[role];

        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(userData));
            setAuthData(prev => ({ ...prev, [role]: userData }));
        }
    };

    const logout = () => {
        const role = getCurrentRoleFromUrl();
        const storageKey = ROLE_STORAGE_KEYS[role];

        if (storageKey) {
            localStorage.removeItem(storageKey);
            setAuthData(prev => ({ ...prev, [role]: null }));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: currentRole,
            isAuthenticated,
            authData, // Access all logins if needed
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
