import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@shared/layout/DashboardLayout';
import { HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineMap, HiOutlineCurrencyDollar, HiOutlineUser } from 'react-icons/hi';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const DeliveryLog = React.lazy(() => import('../pages/DeliveryLog'));
const Profile = React.lazy(() => import('@/pages/Profile'));

const navItems = [
    { label: 'Dashboard', path: '/delivery', icon: HiOutlineViewGrid, end: true },
    { label: 'Delivery Tracking', path: '/delivery/tracking', icon: HiOutlineMap },
    { label: 'Assignments', path: '/delivery/tasks', icon: HiOutlineClipboardList },
    { label: 'Network Map', path: '/delivery/map', icon: HiOutlineMap },
    { label: 'Earnings', path: '/delivery/earnings', icon: HiOutlineCurrencyDollar },
    { label: 'Profile', path: '/delivery/profile', icon: HiOutlineUser },
];

const DeliveryRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Partner Portal">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tracking" element={<DeliveryLog />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tasks" element={<div className="p-8 text-gray-400">My Delivery Assignments (WIP)</div>} />
                <Route path="/map" element={<div className="p-8 text-gray-400">Active Delivery Map (WIP)</div>} />
                <Route path="/earnings" element={<div className="p-8 text-gray-400">My Earnings & Payouts (WIP)</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DeliveryRoutes;
