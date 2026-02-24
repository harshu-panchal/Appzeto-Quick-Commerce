import React, { lazy, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from '../guards/ProtectedRoute';
import RoleGuard from '../guards/RoleGuard';
import { UserRole } from '../constants/roles';
import RootErrorBoundary from '../../shared/components/RootErrorBoundary';

// Providers for Customer Module
import { WishlistProvider } from '../../modules/customer/context/WishlistContext';
import { CartProvider } from '../../modules/customer/context/CartContext';
import { CartAnimationProvider } from '../../modules/customer/context/CartAnimationContext';
import { LocationProvider } from '../../modules/customer/context/LocationContext';
import ScrollToTop from '../../modules/customer/components/shared/ScrollToTop';

// Public Pages
import Auth from '../../modules/seller/pages/Auth';
import AdminAuth from '../../modules/admin/pages/AdminAuth';
import DeliveryAuth from '../../modules/delivery/pages/DeliveryAuth';
import CustomerAuth from '../../modules/customer/pages/CustomerAuth';

// Customer Pages
import Home from '../../modules/customer/pages/Home';
import CategoriesPage from '../../modules/customer/pages/CategoriesPage';
import CategoryProductsPage from '../../modules/customer/pages/CategoryProductsPage';
import WishlistPage from '../../modules/customer/pages/WishlistPage';
import CartPage from '../../modules/customer/pages/CartPage';
import OffersPage from '../../modules/customer/pages/OffersPage';
import ProfilePage from '../../modules/customer/pages/ProfilePage';
import OrdersPage from '../../modules/customer/pages/OrdersPage';
import AddressesPage from '../../modules/customer/pages/AddressesPage';
import WalletPage from '../../modules/customer/pages/WalletPage';
import SettingsPage from '../../modules/customer/pages/SettingsPage';
import SupportPage from '../../modules/customer/pages/SupportPage';
import ChatPage from '../../modules/customer/pages/ChatPage';
import TermsPage from '../../modules/customer/pages/TermsPage';
import PrivacyPage from '../../modules/customer/pages/PrivacyPage';
import AboutPage from '../../modules/customer/pages/AboutPage';
import EditProfilePage from '../../modules/customer/pages/EditProfilePage';
import OrderDetailPage from '../../modules/customer/pages/OrderDetailPage';
import ProductDetailPage from '../../modules/customer/pages/ProductDetailPage';
import CheckoutPage from '../../modules/customer/pages/CheckoutPage';

// Lazy load heavy modules
const SellerModule = lazy(() => import('../../modules/seller/routes/index'));
const AdminModule = lazy(() => import('../../modules/admin/routes/index'));
const DeliveryModule = lazy(() => import('../../modules/delivery/routes/index'));

import CustomerLayout from '../../modules/customer/components/layout/CustomerLayout';

const CustomerLayoutWrapper = () => (
    <LocationProvider>
        <WishlistProvider>
            <CartProvider>
                <CartAnimationProvider>
                    <ScrollToTop />
                    <CustomerLayout>
                        <Outlet />
                    </CustomerLayout>
                </CartAnimationProvider>
            </CartProvider>
        </WishlistProvider>
    </LocationProvider>
);

const AppRouter = () => {
    const router = useMemo(() => createBrowserRouter([
        {
            path: '/',
            element: <Outlet />,
            errorElement: <RootErrorBoundary />,
            children: [
                {
                    path: 'login',
                    element: <CustomerAuth />,
                },
                {
                    path: 'signup',
                    element: <CustomerAuth />,
                },
                {
                    path: 'seller/auth',
                    element: <Auth />,
                },
                {
                    path: 'admin/auth',
                    element: <AdminAuth />,
                },
                {
                    path: 'delivery/auth',
                    element: <DeliveryAuth />,
                },
                {
                    path: 'seller/*',
                    element: (
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[UserRole.SELLER]}>
                                <SellerModule />
                            </RoleGuard>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'admin/*',
                    element: (
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                                <AdminModule />
                            </RoleGuard>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'delivery/*',
                    element: (
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={[UserRole.DELIVERY]}>
                                <DeliveryModule />
                            </RoleGuard>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'unauthorized',
                    element: <div className="flex h-screen items-center justify-center font-outfit">Unauthorized Access</div>,
                },
                {
                    element: <CustomerLayoutWrapper />,
                    children: [
                        { index: true, element: <Home /> },
                        { path: 'categories', element: <CategoriesPage /> },
                        { path: 'category/:categoryName', element: <CategoryProductsPage /> },
                        { path: 'product/:id', element: <ProductDetailPage /> },
                        { path: 'terms', element: <TermsPage /> },
                        { path: 'privacy', element: <PrivacyPage /> },
                        { path: 'about', element: <AboutPage /> },
                        { path: 'offers', element: <OffersPage /> },
                        { path: 'wishlist', element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
                        { path: 'orders', element: <ProtectedRoute><OrdersPage /></ProtectedRoute> },
                        { path: 'orders/:orderId', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
                        { path: 'addresses', element: <ProtectedRoute><AddressesPage /></ProtectedRoute> },
                        { path: 'wallet', element: <ProtectedRoute><WalletPage /></ProtectedRoute> },
                        { path: 'settings', element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
                        { path: 'support', element: <ProtectedRoute><SupportPage /></ProtectedRoute> },
                        { path: 'chat', element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
                        { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
                        { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
                        { path: 'profile/edit', element: <ProtectedRoute><EditProfilePage /></ProtectedRoute> },
                        { path: 'cart', element: <CartPage /> },
                    ]
                },
                {
                    path: '*',
                    element: <Navigate to="/" replace />
                }
            ]
        }
    ]), []);

    return <RouterProvider router={router} />;
};

export default AppRouter;
