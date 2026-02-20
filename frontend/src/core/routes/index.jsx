import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@core/guards/ProtectedRoute';
import RoleGuard from '@core/guards/RoleGuard';
import { UserRole } from '@core/constants/roles';

// Public Pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import Auth from '@modules/seller/pages/Auth';
import AdminAuth from '@modules/admin/pages/AdminAuth';
import DeliveryAuth from '@modules/delivery/pages/DeliveryAuth';


// Lazy load modules
const SellerModule = lazy(() => import('@modules/seller/routes'));
const AdminModule = lazy(() => import('@modules/admin/routes'));
const DeliveryModule = lazy(() => import('@modules/delivery/routes'));
const CustomerModule = lazy(() => import('@modules/customer/routes'));

export const router = createBrowserRouter([

    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/seller/auth',
        element: <Auth />,
    },
    {
        path: '/admin/auth',
        element: <AdminAuth />,
    },
    {
        path: '/delivery/auth',
        element: <DeliveryAuth />,
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
        path: '/*',
        element: <CustomerModule />,
    },
]);
