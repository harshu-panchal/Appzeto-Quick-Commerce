import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@core/guards/ProtectedRoute';
import RoleGuard from '@core/guards/RoleGuard';
import { UserRole } from '@core/constants/roles';

// Public Pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

// Lazy load modules
const SellerModule = lazy(() => import('@modules/seller/routes'));
const AdminModule = lazy(() => import('@modules/admin/routes'));
const DeliveryModule = lazy(() => import('@modules/delivery/routes'));
const CustomerModule = lazy(() => import('@modules/customer/routes'));

export const router = createBrowserRouter([
    {
        path: '/*',
        element: <CustomerModule />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/seller/*',
        element: (
            <ProtectedRoute>
                <RoleGuard allowedRoles={[UserRole.SELLER]}>
                    <SellerModule />
                </RoleGuard>
            </ProtectedRoute>
        ),
    },
    {
        path: '/admin/*',
        element: (
            <ProtectedRoute>
                <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                    <AdminModule />
                </RoleGuard>
            </ProtectedRoute>
        ),
    },
    {
        path: '/delivery/*',
        element: (
            <ProtectedRoute>
                <RoleGuard allowedRoles={[UserRole.DELIVERY]}>
                    <DeliveryModule />
                </RoleGuard>
            </ProtectedRoute>
        ),
    },
    {
        path: '/unauthorized',
        element: <div className="flex h-screen items-center justify-center">Unauthorized Access</div>,
    },
    // NotFound is handled by CustomerModule's wildcard or specific route, 
    // but we might want a global fallback if none match.
    // Since CustomerModule is at /*, it will match almost everything not matched above.
    // However, createBrowserRouter uses a "best match" or defined order. 
    // If we put /* at the top, it might overshadow others if not careful with exact matches.
    // Actually, distinct paths like /seller, /admin should work fine.
    // But /login and /signup must be defined before /* if inside the same switch, or /* must be at the bottom.
    // In createBrowserRouter array, order matters for greedy matching? 
    // Usually explicit paths are matched first.
    // Let's place the customer root LAST to act as the catch-all for the main app.
]);
