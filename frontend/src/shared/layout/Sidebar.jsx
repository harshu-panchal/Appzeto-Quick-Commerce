import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HiChevronDown } from 'react-icons/hi2';

const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100/50',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-100/50',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100/50',
    blue: 'text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100/50',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100/50',
    violet: 'text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-100/50',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100/50',
    orange: 'text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100/50',
    green: 'text-green-600 bg-green-50 border-green-100 group-hover:bg-green-100/50',
    sky: 'text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-100/50',
    pink: 'text-pink-600 bg-pink-50 border-pink-100 group-hover:bg-pink-100/50',
    fuchsia: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100 group-hover:bg-fuchsia-100/50',
    red: 'text-red-600 bg-red-50 border-red-100 group-hover:bg-red-100/50',
    slate: 'text-slate-600 bg-slate-50 border-slate-100 group-hover:bg-slate-100/50',
    dark: 'text-gray-800 bg-gray-100 border-gray-200 group-hover:bg-gray-200/50',
};

const SidebarItem = ({ item, isOpen, onToggle }) => {
    const location = useLocation();
    
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path);
    const colors = colorMap[item.color] || colorMap.indigo;

    if (hasChildren) {
        return (
            <div className="space-y-1">
                <button
                    onClick={onToggle}
                    className={cn(
                        'w-full flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-300 group relative overflow-hidden',
                        (isChildActive || isOpen)
                            ? 'bg-white shadow-sm ring-1 ring-gray-100'
                            : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900'
                    )}
                >
                    <div className="flex items-center space-x-3.5 z-10">
                        <div className={cn(
                            "p-2 rounded-lg transition-all duration-300 shadow-sm",
                            (isChildActive || isOpen) ? colors : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-md"
                        )}>
                            {item.icon && <item.icon className="h-4.5 w-4.5" />}
                        </div>
                        <span className={cn(
                            "text-sm tracking-tight transition-colors duration-300",
                            (isChildActive || isOpen) ? "font-bold text-gray-900" : "font-semibold"
                        )}>
                            {item.label}
                        </span>
                    </div>
                    <div className={cn(
                        "transition-all duration-300 z-10",
                        isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-gray-300 group-hover:text-gray-400'
                    )}>
                        <HiChevronDown className="h-4 w-4" />
                    </div>
                </button>
                {isOpen && (
                    <div className="pl-12.5 pr-4 py-1 space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                        {item.children.map((child) => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                    cn(
                                        'block text-sm py-1.5 px-3 rounded-lg transition-all duration-300 relative',
                                        isActive
                                            ? 'text-gray-900 font-bold bg-white shadow-sm ring-1 ring-gray-100'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full", colors.split(' ')[0].replace('text-', 'bg-'))} />}
                                        {child.label}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                cn(
                    'flex items-center space-x-3.5 rounded-xl px-4 py-2.5 transition-all duration-300 group relative overflow-hidden',
                    isActive
                        ? 'bg-white shadow-md ring-1 ring-gray-100 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900'
                )
            }
        >
            {({ isActive }) => (
                <>
                    <div className={cn(
                        "p-2 rounded-lg transition-all duration-300 shadow-sm",
                        isActive ? colors : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-md"
                    )}>
                        {item.icon && <item.icon className="h-4.5 w-4.5" />}
                    </div>
                    <span className={cn(
                        "text-sm tracking-tight transition-colors duration-300",
                        isActive ? "font-bold" : "font-semibold"
                    )}>
                        {item.label}
                    </span>
                    {isActive && <div className={cn("absolute right-0 top-0 bottom-0 w-1 rounded-l-full animate-in slide-in-from-right-1", colors.split(' ')[0].replace('text-', 'bg-'))} />}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = ({ items, title }) => {
    const [openMenu, setOpenMenu] = useState(null);

    const handleToggle = (label) => {
        setOpenMenu(prev => prev === label ? null : label);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-50/80 backdrop-blur-xl text-gray-900 border-r border-gray-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)] flex flex-col z-50">
            <div className="flex-shrink-0 flex h-20 items-center px-8 border-b border-gray-100/50 bg-white/40">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-xl font-black italic">A</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">Appzeto</h1>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{title}</span>
                    </div>
                </div>
            </div>
            
            <nav className="mt-8 px-5 space-y-1.5 flex-1 overflow-y-auto scrollbar-hide pb-8">
                <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Management</p>
                {items.map((item, idx) => (
                    <SidebarItem 
                        key={idx} 
                        item={item} 
                        isOpen={openMenu === item.label}
                        onToggle={() => handleToggle(item.label)}
                    />
                ))}
            </nav>

            <div className="p-5 border-t border-gray-100/50 bg-white/40 flex-shrink-0">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center space-x-3.5">
                        <div className="relative group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                                A
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm ring-1 ring-emerald-100 animate-pulse"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">Admin Console</p>
                            <p className="text-[10px] text-gray-400 truncate font-semibold uppercase tracking-tight">Super Admin Level</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
