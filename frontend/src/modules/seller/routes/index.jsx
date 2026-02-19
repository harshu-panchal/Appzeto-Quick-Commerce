import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import {
    HiOutlineSquares2X2,
    HiOutlineCube,
    HiOutlineCurrencyDollar,
    HiOutlineUser,
    HiOutlineTruck,
    HiOutlineArchiveBox,
    HiOutlineChartBarSquare,
    HiOutlineCreditCard
} from 'react-icons/hi2';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const ProductManagement = React.lazy(() => import('../pages/ProductManagement'));
const StockManagement = React.lazy(() => import('../pages/StockManagement'));
const AddProduct = React.lazy(() => import('../pages/AddProduct'));
const Orders = React.lazy(() => import('../pages/Orders'));
const Earnings = React.lazy(() => import('../pages/Earnings'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const Transactions = React.lazy(() => import('../pages/Transactions'));
const Profile = React.lazy(() => import('@/pages/Profile'));

const navItems = [
    { label: 'Dashboard', path: '/seller', icon: HiOutlineSquares2X2 },
    { label: 'Products', path: '/seller/products', icon: HiOutlineCube },
    { label: 'Inventory', path: '/seller/inventory', icon: HiOutlineArchiveBox },
    { label: 'Orders', path: '/seller/orders', icon: HiOutlineTruck },
    { label: 'Analytics', path: '/seller/analytics', icon: HiOutlineChartBarSquare },
    { label: 'Transactions', path: '/seller/transactions', icon: HiOutlineCreditCard },
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
                <Route path="/inventory" element={<StockManagement />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default SellerRoutes;
