import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineShoppingCart, HiOutlineClipboardList, HiOutlineUser } from 'react-icons/hi';

const Home = lazy(() => import('../pages/Home'));
const ProductListing = lazy(() => import('../pages/ProductListing'));
const Cart = lazy(() => import('../pages/Cart'));
const Orders = lazy(() => import('../pages/Orders'));
const Profile = lazy(() => import('../pages/Profile'));

const navItems = [
    { label: 'Home', path: '/customer', icon: HiOutlineHome },
    { label: 'Products', path: '/customer/products', icon: HiOutlineShoppingBag },
    { label: 'Cart', path: '/customer/cart', icon: HiOutlineShoppingCart },
    { label: 'Orders', path: '/customer/orders', icon: HiOutlineClipboardList },
    { label: 'Profile', path: '/customer/profile', icon: HiOutlineUser },
];

const CustomerRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Customer App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default CustomerRoutes;
