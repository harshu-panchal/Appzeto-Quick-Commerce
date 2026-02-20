import React from 'react';
import { useAuth } from '@core/context/AuthContext';
import { HiOutlineLogout, HiOutlineUserCircle, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed left-64 top-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 z-40 flex items-center justify-between px-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center flex-1">
                <div className="relative w-[450px] group">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-all duration-300" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-12 pr-6 py-2.5 bg-gray-100/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all duration-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="p-3 hover:bg-primary/5 text-gray-500 hover:text-primary rounded-2xl transition-all duration-300 relative group">
                    <HiOutlineBell className="h-6 w-6" />
                    <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-rose-500 rounded-full ring-4 ring-white shadow-sm"></span>
                </button>
                <div className="h-10 w-px bg-gray-100 mx-2"></div>
                <button
                    onClick={() => {
                        if (location.pathname.startsWith('/admin')) {
                            navigate('/admin/profile');
                        } else if (location.pathname.startsWith('/seller')) {
                            navigate('/seller/profile');
                        } else {
                            navigate('/profile');
                        }
                    }}
                    className="flex items-center space-x-3 p-1.5 pr-4 hover:bg-gray-50 rounded-2xl transition-all duration-300 group ring-1 ring-transparent hover:ring-gray-100 shadow-sm hover:shadow-md"
                >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'Demo User'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.role || 'Member'}</p>
                    </div>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-5 py-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-rose-100/50"
                >
                    <HiOutlineLogout className="h-5 w-5" />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;

