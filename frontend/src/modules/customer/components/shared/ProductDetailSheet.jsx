import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';
import { X, ChevronDown, Share2, Heart, Search, Clock, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useProductDetail } from '../../context/ProductDetailContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '@shared/components/ui/Toast';
import { cn } from '@/lib/utils'; // Keep existing logic

const ProductDetailSheet = () => {
    const { selectedProduct, isOpen, closeProduct } = useProductDetail();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    // Controls for sheet animation
    const controls = useAnimation();
    const [isExpanded, setIsExpanded] = useState(false);

    // If no product selected, don't render anything (well, Context handles isOpen, but still good check)
    // Removed early return to satisfy Rules of Hooks (hooks must be called in same order)
    // if (!selectedProduct && !isOpen) return null;

    const cartItem = selectedProduct ? cart.find(item => item.id === selectedProduct.id) : null;
    const quantity = cartItem ? cartItem.quantity : 0;
    const isWishlisted = selectedProduct ? isInWishlist(selectedProduct.id) : false;

    useEffect(() => {
        if (isOpen) {
            controls.start("visible");
            document.body.style.overflow = "hidden"; // Prevent background scroll
            document.documentElement.style.overflow = "hidden";
        } else {
            controls.start("hidden");
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
            setIsExpanded(false);
        }

        // Cleanup function to ensure scroll is restored if component unmounts
        return () => {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
        }
    }, [isOpen, controls]);

    const handleDragEnd = (event, info) => {
        const offset = info.offset.y;
        const velocity = info.velocity.y;

        if (offset > 150 || velocity > 200) {
            // Dragged down significantly -> Close
            closeProduct();
        } else if (offset < -20 || velocity < -200) {
            // Dragged up -> Expand
            setIsExpanded(true);
        } else {
            // Snap back to current state (expanded or initial)
        }
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlistGlobal(selectedProduct);
        showToast(
            isWishlisted ? `${selectedProduct.name} removed from wishlist` : `${selectedProduct.name} added to wishlist`,
            isWishlisted ? 'info' : 'success'
        );
    };

    const handleAddToCart = () => {
        addToCart(selectedProduct);
        showToast(`${selectedProduct.name} added to cart`, 'success');
    };

    const handleIncrement = () => updateQuantity(selectedProduct.id, 1);

    const handleDecrement = () => {
        if (quantity === 1) {
            removeFromCart(selectedProduct.id);
        } else {
            updateQuantity(selectedProduct.id, -1);
        }
    };

    // Scroll handler to expand on scroll
    const handleScroll = (e) => {
        if (!isExpanded && e.currentTarget.scrollTop > 5) {
            setIsExpanded(true);
        }
    };

    // Wheel handler for expansion
    const handleWheel = (e) => {
        if (!isExpanded && e.deltaY > 0) {
            setIsExpanded(true);
            e.stopPropagation();
        } else if (isExpanded) {
            // Allow normal scroll but stop propagation to background
            e.stopPropagation();
        }
    };

    if (!selectedProduct) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProduct}
                        className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
                    />

                    {/* Sheet / Modal */}
                    <motion.div
                        drag={isExpanded ? false : "y"} // Only allow vertical drag when not fully expanded for closing gesture
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.7}
                        onDragEnd={handleDragEnd}
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: "100vh",
                            top: "10%", // Match the unexpanded top position
                            bottom: "10%", // Match the unexpanded bottom position
                            left: "50%",
                            x: "-50%",
                            width: "min(90%, 400px)",
                            borderRadius: "24px"
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            top: isExpanded ? 0 : "10%",
                            bottom: isExpanded ? 0 : "10%",
                            left: isExpanded ? 0 : "50%",
                            x: isExpanded ? 0 : "-50%",
                            width: isExpanded ? "100%" : "min(90%, 400px)",
                            borderRadius: isExpanded ? 0 : "24px"
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: "100vh", transition: { duration: 0.3 } }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 400,
                            mass: 0.8
                        }}
                        className={cn(
                            "fixed z-[160] bg-white shadow-2xl overflow-hidden flex flex-col",
                            // "mx-auto" class is redundant with fixed positioning logic
                        )}
                        style={{ willChange: "transform, top, bottom, left, width, border-radius" }}
                    >
                        {/* Drag Handle (Visible only when not fully expanded) */}
                        {!isExpanded && (
                            <div className="absolute top-0 left-0 right-0 h-8 flex justify-center items-center z-50 pointer-events-none">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                            </div>
                        )}

                        {/* Header Actions (Absolute & Sticky) */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-40 pointer-events-none">
                            <motion.button
                                onClick={closeProduct}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm pointer-events-auto"
                            >
                                <ChevronDown size={24} className="text-gray-700" />
                            </motion.button>
                            <div className="flex gap-3 pointer-events-auto">
                                <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                                    <Search size={20} className="text-gray-700" />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={toggleWishlist} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                                    <Heart size={20} className={cn(isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700")} />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                                    <Share2 size={20} className="text-gray-700" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            className={cn(
                                "flex-1 overflow-x-hidden no-scrollbar pb-24 bg-white",
                                isExpanded ? "overflow-y-auto" : "overflow-y-hidden"
                            )}
                            onScroll={handleScroll}
                            onWheel={handleWheel}
                        >
                            {/* Product Image Stage */}
                            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F5F7F8] to-white pt-16 pb-8 px-8 flex items-center justify-center">
                                <motion.img
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                                />
                                {/* Carousel Dots (Mock) */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                </div>
                            </div>

                            {/* Product Info Container */}
                            <div className="px-5 pt-2 pb-6">
                                {/* Delivery Time Badge */}
                                <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-green-100 text-[#15803d] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase mb-3">
                                    <Clock size={12} strokeWidth={3} />
                                    {selectedProduct.deliveryTime || "8 Mins"}
                                </div>

                                <h2 className="text-2xl font-black text-[#1A1A1A] leading-tight mb-2">
                                    {selectedProduct.name}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                                    {selectedProduct.description || "Fresh, firm & great in gravies or sauces. Directly sourced from local farms to ensure maximum freshness and quality."}
                                </p>

                                {/* Variants - Type */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Type</h4>
                                    <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                        <button className="flex-shrink-0 px-4 py-2 bg-white border-2 border-blue-600 text-blue-700 font-bold rounded-xl text-sm shadow-sm shadow-blue-100">
                                            {selectedProduct.name.split(' ')[0] || "Standard"}
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm">
                                            Alternative
                                        </button>
                                    </div>
                                </div>

                                {/* Variants - Quantity */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quantity</h4>
                                    <div className="flex gap-3">
                                        <button className="flex-shrink-0 px-4 py-2 bg-white border-2 border-blue-600 text-blue-700 font-bold rounded-xl text-sm shadow-sm shadow-blue-100 relative overflow-hidden">
                                            {selectedProduct.weight || "1 kg"}
                                            {/* Selection indicator corner */}
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-bl-lg" />
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm">
                                            {parseInt(selectedProduct.weight) * 2 || "2"} kg
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 my-6" />

                                {/* Nutrition / Details (Mock) */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900">Product Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Shelf Life</span>
                                            <span className="font-bold text-gray-800">3 Days</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Country of Origin</span>
                                            <span className="font-bold text-gray-800">India</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-400 block mb-1">FSSAI License</span>
                                            <span className="font-bold text-gray-800">1001234567890</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Customer Care</span>
                                            <span className="font-bold text-gray-800">support@appzeto.com</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-24" /> {/* Bottom spacer for sticky bar */}
                            </div>
                        </div>

                        {/* Sticky Bottom Action Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-400 line-through decoration-gray-400/50">
                                            ₹{selectedProduct.originalPrice || Math.round(selectedProduct.price * 1.2)}
                                        </span>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                                            {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) || 20}% OFF
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-[#1A1A1A]">
                                        ₹{selectedProduct.price}
                                    </div>
                                </div>

                                {quantity > 0 ? (
                                    <div className="flex items-center gap-3 bg-white border-2 border-green-500 rounded-xl p-1.5 shadow-lg shadow-green-100 flex-1 justify-between max-w-[180px]">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleDecrement}
                                            className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors"
                                        >
                                            <Minus size={18} strokeWidth={3} />
                                        </motion.button>
                                        <span className="font-black text-lg text-gray-800 w-8 text-center">{quantity}</span>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleIncrement}
                                            className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-[#1a56db] text-white h-[52px] rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-colors"
                                    >
                                        ADD TO CART
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailSheet;
