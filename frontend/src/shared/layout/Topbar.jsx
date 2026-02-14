import React from 'react';
import { useAuth } from '@core/context/AuthContext';
import { HiOutlineLogout, HiOutlineUserCircle, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed left-64 top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center flex-1">
                <div className="relative w-96 group">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users, orders, or reports..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2.5 hover:bg-gray-50 text-gray-500 rounded-full transition-all relative group">
                    <HiOutlineBell className="h-5 w-5 group-hover:text-primary" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-xl transition-all group">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name}</span>
                </button>
                <div className="h-6 w-px bg-gray-100 mx-2"></div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold text-sm"
                >
                    <HiOutlineLogout className="h-4 w-4" />
                    <span className="hidden sm:block">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;

