import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '@shared/components/ui/Toast';
import { useCartAnimation } from '../../context/CartAnimationContext';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

import { useProductDetail } from '../../context/ProductDetailContext';

const ProductCard = ({ product, badge, className }) => {
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { showToast } = useToast();
    const { animateAddToCart, animateRemoveFromCart } = useCartAnimation();

    const { openProduct } = useProductDetail();

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
            className={cn("flex-shrink-0 w-full bg-[#FAFEF0] rounded-xl overflow-hidden border border-green-100 flex flex-col h-full shadow-sm cursor-pointer", className)}
            onClick={handleProductClick}
        >
            {/* Top Image Section */}
            <div className="relative p-2.5 pb-0">
                {/* Badge (Custom or Discount) */}
                {(badge || product.discount || product.originalPrice > product.price) && (
                    <div className="absolute top-3 left-3 z-10 bg-[#0c831f] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase">
                        {badge || product.discount || `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 z-10 h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                    <Heart
                        size={16}
                        className={cn(isWishlisted ? "text-red-500 fill-current" : "text-neutral-400")}
                    />
                </button>

                <div className="block aspect-square w-full rounded-xl overflow-hidden bg-white/50 flex items-center justify-center p-1.5">
                    <img
                        ref={imageRef}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>

                {/* Floating ADD/Quantity Button */}
                <div className="absolute -bottom-4 right-3 z-20">
                    {/* ... (existing button code handles stopPropagation) ... */}
                    {quantity > 0 ? (
                        <div className="bg-white border-2 border-green-50 text-[#0c831f] px-1.5 py-1 rounded-lg flex items-center gap-1 shadow-xl shadow-green-900/5" onClick={(e) => e.stopPropagation()}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDecrement}
                                className="h-7 w-7 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <Minus size={12} strokeWidth={3.5} />
                            </motion.button>
                            <span className="w-3 text-center font-black text-xs">{quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleIncrement}
                                className="h-7 w-7 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <Plus size={12} strokeWidth={3.5} />
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="bg-white border-2 border-green-50 text-[#0c831f] px-5 py-2 rounded-lg font-black text-[13px] shadow-xl shadow-green-900/5 hover:bg-green-50 transition-colors"
                        >
                            ADD
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-3 pt-4 flex flex-col gap-0.5 flex-1 bg-white/40">
                <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Diet Indicator (Veg default for now) */}
                    <div className="h-3.5 w-3.5 border-2 border-green-500 rounded-full flex items-center justify-center">
                        <div className="h-1 w-1 bg-green-500 rounded-full" />
                    </div>
                    {/* Weight Badge */}
                    <div className="bg-blue-50 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        {product.weight || "1kg"}
                    </div>
                </div>

                <div>
                    <h4 className="font-black text-[#1A1A1A] text-[13px] leading-none line-clamp-2">{product.name}</h4>
                </div>

                {/* Delivery Time (Mocked) */}
                <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                    <Clock size={11} className="text-green-500/60" />
                    <span className="text-[10px] font-bold">{product.deliveryTime || "8 mins"}</span>
                </div>

                {/* Price Button with MRP */}
                <div className="mt-1.5 pb-0.5 flex items-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#0c831f] text-white px-3 py-1 rounded-lg font-black text-sm flex items-center gap-1 shadow-[0_3px_0_0_rgba(10,103,24,0.8)] active:shadow-none active:translate-y-[1px] transition-all"
                    >
                        ₹ {product.price}
                    </motion.button>
                    {product.originalPrice > product.price && (
                        <span className="text-[11px] font-bold text-gray-400 line-through decoration-gray-400/50 decoration-1">
                            ₹{product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
