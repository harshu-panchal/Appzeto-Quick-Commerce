import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Browse', icon: LayoutGrid, path: '/categories' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { label: 'Profile', icon: User, path: '/profile' },
];

const BottomNav = () => {
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(() => {
        const index = navItems.findIndex(item => item.path === location.pathname);
        return index !== -1 ? index : 0;
    });

    useEffect(() => {
        const index = navItems.findIndex(item => item.path === location.pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [location.pathname]);

    return (
        <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none px-6">
            {/* Nav Container - White frosted glass effect */}
            <div className="pointer-events-auto relative h-[72px] w-full max-w-sm rounded-[36px] bg-white/80 backdrop-blur-xl shadow-xl flex items-center justify-between px-2 shadow-gray-200/50 border border-white/40 overflow-hidden">

                {/* Sliding Glass Sphere (The Magnifying Lens) */}
                <motion.div
                    className="absolute top-1 bottom-1 aspect-square rounded-full z-10 pointer-events-none flex items-center justify-center p-1"
                    initial={false}
                    animate={{ x: `${activeIndex * 100}%` }}
                    style={{
                        left: '2%', // Initial offset padding
                        width: '24%', // Width of one item slot approx
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* The Crystal Clear Glass Visuals - Grey Tinted */}
                    <div className="w-[58px] h-[58px] rounded-full relative overflow-hidden backdrop-brightness-110">
                        {/* 1. Base Grey Glass Body (Translucent grey) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/40 to-gray-600/20 opacity-100 rounded-full border border-white/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)]" />

                        {/* 2. Inner Shadow for Depth (Bottom-Right) */}
                        <div className="absolute inset-0 rounded-full shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.08)]" />

                        {/* 3. Strong Top-Left Specular Highlight (The 'Light Source') */}
                        <div className="absolute top-2 left-3 w-6 h-4 bg-gradient-to-br from-white to-transparent opacity-90 rounded-[100%] blur-[2.5px] transform -rotate-12" />

                        {/* 4. Secondary Soft Highlight (Top-Right) */}
                        <div className="absolute top-3 right-4 w-2.5 h-2.5 bg-white/40 rounded-full blur-[1.5px]" />

                        {/* 5. Bottom Caustic Reflection (Light catching the bottom rim) */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-gradient-to-t from-white/40 to-transparent blur-[2.5px] rounded-b-xl opacity-60" />

                        {/* 6. Thin Sharp Rim Light */}
                        <div className="absolute inset-0 rounded-full border border-white/40 opacity-50" />
                    </div>
                </motion.div>

                {/* Nav Items */}
                {navItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative z-20 flex-1 flex flex-col items-center justify-center p-1"
                            onClick={() => setActiveIndex(index)}
                        >
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.15 : 1, // Balanced magnification
                                    y: isActive ? -2 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="relative flex items-center justify-center w-full h-full"
                            >
                                <item.icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn(
                                        "transition-colors duration-300 drop-shadow-sm",
                                        isActive ? "text-[#0c831f]" : "text-gray-400"
                                    )}
                                />
                            </motion.div>

                            {/* Label */}
                            <motion.span
                                animate={{
                                    opacity: isActive ? 1 : 0.6,
                                    scale: isActive ? 1 : 0.9,
                                    y: isActive ? 3 : 0
                                }}
                                className={cn(
                                    "text-[9px] font-bold tracking-wide mt-1",
                                    isActive ? "text-[#0c831f]" : "text-gray-400"
                                )}
                            >
                                {item.label}
                            </motion.span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
