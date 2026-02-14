import React from 'react';
import { useAuth } from '@core/context/AuthContext';
import { HiOutlineLogout, HiOutlineUserCircle, HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed left-64 top-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center">
                <span className="text-sm text-gray-400">Welcome back,</span>
                <span className="ml-1 font-semibold text-gray-700">{user?.name}</span>
            </div>

            <div className="flex items-center space-x-6 text-gray-500">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                    <HiOutlineBell className="h-6 w-6" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <HiOutlineUserCircle className="h-6 w-6" />
                </button>
                <div className="h-8 w-px bg-gray-200"></div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    <HiOutlineLogout className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
