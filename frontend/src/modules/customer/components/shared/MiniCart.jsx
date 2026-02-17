import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MiniCart = () => {
    const { cart, cartCount } = useCart();

    // Show up to 2 product images
    const displayItems = cart.slice(0, 2);

    return (
        <AnimatePresence>
            {cart.length > 0 && (
                <div
                    key="mini-cart-wrapper"
                    id="mini-cart-target"
                    className="fixed bottom-[74px] md:bottom-24 left-0 right-0 flex justify-center z-[55] pointer-events-none px-4"
                >

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full max-w-[210px] pointer-events-auto"
                    >
                        <Link
                            to="/cart"
                            className="flex items-center gap-2 bg-gradient-to-r from-[#0c831f] via-[#149d29] to-[#0c831f] bg-[length:200%_auto] animate-gradient text-white py-1.5 px-2 pr-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:bg-[#0b721b] transition-all hover:scale-[1.02] active:scale-95 group border border-white/20 relative overflow-hidden"
                        >
                            {/* Shimmer Effect */}
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
                            />

                            {/* Product Avatars Stack */}
                            <div className="flex -space-x-3.5 relative z-10">
                                {displayItems.map((item, index) => (
                                    <div
                                        key={item.id || `cart-item-${index}`}
                                        className="h-8 w-8 rounded-full border-2 border-[#0c831f] bg-white overflow-hidden shadow-sm relative"
                                        style={{ zIndex: 10 - index }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-0.5"
                                        />
                                    </div>
                                ))}
                                {cart.length > 2 && (
                                    <div className="h-8 w-8 rounded-full border-2 border-[#0c831f] bg-[#149d29] flex items-center justify-center text-[9px] font-bold z-0 text-white shadow-inner">
                                        +{cartCount - 2}
                                    </div>
                                )}
                            </div>

                            {/* Text Section */}
                            <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                                <h4 className="text-[12px] font-bold leading-tight truncate">View cart</h4>
                                <p className="text-[9px] opacity-90 font-medium leading-tight">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                            </div>

                            {/* Arrow Icon */}
                            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0 relative z-10">
                                <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gradient-move {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient-move 3s ease infinite;
                }
            `}} />
        </AnimatePresence>
    );
};

export default MiniCart;
