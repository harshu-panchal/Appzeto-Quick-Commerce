import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineBadgeCheck, HiOutlineDocumentReport, HiOutlineCog } from 'react-icons/hi';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const Profile = React.lazy(() => import('../../customer/pages/Profile'));

const navItems = [
    { label: 'Overview', path: '/admin', icon: HiOutlineViewGrid },
    { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
    { label: 'Approvals', path: '/admin/approvals', icon: HiOutlineBadgeCheck },
    { label: 'Reports', path: '/admin/reports', icon: HiOutlineDocumentReport },
    { label: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
];

const AdminRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Admin Center">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/approvals" element={<div className="p-8 text-gray-400">Seller Approvals Management (WIP)</div>} />
                <Route path="/reports" element={<div className="p-8 text-gray-400">System Reports & Analytics (WIP)</div>} />
                <Route path="/settings" element={<div className="p-8 text-gray-400">Platform Global Settings (WIP)</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminRoutes;
