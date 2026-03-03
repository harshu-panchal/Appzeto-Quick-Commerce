import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MiniCart = () => {
    const { cart, cartCount } = useCart();
    const location = useLocation();

    // Show up to 2 product images
    const displayItems = cart.slice(0, 2);

    const path = location.pathname.replace(/\/$/, '') || '/';

    // Hide MiniCart on checkout page and order details page
    const isCheckoutPage = path === '/checkout' || path === '/cart';
    const isOrderDetailsPage = path.startsWith('/orders');

    return (
        <AnimatePresence>
            {cart.length > 0 && !isCheckoutPage && !isOrderDetailsPage && (
                <div
                    key="mini-cart-wrapper"
                    id="mini-cart-target"
                    className="fixed bottom-[100px] md:bottom-24 left-0 right-0 flex justify-center z-[55] pointer-events-none px-4"
                >

                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.9 }}
                        className="w-full max-w-[200px] pointer-events-auto"
                    >
                        <Link
                            to="/checkout"
                            className="flex items-center gap-3 bg-[#0c831f] text-white py-2 px-3 rounded-full shadow-[0_10px_30px_rgba(12,131,31,0.3)] hover:scale-[1.02] active:scale-95 transition-all group border border-white/10 relative"
                        >
                            {/* Single Product Image Icon */}
                            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                                {cart.length > 0 && (
                                    <img
                                        src={cart[0].image}
                                        alt={cart[0].name}
                                        className="w-full h-full object-contain p-1"
                                    />
                                )}
                            </div>

                            {/* Text Section */}
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                <h4 className="text-[13px] font-black leading-tight truncate">View cart</h4>
                                <p className="text-[10px] opacity-90 font-bold leading-tight">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                            </div>

                            {/* Arrow Icon in circle */}
                            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <ChevronRight size={18} strokeWidth={3} className="text-white" />
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
