import React, { useState, useEffect } from 'react';
import { Search, Mic, MapPin, ChevronDown, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MainLocationHeader = ({ categories = [] }) => {
    const { scrollY } = useScroll();

    // Smooth scroll interpolations
    const headerPadding = useTransform(scrollY, [0, 160], [12, 8]);
    const headerRoundness = useTransform(scrollY, [0, 160], [40, 24]);
    const bgOpacity = useTransform(scrollY, [0, 160], [1, 0.98]);

    // Content animations
    const contentHeight = useTransform(scrollY, [0, 160], ["50px", "0px"]);
    const contentOpacity = useTransform(scrollY, [0, 160], [1, 0]);
    const navHeight = useTransform(scrollY, [0, 200], ["82px", "0px"]);
    const navOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const navMargin = useTransform(scrollY, [0, 200], [6, 0]);

    // Helper to hide elements completely when collapsed to prevent clicks
    const displayContent = useTransform(scrollY, (value) => value > 160 ? "none" : "block");
    const displayNav = useTransform(scrollY, (value) => value > 200 ? "none" : "flex");

    return (
        <div className="fixed top-0 left-0 right-0 z-[100]">
            <motion.div
                style={{
                    paddingTop: headerPadding,
                    paddingBottom: headerPadding,
                    borderBottomLeftRadius: headerRoundness,
                    borderBottomRightRadius: headerRoundness,
                    opacity: bgOpacity
                }}
                className="bg-gradient-to-b from-[#25D366] to-[#4ADE80] px-5 shadow-lg relative overflow-hidden"
            >
                {/* Collapsible Delivery Info & Location */}
                <motion.div
                    style={{
                        height: contentHeight,
                        opacity: contentOpacity,
                        marginBottom: navMargin,
                        display: displayContent,
                        overflow: "hidden"
                    }}
                    className="flex justify-between items-start relative z-10"
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">12-15 mins</span>
                            <span className="text-[9px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest bg-white/25 px-1.5 py-0.5 rounded-full">DHAKAD SNAZZY</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#1A1A1A] cursor-pointer group">
                            <MapPin size={14} className="fill-current" />
                            <div className="text-[10px] font-bold leading-[1.2] max-w-[240px] bg-white/10 px-1.5 py-0.5 rounded-md group-hover:bg-white/20 transition-colors">
                                Indore, Madhya Pradesh 452010...
                            </div>
                            <ChevronDown size={12} className="opacity-60" />
                        </div>
                    </div>


                </motion.div>

                {/* Search Bar - Always Visible */}
                <div className="relative z-10">
                    <div className="bg-white rounded-xl px-1.5 py-0.5 shadow-xl flex items-center border border-black/5">
                        <div className="pl-3 pr-2">
                            <Search size={20} className="text-[#1A1A1A]" />
                        </div>
                        <input
                            type="text"
                            placeholder='Search "bread"'
                            className="flex-1 bg-transparent border-none outline-none py-2.5 text-[#1A1A1A] font-medium placeholder:text-[#1A1A1A]/40 text-base"
                        />
                        <div className="flex items-center gap-3 px-4 border-l border-gray-100">
                            <Mic size={20} className="text-[#1A1A1A]/60" />
                        </div>
                    </div>
                </div>

                {/* Categories Navigation - Smooth Collapse */}
                {categories.length > 0 && (
                    <motion.div
                        style={{
                            height: navHeight,
                            opacity: navOpacity,
                            marginTop: navMargin,
                            display: displayNav,
                            overflow: "hidden"
                        }}
                        className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 relative z-10 snap-x"
                    >
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex flex-col items-center gap-1 group cursor-pointer flex-shrink-0 snap-start min-w-[60px]">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${cat.active ? 'bg-[#1A1A1A] shadow-lg' : 'bg-white/10'}`}>
                                    <cat.icon size={22} className={`${cat.active ? 'text-white' : 'text-[#1A1A1A]'}`} />
                                </div>
                                <span className={`text-[11px] font-bold whitespace-nowrap ${cat.active ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/60'}`}>{cat.name}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Background Decorative patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />
            </motion.div>
        </div>
    );
};

export default MainLocationHeader;
