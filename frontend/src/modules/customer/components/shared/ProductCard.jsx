import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '@shared/components/ui/Toast';
import { useCartAnimation } from '../../context/CartAnimationContext';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

import { useProductDetail } from '../../context/ProductDetailContext';

const ProductCard = ({ product, badge, className, compact = false }) => {
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { showToast } = useToast();
    const { animateAddToCart, animateRemoveFromCart } = useCartAnimation();

    const { openProduct } = useProductDetail();
    const [showHeartPopup, setShowHeartPopup] = React.useState(false);

    const imageRef = React.useRef(null);

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isWishlisted = isInWishlist(product.id);

    const handleProductClick = (e) => {
        if (openProduct) {
            e.preventDefault();
            openProduct(product);
        }
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isWishlisted) {
            setShowHeartPopup(true);
            setTimeout(() => setShowHeartPopup(false), 1000);
        }

        toggleWishlistGlobal(product);
        showToast(
            isWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
            isWishlisted ? 'info' : 'success'
        );
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (imageRef.current) {
            animateAddToCart(imageRef.current.getBoundingClientRect(), product.image);
        }
        addToCart(product);
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, 1);
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (quantity === 1) {
            animateRemoveFromCart(product.image);
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, -1);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "flex-shrink-0 w-full rounded-2xl overflow-hidden flex flex-col h-full shadow-sm cursor-pointer transition-all duration-300",
                compact
                    ? "bg-white border-[1.5px] border-emerald-50 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)]"
                    : "bg-[#FAFEF0] border border-green-100",
                className
            )}
            onClick={handleProductClick}
        >
            {/* Top Image Section */}
            <div className={cn("relative pb-0", compact ? "p-2" : "p-2.5")}>
                {/* Badge (Custom or Discount) */}
                {(badge || product.discount || product.originalPrice > product.price) && (
                    <div className={cn(
                        "absolute z-10 bg-[#0c831f] text-white font-[900] rounded-md shadow-sm uppercase tracking-wider flex items-center justify-center",
                        compact ? "top-2 left-2 px-1.5 py-0.5 text-[7px]" : "top-3 left-3 px-2 py-1 text-[9px]"
                    )}>
                        {badge || product.discount || `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                    </div>
                )}

                <button
                    onClick={toggleWishlist}
                    className={cn(
                        "absolute z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all active:scale-90",
                        compact ? "top-2 right-2 h-7 w-7" : "top-3 right-3 h-8 w-8"
                    )}
                >
                    <motion.div
                        whileTap={{ scale: 0.8 }}
                        animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
                    >
                        <Heart
                            size={compact ? 13 : 16}
                            className={cn(isWishlisted ? "text-red-500 fill-current" : "text-neutral-400")}
                        />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showHeartPopup && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 1, y: 0 }}
                            animate={{ scale: 2, opacity: 0, y: -40 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-3 right-3 z-50 pointer-events-none text-red-500"
                        >
                            <Heart size={24} fill="currentColor" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={cn(
                    "block aspect-square w-full overflow-hidden flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-105",
                    compact ? "rounded-xl bg-gray-50/50" : "rounded-xl bg-white/50"
                )}>
                    <img
                        ref={imageRef}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                    />
                </div>

                {/* Floating ADD/Quantity Button */}
                {!compact && (
                    <div className={cn("absolute z-20 -bottom-5 right-3")}>
                        {quantity > 0 ? (
                            <div
                                className="bg-white border-2 border-[#0c831f] text-[#0c831f] rounded-lg flex items-center shadow-lg shadow-green-900/5 overflow-hidden px-1.5 py-1 gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleDecrement}
                                    className="h-9 w-9 rounded-lg hover:bg-green-50 text-[#0c831f]"
                                >
                                    <Minus size={14} strokeWidth={3.5} />
                                </Button>

                                <div className="relative flex items-center justify-center overflow-hidden w-6 h-7">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={quantity}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="absolute font-black text-sm"
                                        >
                                            {quantity}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleIncrement}
                                    className="h-9 w-9 rounded-lg hover:bg-green-50 text-[#0c831f]"
                                >
                                    <Plus size={14} strokeWidth={3.5} />
                                </Button>
                            </div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={handleAddToCart}
                                    className="font-black shadow-lg shadow-green-900/5 border-2 border-[#0c831f] text-[#0c831f] bg-white hover:bg-green-50 transition-colors uppercase h-11 px-7 text-base"
                                >
                                    ADD
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className={cn("flex flex-col flex-1", compact ? "p-3 pt-2 gap-0" : "bg-white/40 p-3 pt-4 gap-0.5")}>
                <div className="flex items-center gap-1.5 mb-1">
                    <div className={cn("border-2 border-green-500 rounded-full flex items-center justify-center", compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5")}>
                        <div className={cn("bg-green-500 rounded-full", compact ? "h-0.5 w-0.5" : "h-1 w-1")} />
                    </div>
                    <div className={cn("bg-blue-50 text-blue-600 font-bold rounded px-1.5 py-0.2 tracking-wide", compact ? "text-[8px]" : "text-[9px]")}>
                        {product.weight || "1 unit"}
                    </div>
                </div>

                <div className={cn(compact ? "h-9" : "h-9")}>
                    <h4 className={cn("font-[600] text-[#1A1A1A] leading-tight line-clamp-2", compact ? "text-[12px]" : "text-[13px]")}>{product.name}</h4>
                </div>

                {/* Delivery Time & Unit info */}
                <div className="flex items-center gap-1.5 text-gray-500 mt-1 mb-2">
                    <Clock size={compact ? 10 : 11} className="text-emerald-500/80" />
                    <span className={cn("font-semibold", compact ? "text-[9px]" : "text-[10px]")}>{product.deliveryTime || "8-12 mins"}</span>
                </div>

                {/* Price Row / ADD Button Combination for compact */}
                <div className="mt-auto flex items-center justify-between gap-1.5">
                    <div className="flex flex-col">
                        <span className={cn("font-[1000] text-[#1A1A1A]", compact ? "text-[13px]" : "text-sm")}>
                            ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                            <span className={cn("font-medium text-gray-400 line-through text-[10px] leading-none")}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>

                    {compact && (
                        quantity > 0 ? (
                            <div className="flex items-center bg-emerald-50 border border-emerald-600 rounded-lg p-0.5">
                                <button onClick={handleDecrement} className="p-1 text-emerald-700 active:scale-95 transition-transform">
                                    <Minus size={12} strokeWidth={3} />
                                </button>
                                <span className="w-5 text-center text-xs font-black text-emerald-900">{quantity}</span>
                                <button onClick={handleIncrement} className="p-1 text-emerald-700 active:scale-95 transition-transform">
                                    <Plus size={12} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                className="bg-[#0c831f] text-white px-4 py-1.5 rounded-lg font-black text-[11px] shadow-[0_4px_12px_rgba(12,131,31,0.2)] active:shadow-none transition-all uppercase tracking-wider"
                            >
                                ADD
                            </motion.button>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
