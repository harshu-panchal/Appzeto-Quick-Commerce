import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import {
    HiOutlineSquares2X2,
    HiOutlineTag,
    HiOutlineCube,
    HiOutlineBuildingOffice,
    HiOutlineTruck,
    HiOutlineWallet,
    HiOutlineBanknotes,
    HiOutlineReceiptPercent,
    HiOutlineCurrencyDollar,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineReceiptRefund,
    HiOutlineCog6Tooth,
    HiOutlineCommandLine
} from 'react-icons/hi2';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const CategoryManagement = React.lazy(() => import('../pages/CategoryManagement'));
const ProductManagement = React.lazy(() => import('../pages/ProductManagement'));
const ActiveSellers = React.lazy(() => import('../pages/ActiveSellers'));
const PendingSellers = React.lazy(() => import('../pages/PendingSellers'));
const SellerLocations = React.lazy(() => import('../pages/SellerLocations'));
const ActiveDeliveryBoys = React.lazy(() => import('../pages/ActiveDeliveryBoys'));
const PendingDeliveryBoys = React.lazy(() => import('../pages/PendingDeliveryBoys'));
const DeliveryFunds = React.lazy(() => import('../pages/DeliveryFunds'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const Profile = React.lazy(() => import('@/pages/Profile'));

const navItems = [
    { label: 'Overview', path: '/admin', icon: HiOutlineSquares2X2, color: 'indigo' },
    { label: 'Category', path: '/admin/categories', icon: HiOutlineTag, color: 'rose' },
    { label: 'Product', path: '/admin/products', icon: HiOutlineCube, color: 'amber' },
    {
        label: 'Manage Sellers',
        icon: HiOutlineBuildingOffice,
        color: 'blue',
        children: [
            { label: 'Active Sellers', path: '/admin/sellers/active' },
            { label: 'Pending for Approval', path: '/admin/sellers/pending' },
            { label: 'Seller Locations', path: '/admin/seller-locations' },
        ]
    },
    {
        label: 'Delivery Boy',
        icon: HiOutlineTruck,
        color: 'emerald',
        children: [
            { label: 'Active Delivery Boy', path: '/admin/delivery-boys/active' },
            { label: 'Pending for Approval', path: '/admin/delivery-boys/pending' },
            { label: 'Funds Transfer', path: '/admin/delivery-funds' },
        ]
    },
    { label: 'Wallet', path: '/admin/wallet', icon: HiOutlineWallet, color: 'violet' },
    { label: 'Withdrawals Requests', path: '/admin/withdrawals', icon: HiOutlineBanknotes, color: 'cyan' },
    { label: 'Seller Transactions', path: '/admin/seller-transactions', icon: HiOutlineReceiptPercent, color: 'orange' },
    { label: 'Cash Collection', path: '/admin/cash-collection', icon: HiOutlineCurrencyDollar, color: 'green' },
    { label: 'Customers', path: '/admin/customers', icon: HiOutlineUsers, color: 'sky' },
    { label: 'FAQs', path: '/admin/faqs', icon: HiOutlineQuestionMarkCircle, color: 'pink' },
    {
        label: 'Order List',
        icon: HiOutlineClipboardDocumentList,
        color: 'fuchsia',
        children: [
            { label: 'All Orders', path: '/admin/orders/all' },
            { label: 'Pending Orders', path: '/admin/orders/pending' },
            { label: 'Processed Orders', path: '/admin/orders/processed' },
            { label: 'Out for Delivery', path: '/admin/orders/out-for-delivery' },
            { label: 'Delivered', path: '/admin/orders/delivered' },
            { label: 'Cancelled', path: '/admin/orders/cancelled' },
            { label: 'Returned', path: '/admin/orders/returned' },
        ]
    },
    { label: 'Billing and Charges', path: '/admin/billing', icon: HiOutlineReceiptRefund, color: 'red' },
    { label: 'Settings', path: '/admin/settings', icon: HiOutlineCog6Tooth, color: 'slate' },
    { label: 'Env Controls', path: '/admin/env', icon: HiOutlineCommandLine, color: 'dark' },
];

const AdminRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Admin Center">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                {/* Lazy routes for new sections */}
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/sellers/active" element={<ActiveSellers />} />
                <Route path="/sellers/pending" element={<PendingSellers />} />
                <Route path="/seller-locations" element={<SellerLocations />} />
                <Route path="/delivery-boys/active" element={<ActiveDeliveryBoys />} />
                <Route path="/delivery-boys/pending" element={<PendingDeliveryBoys />} />
                <Route path="/delivery-funds" element={<DeliveryFunds />} />
                <Route path="/wallet" element={<div className="p-8 text-gray-400">Wallet Management (WIP)</div>} />
                <Route path="/withdrawals" element={<div className="p-8 text-gray-400">Withdrawals Requests (WIP)</div>} />
                <Route path="/seller-transactions" element={<div className="p-8 text-gray-400">Seller Transactions (WIP)</div>} />
                <Route path="/cash-collection" element={<div className="p-8 text-gray-400">Cash Collection (WIP)</div>} />
                <Route path="/customers" element={<div className="p-8 text-gray-400">Customers Management (WIP)</div>} />
                <Route path="/faqs" element={<div className="p-8 text-gray-400">FAQs Management (WIP)</div>} />
                <Route path="/orders/*" element={<div className="p-8 text-gray-400">Orders Management System (WIP)</div>} />
                <Route path="/billing" element={<div className="p-8 text-gray-400">Billing & Charges (WIP)</div>} />
                <Route path="/settings" element={<div className="p-8 text-gray-400">Platform Global Settings (WIP)</div>} />
                <Route path="/env" element={<div className="p-8 text-gray-400">Environment Controls (WIP)</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminRoutes;
