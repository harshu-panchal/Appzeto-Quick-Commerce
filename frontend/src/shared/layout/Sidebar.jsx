import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HiChevronDown } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const colorMap = {
    indigo:
        "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100/50",
    rose: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-100/50",
    amber:
        "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100/50",
    blue: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100/50",
    emerald:
        "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100/50",
    violet:
        "text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-100/50",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100/50",
    orange:
        "text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100/50",
    green:
        "text-green-600 bg-green-50 border-green-100 group-hover:bg-green-100/50",
    sky: "text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-100/50",
    pink: "text-pink-600 bg-pink-50 border-pink-100 group-hover:bg-pink-100/50",
    fuchsia:
        "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100 group-hover:bg-fuchsia-100/50",
    red: "text-red-600 bg-red-50 border-red-100 group-hover:bg-red-100/50",
    slate:
        "text-slate-600 bg-slate-50 border-slate-100 group-hover:bg-slate-100/50",
    dark: "text-gray-800 bg-gray-100 border-gray-200 group-hover:bg-gray-200/50",
};

const SidebarItem = ({
    item,
    isOpen,
    onToggle,
    isHovered,
    onMouseEnter,
    onMouseLeave,
}) => {
    const location = useLocation();

    const hasChildren = item.children && item.children.length > 0;
    const isChildActive =
        hasChildren &&
        item.children.some((child) => location.pathname === child.path);

    if (hasChildren) {
        return (
            <div className="space-y-1">
                <button
                    onClick={onToggle}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={cn(
                        "w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 group relative overflow-hidden",
                        isChildActive || isOpen
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/10"
                            : "text-gray-400 hover:text-white",
                    )}>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                layoutId="hover-highlight"
                                className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <div className="flex items-center space-x-3.5 z-10">
                        <div
                            className={cn(
                                "p-2 rounded-lg transition-all duration-500 shadow-lg",
                                isChildActive || isOpen
                                    ? "bg-primary text-white shadow-primary/40 ring-4 ring-primary/20"
                                    : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300",
                            )}>
                            {item.icon && <item.icon className="h-4.5 w-4.5" />}
                        </div>
                        <span
                            className={cn(
                                "text-sm tracking-tight transition-all duration-300",
                                isChildActive || isOpen ? "font-bold" : "font-semibold",
                            )}>
                            {item.label}
                        </span>
                    </div>
                    <div
                        className={cn(
                            "transition-all duration-300 z-10",
                            isOpen
                                ? "rotate-180 text-primary"
                                : "rotate-0 text-gray-600 group-hover:text-gray-400",
                        )}>
                        <HiChevronDown className="h-4 w-4" />
                    </div>
                </button>
                {isOpen && (
                    <div className="pl-12.5 pr-4 py-1 space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-500">
                        {item.children.map((child) => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                end={child.end !== undefined ? child.end : false}
                                className={({ isActive }) =>
                                    cn(
                                        "block text-sm py-2 px-3 rounded-lg transition-all duration-300 relative",
                                        isActive
                                            ? "text-white font-bold bg-white/10 shadow-sm ring-1 ring-white/5"
                                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5",
                                    )
                                }>
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        )}
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
            end={item.end !== undefined ? item.end : false}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={({ isActive }) =>
                cn(
                    "flex items-center space-x-3.5 rounded-xl px-4 py-3 transition-all duration-300 group relative overflow-hidden",
                    isActive
                        ? "bg-primary text-white shadow-[0_10px_30px_rgba(var(--primary),0.3)]"
                        : "text-gray-400 hover:text-white",
                )
            }>
            {({ isActive }) => (
                <>
                    <AnimatePresence>
                        {isHovered && !isActive && (
                            <motion.div
                                layoutId="hover-highlight"
                                className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <div
                        className={cn(
                            "p-2 rounded-lg transition-all duration-500 shadow-md z-10",
                            isActive
                                ? "bg-white/20 text-white"
                                : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300",
                        )}>
                        {item.icon && <item.icon className="h-4.5 w-4.5" />}
                    </div>
                    <span
                        className={cn(
                            "text-sm tracking-tight transition-all duration-300 z-10",
                            isActive ? "font-bold" : "font-semibold",
                        )}>
                        {item.label}
                    </span>
                    {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-l-full animate-in slide-in-from-right-1" />
                    )}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = ({ items, title }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const handleToggle = (label) => {
        setOpenMenu((prev) => (prev === label ? null : label));
    };

    return (
        <aside className="fixed left-0 inset-y-0 w-64 bg-[#0a0c10] text-gray-400 border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.4)] flex flex-col z-50 overflow-hidden">
            <div className="flex-shrink-0 flex h-24 items-center px-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent z-10">
                <div className="flex items-center space-x-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 transform -rotate-6 hover:rotate-0 transition-all duration-500 ease-out">
                        <span className="text-2xl font-black italic">A</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white leading-none">
                            Appzeto
                        </h1>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5 block">
                            {title}
                        </span>
                    </div>
                </div>
            </div>

            <nav
                data-lenis-prevent
                onMouseLeave={() => setHoveredIdx(null)}
                className="mt-6 px-5 space-y-2 flex-1 overflow-y-auto overscroll-none custom-scrollbar-dark min-h-0 pb-10 relative z-20">
                <p className="px-5 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">
                    Core Management
                </p>
                <AnimatePresence>
                    {items.map((item, idx) => (
                        <SidebarItem
                            key={idx}
                            item={item}
                            isOpen={openMenu === item.label}
                            onToggle={() => handleToggle(item.label)}
                            isHovered={hoveredIdx === idx}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => { }} // Handle in nav container
                        />
                    ))}
                </AnimatePresence>
            </nav>

            <div className="p-6 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent flex-shrink-0">
                <div className="bg-white/5 rounded-2xl p-4 shadow-sm border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group cursor-pointer">
                    <div className="flex items-center space-x-3.5">
                        <div className="relative group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-all duration-500">
                                A
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-[#0a0c10] shadow-sm animate-pulse"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                                Admin Console
                            </p>
                            <p className="text-[10px] text-gray-500 truncate font-black uppercase tracking-widest">
                                Super Admin
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
