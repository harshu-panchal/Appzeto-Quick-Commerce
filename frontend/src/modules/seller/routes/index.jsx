import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineUser, HiOutlineTruck } from 'react-icons/hi';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const ProductManagement = React.lazy(() => import('../pages/ProductManagement'));
const AddProduct = React.lazy(() => import('../pages/AddProduct'));
const Orders = React.lazy(() => import('../pages/Orders'));
const Earnings = React.lazy(() => import('../pages/Earnings'));
const Profile = React.lazy(() => import('../../customer/pages/Profile'));

const navItems = [
    { label: 'Dashboard', path: '/seller', icon: HiOutlineViewGrid },
    { label: 'Products', path: '/seller/products', icon: HiOutlineCube },
    { label: 'Orders', path: '/seller/orders', icon: HiOutlineTruck },
    { label: 'Earnings', path: '/seller/earnings', icon: HiOutlineCurrencyDollar },
    { label: 'Profile', path: '/seller/profile', icon: HiOutlineUser },
];

const SellerRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Seller Panel">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default SellerRoutes;
