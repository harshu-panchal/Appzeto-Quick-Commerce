import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import LocationDrawer from "./LocationDrawer";
import { useLocation } from "../../context/LocationContext";
import { useProductDetail } from "../../context/ProductDetailContext";
import { cn } from "@/lib/utils";
import LogoImage from "../../../../assets/Logo.png";

// MUI Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ChevronDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const MainLocationHeader = ({
  categories = [],
  activeCategory,
  onCategorySelect,
}) => {
  const { scrollY } = useScroll();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { currentLocation } = useLocation();
  const { isOpen: isProductDetailOpen } = useProductDetail();
  const navigate = useNavigate();

  // Search Logic
  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/search', { state: { query: e.target.value } });
    }
  };

  // Search placeholder animation
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search ");
  const [typingState, setTypingState] = useState({
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isPaused: false,
  });

  const staticText = "Search ";
  const typingPhrases = [
    '"bread"',
    '"milk"',
    '"chocolate"',
    '"eggs"',
    '"chips"',
  ];

  useEffect(() => {
    const { textIndex, charIndex, isDeleting, isPaused } = typingState;
    const currentPhrase = typingPhrases[textIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setTypingState((prev) => ({
          ...prev,
          isPaused: false,
          isDeleting: true,
        }));
      }, 2000); // Pause after full phrase
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (charIndex < currentPhrase.length) {
            setSearchPlaceholder(
              staticText + currentPhrase.substring(0, charIndex + 1),
            );
            setTypingState((prev) => ({
              ...prev,
              charIndex: prev.charIndex + 1,
            }));
          } else {
            // Finished typing
            setTypingState((prev) => ({ ...prev, isPaused: true }));
          }
        } else {
          // Deleting
          if (charIndex > 0) {
            setSearchPlaceholder(
              staticText + currentPhrase.substring(0, charIndex - 1),
            );
            setTypingState((prev) => ({
              ...prev,
              charIndex: prev.charIndex - 1,
            }));
          } else {
            // Finished deleting
            setTypingState((prev) => ({
              ...prev,
              isDeleting: false,
              textIndex: (prev.textIndex + 1) % typingPhrases.length,
            }));
          }
        }
      },
      isDeleting ? 50 : 100,
    ); // 50ms deleting speed, 100ms typing speed

    return () => clearTimeout(timeout);
  }, [typingState]);

  // Smooth scroll interpolations
  const headerPadding = useTransform(scrollY, [0, 160], [16, 12]);
  const headerRoundness = useTransform(scrollY, [0, 160], [0, 24]);
  const bgOpacity = useTransform(scrollY, [0, 160], [1, 0.98]);

  // Content animations
  const contentHeight = useTransform(scrollY, [0, 160], ["40px", "0px"]);
  const contentOpacity = useTransform(scrollY, [0, 160], [1, 0]);
  const navHeight = useTransform(scrollY, [0, 200], ["85px", "0px"]);
  const navOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const navMargin = useTransform(scrollY, [0, 200], [4, 0]);
  const categorySpacing = useTransform(scrollY, [0, 200], [12, 0]);

  // Helper to hide elements completely when collapsed to prevent clicks
  const displayContent = useTransform(scrollY, (value) =>
    value > 160 ? "none" : "block",
  );
  const displayNav = useTransform(scrollY, (value) =>
    value > 200 ? "none" : "flex",
  );

  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[200]",
        isProductDetailOpen && "hidden md:block"
      )}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            paddingTop: headerPadding,
            paddingBottom: headerPadding,
            borderBottomLeftRadius: headerRoundness,
            borderBottomRightRadius: headerRoundness,
            opacity: bgOpacity,
          }}
          className="px-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-emerald-700 via-green-800 to-emerald-900 border-b border-white/5 sticky top-0">

          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />

          {/* Desktop/Tablet Header Layout (md and above) */}
          <div className="hidden md:flex items-center justify-between relative z-20 px-2 lg:px-6 mb-4 mt-1">
            {/* Left Section: Logo + Location row */}
            <div className="flex items-center gap-4 lg:gap-8">
              <div
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer group shrink-0"
              >
                <div className="group-hover:scale-110 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                  <img
                    src={LogoImage}
                    alt="Appzeto Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Location Block (Desktop inline row) */}
              <div className="flex flex-col border-l border-white/10 pl-4 lg:pl-8 h-10 justify-center">
                <div className="flex items-center gap-1.5 opacity-70">
                  <AccessTimeIcon sx={{ fontSize: 13, color: 'white' }} />
                  <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                    {currentLocation.time}
                  </span>
                </div>
                <div
                  onClick={() => setIsLocationOpen(true)}
                  className="flex items-center gap-1 text-white hover:text-yellow-300 cursor-pointer group active:scale-95 transition-all">
                  <LocationOnIcon sx={{ fontSize: 14, color: 'inherit' }} />
                  <div className="text-[13px] font-bold leading-tight max-w-[150px] lg:max-w-[180px] truncate">
                    {currentLocation.name}
                  </div>
                  <ChevronDownIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </div>
              </div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-1 max-w-[450px] lg:max-w-2xl px-6">
              <motion.div
                onClick={handleSearchClick}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-white rounded-full px-4 h-11 shadow-md flex items-center border border-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-400 cursor-pointer"
              >
                <SearchIcon sx={{ color: '#64748b', fontSize: 20 }} />
                <input
                  type="text"
                  placeholder={searchPlaceholder || "Search Products..."}
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none pl-2 text-slate-800 font-semibold placeholder:text-slate-300 text-[15px] cursor-pointer"
                />
                <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                  <MicIcon sx={{ color: '#0c831f', fontSize: 20 }} />
                </div>
              </motion.div>
            </div>

            {/* Right Section: Action Icons */}
            <div className="flex items-center gap-5 lg:gap-8 shrink-0">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/wishlist')}
                className="text-white hover:text-red-400 transition-all"
              >
                <FavoriteBorderOutlinedIcon sx={{ fontSize: 24 }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/checkout')}
                className="text-white hover:text-yellow-300 transition-all relative group"
              >
                <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-emerald-900 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-green-800 shadow-sm transition-transform group-hover:-translate-y-0.5">
                  0
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/profile')}
                className="text-white lg:bg-white/10 p-1.5 lg:rounded-full hover:bg-white hover:text-emerald-900 transition-all"
              >
                <AccountCircleOutlinedIcon sx={{ fontSize: 28 }} />
              </motion.button>
            </div>
          </div>

          {/* Collapsible Delivery Info & Location (MOBILE ONLY) */}
          <div className="md:hidden">
            <motion.div
              style={{
                height: contentHeight,
                opacity: contentOpacity,
                marginBottom: navMargin,
                overflow: "hidden",
              }}
              className="flex justify-between items-start relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <AccessTimeIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                  <span className="text-base font-bold text-white tracking-tight leading-none">
                    {currentLocation.time}
                  </span>
                </div>
                <div
                  onClick={() => setIsLocationOpen(true)}
                  className="flex items-center gap-1 text-white/80 cursor-pointer group active:scale-95 transition-transform">
                  <LocationOnIcon sx={{ fontSize: 14, color: 'white' }} />
                  <div className="text-[10px] font-medium leading-tight max-w-[200px] truncate">
                    {currentLocation.name}
                  </div>
                  <ChevronDownIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search Bar (MOBILE ONLY) */}
          <div className="relative z-10 mt-1.5 flex items-center gap-2 md:hidden">
            <motion.div
              onClick={handleSearchClick}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white rounded-full px-4 h-11 shadow-md flex items-center border border-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-400 cursor-pointer"
            >
              <SearchIcon sx={{ color: '#64748b', fontSize: 20 }} />
              <input
                type="text"
                placeholder={searchPlaceholder || "Search Products..."}
                readOnly
                className="flex-1 bg-transparent border-none outline-none pl-2 text-slate-800 font-semibold placeholder:text-slate-300 text-[15px] cursor-pointer"
              />
              <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                <MicIcon sx={{ color: '#0c831f', fontSize: 20 }} />
              </div>
            </motion.div>
          </div>

          {/* Categories Navigation - Smooth Collapse */}
          {categories.length > 0 && (
            <motion.div
              style={{
                height: navHeight,
                opacity: navOpacity,
                marginTop: categorySpacing,
                display: displayNav,
                overflowY: "hidden",
              }}
              className="flex items-center md:justify-center gap-2 md:gap-4 lg:gap-8 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 md:-mx-0 md:px-0 relative z-10 snap-x">
              {categories.slice(0, 10).map((cat, idx) => {
                const isActive = activeCategory?.id === cat.id;
                return (
                  <motion.div
                    key={cat.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategorySelect && onCategorySelect(cat)}
                    className="flex flex-col items-center gap-1 group cursor-pointer flex-shrink-0 snap-start min-w-[50px] md:min-w-[65px] transition-all duration-200">
                    <div
                      className={`h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md ${isActive
                        ? "bg-white text-emerald-800 shadow-lg scale-105"
                        : "bg-white/10 text-white shadow-inner border border-white/10 group-hover:bg-white/20"
                        }`}>
                      {typeof cat.icon === "function" ||
                        (typeof cat.icon === "object" && cat.icon.$$typeof) ? (
                        <cat.icon
                          sx={{ fontSize: { xs: 18, md: 24 }, transition: 'color 0.2s', color: 'inherit' }}
                        />
                      ) : (
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          className="w-4 h-4 md:w-6 md:h-6 object-contain"
                        />
                      )}
                    </div>
                    <span
                      className={`text-[8px] md:text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-colors duration-200 ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                      {cat.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Background Decorative patterns */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        </motion.div>
      </div>

      <LocationDrawer
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </>
  );
};

export default MainLocationHeader;
