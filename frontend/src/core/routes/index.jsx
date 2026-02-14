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
const CustomerModule = lazy(() => import('@modules/customer/routes'));
const SellerModule = lazy(() => import('@modules/seller/routes'));
const AdminModule = lazy(() => import('@modules/admin/routes'));
const DeliveryModule = lazy(() => import('@modules/delivery/routes'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
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
        path: '/customer/*',
        element: (
            <ProtectedRoute>
                <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
                    <CustomerModule />
                </RoleGuard>
            </ProtectedRoute>
        ),
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
    {
        path: '*',
        element: <NotFound />,
    },
]);
