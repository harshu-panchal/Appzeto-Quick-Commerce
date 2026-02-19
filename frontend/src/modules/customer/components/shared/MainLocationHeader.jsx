import React, { useState, useEffect } from 'react';
import { Search, Mic, MapPin, ChevronDown, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import LocationDrawer from './LocationDrawer';
import { useLocation } from '../../context/LocationContext';

const MainLocationHeader = ({ categories = [], activeCategory, onCategorySelect }) => {
    const { scrollY } = useScroll();
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const { currentLocation } = useLocation();

    // Search placeholder animation
    const [searchPlaceholder, setSearchPlaceholder] = useState('Search ');
    const [typingState, setTypingState] = useState({
        textIndex: 0,
        charIndex: 0,
        isDeleting: false,
        isPaused: false
    });

    const staticText = "Search ";
    const typingPhrases = ['"bread"', '"milk"', '"chocolate"', '"eggs"', '"chips"'];

    useEffect(() => {
        const { textIndex, charIndex, isDeleting, isPaused } = typingState;
        const currentPhrase = typingPhrases[textIndex];

        if (isPaused) {
            const timeout = setTimeout(() => {
                setTypingState(prev => ({ ...prev, isPaused: false, isDeleting: true }));
            }, 2000); // Pause after full phrase
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (charIndex < currentPhrase.length) {
                    setSearchPlaceholder(staticText + currentPhrase.substring(0, charIndex + 1));
                    setTypingState(prev => ({ ...prev, charIndex: prev.charIndex + 1 }));
                } else {
                    // Finished typing
                    setTypingState(prev => ({ ...prev, isPaused: true }));
                }
            } else {
                // Deleting
                if (charIndex > 0) {
                    setSearchPlaceholder(staticText + currentPhrase.substring(0, charIndex - 1));
                    setTypingState(prev => ({ ...prev, charIndex: prev.charIndex - 1 }));
                } else {
                    // Finished deleting
                    setTypingState(prev => ({
                        ...prev,
                        isDeleting: false,
                        textIndex: (prev.textIndex + 1) % typingPhrases.length
                    }));
                }
            }
        }, isDeleting ? 50 : 100); // 50ms deleting speed, 100ms typing speed

        return () => clearTimeout(timeout);
    }, [typingState]);

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
        <div className="fixed top-0 left-0 right-0 z-[200]">
            <motion.div
                style={{
                    paddingTop: headerPadding,
                    paddingBottom: headerPadding,
                    borderBottomLeftRadius: headerRoundness,
                    borderBottomRightRadius: headerRoundness,
                    opacity: bgOpacity,
                    background: activeCategory?.theme?.gradient || "linear-gradient(to bottom, #25D366, #4ADE80)",
                }}
                className="px-5 shadow-lg relative overflow-hidden transition-colors duration-500"
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
                            <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">{currentLocation.time}</span>
                        </div>
                        <div
                            onClick={() => setIsLocationOpen(true)}
                            className="flex items-center gap-1.5 text-[#1A1A1A] cursor-pointer group scale-100 active:scale-95 transition-transform"
                        >
                            <MapPin size={14} className="fill-current" />
                            <div className="text-[10px] font-bold leading-[1.2] max-w-[240px] bg-white/10 px-1.5 py-0.5 rounded-md group-hover:bg-white/20 transition-colors truncate">
                                {currentLocation.name}
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
                            placeholder={searchPlaceholder}
                            className="flex-1 bg-transparent border-none outline-none py-2.5 text-[#1A1A1A] font-medium placeholder:text-[#1A1A1A]/40 text-base transition-all duration-300"
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
                            overflowY: "hidden"
                        }}
                        className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 relative z-10 snap-x"
                    >
                        {categories.map((cat, idx) => {
                            const isActive = activeCategory?.id === cat.id;
                            return (
                                <BlurFade key={cat.id} delay={0.05 * idx} inView={true}>
                                    <div
                                        onClick={() => onCategorySelect && onCategorySelect(cat)}
                                        className="flex flex-col items-center gap-1 group cursor-pointer flex-shrink-0 snap-start min-w-[60px]"
                                    >
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#1A1A1A] shadow-lg scale-110' : 'bg-white/10 hover:bg-white/20'}`}>
                                            <cat.icon size={22} className={`${isActive ? 'text-white' : 'text-[#1A1A1A]'}`} />
                                        </div>
                                        <span className={`text-[11px] font-bold whitespace-nowrap transition-colors ${isActive ? 'text-[#1A1A1A] scale-105' : 'text-[#1A1A1A]/60'}`}>
                                            {cat.name}
                                        </span>
                                    </div>
                                </BlurFade>
                            );
                        })}
                    </motion.div>
                )}

                {/* Background Decorative patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />
            </motion.div>

            {/* Location Selection Drawer */}
            <LocationDrawer
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
            />
        </div>
    );
};

export default MainLocationHeader;
