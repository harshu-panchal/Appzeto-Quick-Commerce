import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import { Search, Mic, MapPin, ChevronDown, Star, Home as HomeIcon, Heart, Snowflake, Laptop, Sparkles, Clock, Apple, Baby, Dog, Coffee, Gift, Shirt } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { WordPullUp } from '@/components/ui/word-pull-up';
import ProductCard from '../components/shared/ProductCard';
import MainLocationHeader from '../components/shared/MainLocationHeader';

const categories = [
    {
        id: 1,
        name: 'All',
        icon: HomeIcon,
        theme: {
            gradient: "linear-gradient(to bottom, #25D366, #4ADE80)",
            shadow: "shadow-green-500/20",
            accent: "text-[#1A1A1A]"
        },
        banner: {
            title: "HOUSEFULL",
            subtitle: "SALE",
            floatingElements: "sparkles",
            textColor: "text-white"
        }
    },
    {
        id: 2,
        name: 'Groceries',
        icon: Apple,
        theme: {
            gradient: "linear-gradient(to bottom, #FF9F1C, #FFBF69)",
            shadow: "shadow-orange-500/20",
            accent: "text-orange-900"
        },
        banner: {
            title: "SUPERSAVER",
            subtitle: "FRESH & FAST",
            floatingElements: "leaves",
            textColor: "text-white"
        }
    },
    {
        id: 3,
        name: 'Wedding',
        icon: Heart,
        theme: {
            gradient: "linear-gradient(to bottom, #FF4D6D, #FF8FA3)",
            shadow: "shadow-rose-500/20",
            accent: "text-rose-900"
        },
        banner: {
            title: "WEDDING",
            subtitle: "BLISS",
            floatingElements: "hearts",
            textColor: "text-white"
        }
    },
    {
        id: 4,
        name: 'Winter',
        icon: Snowflake,
        theme: {
            gradient: "linear-gradient(to bottom, #00B4D8, #90E0EF)",
            shadow: "shadow-cyan-500/20",
            accent: "text-cyan-900"
        },
        banner: {
            title: "WINTER",
            subtitle: "CHILLS",
            floatingElements: "snow",
            textColor: "text-white"
        }
    },
    {
        id: 5,
        name: 'Electronics',
        icon: Laptop,
        theme: {
            gradient: "linear-gradient(to bottom, #7209B7, #B5179E)",
            shadow: "shadow-purple-500/20",
            accent: "text-purple-900"
        },
        banner: {
            title: "TECH FEST",
            subtitle: "GADGETS",
            floatingElements: "tech",
            textColor: "text-white"
        }
    },
    {
        id: 6,
        name: 'Beauty',
        icon: Sparkles,
        theme: {
            gradient: "linear-gradient(to bottom, #F72585, #FF70A6)",
            shadow: "shadow-pink-500/20",
            accent: "text-pink-900"
        },
        banner: {
            title: "GLOW UP",
            subtitle: "BEAUTY",
            floatingElements: "stars",
            textColor: "text-white"
        }
    },
    {
        id: 7,
        name: 'Baby Care',
        icon: Baby,
        theme: {
            gradient: "linear-gradient(to bottom, #4CC9F0, #A0E7E5)",
            shadow: "shadow-blue-500/20",
            accent: "text-blue-900"
        },
        banner: {
            title: "LITTLE ONE",
            subtitle: "CARE",
            floatingElements: "bubbles",
            textColor: "text-white"
        }
    },
    {
        id: 8,
        name: 'Pet Care',
        icon: Dog,
        theme: {
            gradient: "linear-gradient(to bottom, #FB8500, #FFB703)",
            shadow: "shadow-yellow-500/20",
            accent: "text-yellow-900"
        },
        banner: {
            title: "PAWSOME",
            subtitle: "DEALS",
            floatingElements: "bones",
            textColor: "text-white"
        }
    },
    {
        id: 9,
        name: 'Bakery',
        icon: Coffee,
        theme: {
            gradient: "linear-gradient(to bottom, #BC6C25, #DDA15E)",
            shadow: "shadow-amber-500/20",
            accent: "text-amber-900"
        },
        banner: {
            title: "FRESHLY",
            subtitle: "BAKED",
            floatingElements: "smoke",
            textColor: "text-white"
        }
    },
    {
        id: 10,
        name: 'Fashion',
        icon: Shirt,
        theme: {
            gradient: "linear-gradient(to bottom, #4361EE, #4895EF)",
            shadow: "shadow-indigo-500/20",
            accent: "text-indigo-900"
        },
        banner: {
            title: "STYLE",
            subtitle: "ICON",
            floatingElements: "confetti",
            textColor: "text-white"
        }
    },
    {
        id: 11,
        name: 'Gifts',
        icon: Gift,
        theme: {
            gradient: "linear-gradient(to bottom, #EF233C, #D90429)",
            shadow: "shadow-red-500/20",
            accent: "text-red-900"
        },
        banner: {
            title: "JOY OF",
            subtitle: "GIVING",
            floatingElements: "ribbons",
            textColor: "text-white"
        }
    },
];

