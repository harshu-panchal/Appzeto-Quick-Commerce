import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const BottomNav = () => {
    const location = useLocation();
    const { cartCount } = useCart();
    const { count: wishlistCount } = useWishlist();

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Categories', icon: Grid, path: '/categories' },
        { label: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlistCount },
        { label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden flex justify-around items-center">
            <div className="grid h-full max-w-lg grid-cols-4 w-full mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group transition-colors",
                                isActive ? "text-brand-600" : "text-gray-500"
                            )}
                        >
                            <div className="relative">
                                <item.icon className={cn("w-6 h-6 mb-1 group-hover:text-brand-600", isActive && "fill-current")} />
                                {item.badge > 0 && (
                                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#0c831f] border-2 border-white rounded-full -top-2 -end-2 shadow-sm animate-in zoom-in duration-300">
                                        {item.badge}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs group-hover:text-brand-600">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
