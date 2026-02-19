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
                "flex-shrink-0 w-full bg-[#FAFEF0] rounded-xl overflow-hidden border border-green-100 flex flex-col h-full shadow-sm cursor-pointer",
                className
            )}
            onClick={handleProductClick}
        >
            {/* Top Image Section */}
            <div className={cn("relative pb-0", compact ? "p-1.5" : "p-2.5")}>
                {/* Badge (Custom or Discount) */}
                {(badge || product.discount || product.originalPrice > product.price) && (
                    <div className={cn(
                        "absolute z-10 bg-[#0c831f] text-white font-black rounded-lg shadow-sm uppercase",
                        compact ? "top-1.5 left-1.5 px-1.5 py-0.5 text-[8px]" : "top-3 left-3 px-2 py-1 text-[9px]"
                    )}>
                        {badge || product.discount || `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                    </div>
                )}

                <button
                    onClick={toggleWishlist}
                    className={cn(
                        "absolute z-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors",
                        compact ? "top-1.5 right-1.5 h-6 w-6" : "top-3 right-3 h-8 w-8"
                    )}
                >
                    <motion.div
                        whileTap={{ scale: 0.8 }}
                        animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
                    >
                        <Heart
                            size={compact ? 12 : 16}
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

                <div className="block aspect-square w-full rounded-xl overflow-hidden bg-white/50 flex items-center justify-center p-1.5">
                    <img
                        ref={imageRef}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>

                {/* Floating ADD/Quantity Button */}
                <div className={cn("absolute z-20", compact ? "-bottom-3 right-1.5" : "-bottom-4 right-3")}>
                    {quantity > 0 ? (
                        <div
                            className={cn(
                                "bg-white border-2 border-green-50 text-[#0c831f] rounded-lg flex items-center shadow-xl shadow-green-900/5",
                                compact ? "px-1 py-0.5 gap-0.5" : "px-1.5 py-1 gap-1"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDecrement}
                                className={cn("flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors", compact ? "h-5 w-5" : "h-7 w-7")}
                            >
                                <Minus size={compact ? 10 : 12} strokeWidth={3.5} />
                            </motion.button>
                            <span className={cn("text-center font-black", compact ? "w-2.5 text-[10px]" : "w-3 text-xs")}>{quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleIncrement}
                                className={cn("flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors", compact ? "h-5 w-5" : "h-7 w-7")}
                            >
                                <Plus size={compact ? 10 : 12} strokeWidth={3.5} />
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className={cn(
                                "bg-white border-2 border-green-50 text-[#0c831f] rounded-lg font-black shadow-xl shadow-green-900/5 hover:bg-green-50 transition-colors",
                                compact ? "px-3 py-1 text-[10px]" : "px-5 py-2 text-[13px]"
                            )}
                        >
                            ADD
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Info Section */}
            {/* Info Section */}
            <div className={cn("flex flex-col flex-1 bg-white/40", compact ? "p-2 pt-3 gap-0" : "p-3 pt-4 gap-0.5")}>
                <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Diet Indicator (Veg default for now) */}
                    <div className={cn("border-2 border-green-500 rounded-full flex items-center justify-center", compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5")}>
                        <div className={cn("bg-green-500 rounded-full", compact ? "h-0.5 w-0.5" : "h-1 w-1")} />
                    </div>
                    {/* Weight Badge */}
                    <div className={cn("bg-blue-50 text-blue-600 font-bold rounded-md", compact ? "text-[8px] px-1 py-0" : "text-[9px] px-1.5 py-0.5")}>
                        {product.weight || "1kg"}
                    </div>
                </div>

                <div>
                    <h4 className={cn("font-bold text-[#1A1A1A] leading-tight line-clamp-2", compact ? "text-[11px]" : "text-[13px]")}>{product.name}</h4>
                </div>

                {/* Delivery Time (Mocked) */}
                <div className="flex items-center gap-1 text-gray-400 mt-0.5 mb-1">
                    <Clock size={compact ? 9 : 11} className="text-green-500/60" />
                    <span className={cn("font-medium", compact ? "text-[9px]" : "text-[10px]")}>{product.deliveryTime || "8 mins"}</span>
                </div>

                {/* Price Button with MRP - Pushed to bottom */}
                <div className="mt-auto pt-1 flex items-center gap-1.5">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "bg-[#0c831f] text-white rounded-lg font-bold flex items-center gap-1 shadow-[0_3px_0_0_rgba(10,103,24,0.8)] active:shadow-none active:translate-y-[1px] transition-all",
                            compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-sm"
                        )}
                    >
                        ₹ {product.price}
                    </motion.button>
                    {product.originalPrice > product.price && (
                        <span className={cn("font-medium text-gray-400 line-through decoration-gray-400/50 decoration-1", compact ? "text-[9px]" : "text-[11px]")}>
                            ₹{product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