const bestsellerCategories = [
    {
        id: 1,
        name: "Chips & Namkeen",
        images: [
            "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1599490659223-e1539e76926a?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1621444541669-451006c1103d?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
    {
        id: 2,
        name: "Bakery & Biscuits",
        images: [
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1581339399838-2a120c18bba3?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
    {
        id: 3,
        name: "Vegetable & Fruits",
        images: [
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1518843025960-d70213740685?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
    {
        id: 4,
        name: "Oil, Ghee & Masala",
        images: [
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1596797038558-9c50f16ee64b?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
    {
        id: 5,
        name: "Sweet & Chocolates",
        images: [
            "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1526081347589-7fa3cb419ee7?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1542841791-192d99906b27?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
    {
        id: 6,
        name: "Drinks & Juices",
        images: [
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1625772290748-39126cdd9fe9?auto=format&fit=crop&q=80&w=200&h=200",
            "https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=200&h=200"
        ]
    },
];

const Home = () => {
    const { scrollY } = useScroll();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    // Fade out banner as user scrolls (0 to 100px)
    // Parallax effect for banner - moves slower than scroll
    const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);
    const y = useTransform(scrollY, [0, 300], [0, 80]); // Positive Y moves down as we scroll up = Parallax
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
    const pointerEvents = useTransform(scrollY, [0, 100], ["auto", "none"]);

    // Helper to render dynamic floating elements
    const renderFloatingElements = (type) => {
        const count = 12; // Number of particles

        const getParticleContent = (index) => {
            switch (type) {
                case 'hearts': return index % 2 === 0 ? <Heart fill="white" size={16} /> : <div className="h-2 w-2 bg-white rounded-full" />;
                case 'snow': return <Snowflake fill="white" size={index % 2 === 0 ? 14 : 10} />;
                case 'tech': return <div className={`border border-white/50 ${index % 2 === 0 ? 'h-3 w-3 rounded-none' : 'h-2 w-6 rounded-sm'}`} />;
                case 'leaves': return <div className="bg-white/80 h-3 w-3 rounded-tr-[10px] rounded-bl-[10px]" />;
                case 'stars': return <Star fill="white" size={14} className="text-white" />;
                case 'bubbles': return <div className="rounded-full border border-white/60" style={{ width: index % 2 === 0 ? 12 : 8, height: index % 2 === 0 ? 12 : 8 }} />;
                case 'bones': return index % 2 === 0 ? <Dog size={14} className="text-white" /> : <div className="h-2 w-2 bg-white rounded-full" />;
                case 'confetti': return <div className={`bg-white/90 ${index % 2 === 0 ? 'h-3 w-1' : 'h-2 w-2 rounded-full'}`} />;
                default: return <div className={`rounded-full blur-[0.5px] ${index % 3 === 0 ? 'bg-white/80 h-2 w-2' : 'bg-white/40 h-1 w-1'}`} />;
            }
        };

        return [...Array(count)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                }}
                animate={{
                    x: [0, Math.random() * 40 - 20, 0],
                    y: [0, Math.random() * -60, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1.5, 0.5],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5
                }}
            >
                {getParticleContent(i)}
            </motion.div>
        ));
    };

    return (
        <CustomerLayout showHeader={false}>
            <div className="min-h-screen bg-[#F5F7F8] pt-[248px] md:pt-[258px]">
                {/* Top Dynamic Gradient Section */}
                <MainLocationHeader
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategorySelect={setActiveCategory}
                />

                {/* Promotional Banner Section - Now with higher z-index and scroll-fade */}
                <motion.div
                    style={{ opacity, y, scale, pointerEvents }}
                    className="px-5 -mt-[21px] relative z-[110]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            boxShadow: ["0px 10px 30px rgba(37, 211, 102, 0.2)", "0px 25px 60px rgba(37, 211, 102, 0.5)", "0px 10px 30px rgba(37, 211, 102, 0.2)"]
                        }}
                        whileHover={{
                            scale: 1.02,
                            rotate: [0, -1, 1, 0],
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        // Dynamic Background based on theme
                        style={{ background: activeCategory.theme.gradient }}
                        className="rounded-2xl p-6 shadow-2xl relative overflow-hidden border-4 border-white group cursor-pointer transition-colors duration-500"
                    >
                        {/* Shimmer Effect Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                            animate={{ x: ["100%", "-100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                        />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <motion.div
                                className="flex gap-4 mb-2 items-center"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: 1,
                                    y: [0, -10, 0],
                                    rotate: [0, 3, -3, 0]
                                }}
                                transition={{
                                    scale: {
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 4.2,
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 10
                                    },
                                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                }}
                            >
                                <motion.div
                                    className="text-yellow-400"
                                    animate={{
                                        rotate: [0, 45, -45, 0],
                                        scale: [1, 1.5, 0.8, 1.3, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles size={32} fill="currentColor" className="drop-shadow-lg" />
                                </motion.div>

                                <WordPullUp
                                    className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] select-none uppercase transform -rotate-1 flex"
                                    words={activeCategory.banner.title}
                                />

                                <motion.div
                                    className="text-yellow-400"
                                    animate={{
                                        rotate: [0, -45, 45, 0],
                                        scale: [1, 1.3, 1.5, 0.7, 1]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    <Sparkles size={32} fill="currentColor" className="drop-shadow-lg" />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [-3, 0, -3]
                                }}
                                transition={{
                                    scale: {
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 4.2,
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 15,
                                        delay: 0.2
                                    },
                                    rotate: {
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 4.2,
                                        delay: 0.2
                                    }
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 2,
                                    boxShadow: "0px 15px 30px rgba(0,0,0,0.4)"
                                }}
                                className="z-20 cursor-popout"
                            >
                                <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] bg-[#1A1A1A] px-6 py-2 -mt-2 transform relative overflow-hidden flex items-center gap-2 rounded-lg border-t-2 border-white/20">
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                                        }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    >
                                        {activeCategory.banner.subtitle}
                                    </motion.span>
                                </h3>
                            </motion.div>

                            {/* Dynamic Playful Floating Elements */}
                            {renderFloatingElements(activeCategory.banner.floatingElements)}
                        </div>

                        {/* Energetic highlight stars */}
                        <motion.div
                            className="absolute top-2 right-4 text-yellow-300 pointer-events-none"
                            animate={{
                                scale: [1, 2, 1, 1.5, 1],
                                rotate: [0, 90, 180, 270, 360],
                                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-2 left-4 text-yellow-300 pointer-events-none"
                            animate={{
                                x: [0, 20, -10, 0],
                                y: [0, -30, 10, 0],
                                rotate: [0, -45, 45, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </motion.div>

                        {/* Playful background blobs */}
                        <motion.div
                            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>

                {/* Bestsellers Section */}
                <div className="p-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[22px] font-black text-[#1A1A1A] tracking-tight">Bestsellers</h3>
                        <span className="text-[#0c831f] font-extrabold text-sm hover:underline cursor-pointer">View All</span>
                    </div>

                    <div className="grid grid-cols-3 gap-x-3 gap-y-3">
                        {bestsellerCategories.map((cat, idx) => (
                            <BlurFade key={cat.id} delay={0.25 + (idx * 0.05)} inView={true}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/category/${cat.name}`)}
                                    className="flex flex-col group cursor-pointer"
                                >
                                    <div className="bg-white rounded-xl shadow-[0_12px_24px_-10px_rgba(0,0,0,0.12)] border border-gray-50 flex flex-col relative overflow-hidden h-[180px]">
                                        {/* Image Grid Area */}
                                        <div className="p-2 gap-1.5 grid grid-cols-2 flex-1">
                                            {cat.images.map((img, idx) => (
                                                <div key={idx} className="bg-[#F8F9FA] rounded-lg overflow-hidden flex items-center justify-center p-1.5 border border-gray-50">
                                                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Glassy Overlay for Badge (Shifted downwards) */}
                                        <div className="absolute bottom-[42px] left-0 right-0 flex justify-center pointer-events-none">
                                            <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/60 shadow-sm transform scale-90 translate-y-2">
                                                <span className="text-[8px] font-black text-[#1A1A1A] uppercase tracking-wider">4+ ITEMS</span>
                                            </div>
                                        </div>

                                        {/* Integrated Label Area */}
                                        <div className="bg-[#F8F9FA]/50 border-t border-gray-50 px-2 py-3 mt-auto">
                                            <span className="text-[10px] font-black text-center block leading-tight text-[#1A1A1A] group-hover:text-[#0c831f] transition-colors line-clamp-2">
                                                {cat.name}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </BlurFade>
                        ))}
                    </div>
                </div>

                {/* Lowest Price ever Section */}
                <div className="mt-6 mb-2">
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#0c831f]/10 via-[#0c831f]/5 to-transparent p-5 py-7 border-y border-[#0c831f]/10 shadow-sm">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 h-40 w-40 bg-[#0c831f]/10 rounded-full blur-3xl opacity-60" />
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-yellow-400/10 rounded-full blur-3xl opacity-60" />

                        <div className="relative z-10 flex justify-between items-center mb-6 px-1">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight leading-none">Lowest Price ever</h3>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="h-1 w-1 bg-[#0c831f] rounded-full animate-pulse" />
                                    <span className="text-[11px] font-extrabold text-[#0c831f] uppercase tracking-wider">Best deals in town</span>
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full text-[#0c831f] font-bold text-xs cursor-pointer shadow-md border border-[#0c831f]/5"
                            >
                                See all <ChevronDown size={14} className="-rotate-90" />
                            </motion.div>
                        </div>

                        <div className="relative z-10 flex overflow-x-auto gap-4 pb-2 no-scrollbar -mx-5 px-5 snap-x">
                            {[
                                { id: 1, name: "Fresh Pineapple", price: 449, originalPrice: 499, weight: "1kg", image: "https://images.unsplash.com/photo-1550258114-b838e9766c9d?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "8 mins", ratings: 5 },
                                { id: 2, name: "Organic Wild Honey", price: 450, originalPrice: 500, weight: "250g", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "10 mins", ratings: 4 },
                                { id: 3, name: "Handcrafted Chocolate", price: 280, originalPrice: 350, weight: "100g", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "12 mins", ratings: 5 },
                                { id: 4, name: "Fresh Blueberries", price: 190, originalPrice: 200, weight: "125g", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "10 mins", ratings: 5 },
                            ].map((product, idx) => (
                                <BlurFade key={product.id} delay={0.6 + (idx * 0.05)} inView={true}>
                                    <div className="w-[135px] flex-shrink-0 snap-start">
                                        <ProductCard product={product} className="bg-white/80 shadow-md border-green-50/30 hover:bg-white transition-colors" compact={true} />
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area (Scrollable Daily Essentials) */}
                <div className="p-5 mt-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black text-[#1A1A1A]">Daily Essentials</h3>
                        <span className="text-[#0c831f] font-bold text-sm">See all</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 101, name: "Fresh Banana", price: 60, originalPrice: 70, weight: "1 doz", image: "https://images.unsplash.com/photo-1571771894821-ad996211fdf4?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "9 mins", ratings: 4 },
                            { id: 102, name: "Farm Fresh Eggs", price: 90, originalPrice: 110, weight: "6 pcs", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "11 mins", ratings: 5 },
                            { id: 103, name: "Double Toned Milk", price: 55, originalPrice: 60, weight: "1L", image: "https://images.unsplash.com/photo-1563636619-e910019335cd?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "8 mins", ratings: 4 },
                            { id: 104, name: "Whole Wheat Bread", price: 40, originalPrice: 50, weight: "400g", image: "https://images.unsplash.com/photo-1589367920969-ab8e050bab3e?auto=format&fit=crop&q=80&w=300&h=300", deliveryTime: "12 mins", ratings: 5 },
                        ].map((product, idx) => (
                            <BlurFade key={product.id} delay={0.4 + (idx * 0.05)} inView={true}>
                                <div className="h-full">
                                    <ProductCard product={product} compact={true} />
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Home;
