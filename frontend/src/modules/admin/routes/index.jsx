import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import {
    LayoutDashboard,
    Tag,
    Box,
    Building2,
    Truck,
    Wallet,
    Banknote,
    Receipt,
    CircleDollarSign,
    Users,
    HelpCircle,
    ClipboardList,
    RotateCcw,
    Settings,
    Terminal,
    Sparkles
} from 'lucide-react';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const CategoryManagement = React.lazy(() => import('../pages/CategoryManagement'));
const ProductManagement = React.lazy(() => import('../pages/ProductManagement'));
const ActiveSellers = React.lazy(() => import('../pages/ActiveSellers'));
const PendingSellers = React.lazy(() => import('../pages/PendingSellers'));
const SellerLocations = React.lazy(() => import('../pages/SellerLocations'));
const ActiveDeliveryBoys = React.lazy(() => import('../pages/ActiveDeliveryBoys'));
const PendingDeliveryBoys = React.lazy(() => import('../pages/PendingDeliveryBoys'));
const DeliveryFunds = React.lazy(() => import('../pages/DeliveryFunds'));
const AdminWallet = React.lazy(() => import('../pages/AdminWallet'));
const WithdrawalRequests = React.lazy(() => import('../pages/WithdrawalRequests'));
const SellerTransactions = React.lazy(() => import('../pages/SellerTransactions'));
const CashCollection = React.lazy(() => import('../pages/CashCollection'));
const CustomerManagement = React.lazy(() => import('../pages/CustomerManagement'));
const CustomerDetail = React.lazy(() => import('../pages/CustomerDetail'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const FAQManagement = React.lazy(() => import('../pages/FAQManagement'));
const OrdersList = React.lazy(() => import('../pages/OrdersList'));
const OrderDetail = React.lazy(() => import('../pages/OrderDetail'));
const SellerDetail = React.lazy(() => import('../pages/SellerDetail'));
const SupportTickets = React.lazy(() => import('../pages/SupportTickets'));
const ReviewModeration = React.lazy(() => import('../pages/ReviewModeration'));
const FleetTracking = React.lazy(() => import('../pages/FleetTracking'));
const CouponManagement = React.lazy(() => import('../pages/CouponManagement'));
const ContentManager = React.lazy(() => import('../pages/ContentManager'));
const NotificationComposer = React.lazy(() => import('../pages/NotificationComposer'));
const AdminSettings = React.lazy(() => import('../pages/AdminSettings'));
const EnvSettings = React.lazy(() => import('../pages/EnvSettings'));
const AdminProfile = React.lazy(() => import('../pages/AdminProfile'));

const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, color: 'indigo', end: true },
    { label: 'Category', path: '/admin/categories', icon: Tag, color: 'rose' },
    { label: 'Product', path: '/admin/products', icon: Box, color: 'amber' },
    {
        label: 'Growth Engine',
        icon: Sparkles,
        color: 'amber',
        children: [
            { label: 'Experience Studio', path: '/admin/experience-studio' },
            { label: 'Notification Blast', path: '/admin/notifications' },
        ]
    },
    {
        label: 'Assurance',
        icon: Receipt,
        color: 'emerald',
        children: [
            { label: 'Support Desk', path: '/admin/support-tickets' },
            { label: 'Moderation', path: '/admin/moderation' },
        ]
    },
    {
        label: 'Manage Sellers',
        icon: Building2,
        color: 'blue',
        children: [
            { label: 'Active Sellers', path: '/admin/sellers/active' },
            { label: 'Pending for Approval', path: '/admin/sellers/pending' },
            { label: 'Seller Locations', path: '/admin/seller-locations' },
            { label: 'Coupons & Promos', path: '/admin/coupons' },
        ]
    },
    {
        label: 'Delivery Boy',
        icon: Truck,
        color: 'emerald',
        children: [
            { label: 'Active Delivery Boy', path: '/admin/delivery-boys/active' },
            { label: 'Pending for Approval', path: '/admin/delivery-boys/pending' },
            { label: 'Fleet Tracking', path: '/admin/tracking' },
            { label: 'Funds Transfer', path: '/admin/delivery-funds' },
        ]
    },
    { label: 'Wallet', path: '/admin/wallet', icon: Wallet, color: 'violet' },
    { label: 'Withdrawals Requests', path: '/admin/withdrawals', icon: Banknote, color: 'cyan' },
    { label: 'Seller Transactions', path: '/admin/seller-transactions', icon: Receipt, color: 'orange' },
    { label: 'Cash Collection', path: '/admin/cash-collection', icon: CircleDollarSign, color: 'green' },
    { label: 'Customers', path: '/admin/customers', icon: Users, color: 'sky' },
    { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle, color: 'pink' },
    {
        label: 'Order List',
        icon: ClipboardList,
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
    { label: 'Billing and Charges', path: '/admin/billing', icon: RotateCcw, color: 'red' },
    { label: 'Settings', path: '/admin/settings', icon: Settings, color: 'slate' },
    { label: 'Env Controls', path: '/admin/env', icon: Terminal, color: 'dark' },
];

const BillingCharges = React.lazy(() => import('../pages/BillingCharges'));

const AdminRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Admin Center">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/profile" element={<AdminProfile />} />
                {/* Lazy routes for new sections */}
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/sellers/active" element={<ActiveSellers />} />
                <Route path="/sellers/active/:id" element={<SellerDetail />} />
                <Route path="/support-tickets" element={<SupportTickets />} />
                <Route path="/moderation" element={<ReviewModeration />} />
                <Route path="/experience-studio" element={<ContentManager />} />
                <Route path="/notifications" element={<NotificationComposer />} />
                <Route path="/coupons" element={<CouponManagement />} />
                <Route path="/sellers/pending" element={<PendingSellers />} />
                <Route path="/seller-locations" element={<SellerLocations />} />
                <Route path="/delivery-boys/active" element={<ActiveDeliveryBoys />} />
                <Route path="/delivery-boys/pending" element={<PendingDeliveryBoys />} />
                <Route path="/tracking" element={<FleetTracking />} />
                <Route path="/delivery-funds" element={<DeliveryFunds />} />
                <Route path="/wallet" element={<AdminWallet />} />
                <Route path="/withdrawals" element={<WithdrawalRequests />} />
                <Route path="/seller-transactions" element={<SellerTransactions />} />
                <Route path="/cash-collection" element={<CashCollection />} />
                <Route path="/customers" element={<CustomerManagement />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/faqs" element={<FAQManagement />} />
                <Route path="/orders/:status" element={<OrdersList />} />
                <Route path="/orders/view/:orderId" element={<OrderDetail />} />
                <Route path="/billing" element={<BillingCharges />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/env" element={<EnvSettings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminRoutes;
