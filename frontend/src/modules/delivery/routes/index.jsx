import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../../shared/layout/DashboardLayout';
import {
    LayoutDashboard,
    ClipboardList,
    Map as MapIcon,
    CircleDollarSign,
    User as UserIcon,
    LocateFixed
} from 'lucide-react';
import Loader from '../../../shared/components/ui/Loader';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const DeliveryLog = lazy(() => import('../pages/DeliveryLog'));
const Profile = lazy(() => import('../pages/Profile'));

console.log("Delivery Routes Module Loaded");

const navItems = [
    { label: 'Dashboard', path: '/delivery', icon: LayoutDashboard, end: true },
    { label: 'Delivery Tracking', path: '/delivery/tracking', icon: LocateFixed },
    { label: 'Assignments', path: '/delivery/tasks', icon: ClipboardList },
    { label: 'Network Map', path: '/delivery/map', icon: MapIcon },
    { label: 'Earnings', path: '/delivery/earnings', icon: CircleDollarSign },
    { label: 'Profile', path: '/delivery/profile', icon: UserIcon },
];

const DeliveryRoutes = () => {
    return (
        <DashboardLayout navItems={navItems} title="Partner Portal">
            <Suspense fallback={<Loader fullScreen />}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tracking" element={<DeliveryLog />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/tasks" element={<div className="p-8 text-gray-400">My Delivery Assignments (WIP)</div>} />
                    <Route path="/map" element={<div className="p-8 text-gray-400">Active Delivery Map (WIP)</div>} />
                    <Route path="/earnings" element={<div className="p-8 text-gray-400">My Earnings & Payouts (WIP)</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </DashboardLayout>
    );
};

export default DeliveryRoutes;
