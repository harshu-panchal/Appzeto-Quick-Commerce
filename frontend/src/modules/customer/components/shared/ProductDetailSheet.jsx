import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';
import { X, ChevronDown, Share2, Heart, Search, Clock, Minus, Plus, ShoppingBag, Star, MessageSquare } from 'lucide-react';
import { useProductDetail } from '../../context/ProductDetailContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '@shared/components/ui/Toast';
import { cn } from '@/lib/utils';
import { customerApi } from '../../services/customerApi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ProductDetailSheet = () => {
    const { selectedProduct, isOpen, closeProduct } = useProductDetail();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    // Controls for sheet animation
    const controls = useAnimation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const scrollRef = useRef(null);

    const allImages = useMemo(() => {
        if (!selectedProduct) return [];
        const images = [];
        if (selectedProduct.mainImage) images.push(selectedProduct.mainImage);
        else if (selectedProduct.image) images.push(selectedProduct.image);

        if (selectedProduct.galleryImages && Array.isArray(selectedProduct.galleryImages)) {
            images.push(...selectedProduct.galleryImages);
        }
        return images.length > 0 ? images : ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2"];
    }, [selectedProduct]);

    // Update variant when product changes
    useEffect(() => {
        if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
            setSelectedVariant(selectedProduct.variants[0]);
        } else {
            setSelectedVariant(null);
        }
        setActiveImageIndex(0);

        if (selectedProduct?.id) {
            fetchReviews(selectedProduct.id);
        }
    }, [selectedProduct]);

    const fetchReviews = async (productId) => {
        try {
            setReviewLoading(true);
            const res = await customerApi.getProductReviews(productId);
            if (res.data.success) {
                setReviews(res.data.results);
            }
        } catch (error) {
            console.error("Fetch reviews error:", error);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) return;

        try {
            setIsSubmittingReview(true);
            const res = await customerApi.submitReview({
                productId: selectedProduct.id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            if (res.data.success) {
                showToast("Review submitted for moderation", "success");
                setNewReview({ rating: 5, comment: '' });
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to submit review", "error");
        } finally {
            setIsSubmittingReview(false);
        }
    };

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
                            {/* Product Image Carousel */}
                            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F5F7F8] to-white pt-16 pb-8">
                                <div
                                    ref={scrollRef}
                                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full"
                                    onScroll={(e) => {
                                        const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
                                        setActiveImageIndex(index);
                                    }}
                                >
                                    {allImages.map((img, i) => (
                                        <div key={i} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center px-12">
                                            <motion.img
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                src={img}
                                                alt={`${selectedProduct.name} ${i + 1}`}
                                                className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Carousel Dots */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                                        {allImages.map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300",
                                                    i === activeImageIndex ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
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

                                {/* Variants Section */}
                                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Variant</h4>
                                        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                            {selectedProduct.variants.map((v, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedVariant(v)}
                                                    className={cn(
                                                        "flex-shrink-0 px-4 py-2 font-bold rounded-xl text-sm transition-all relative overflow-hidden",
                                                        selectedVariant?.sku === v.sku
                                                            ? "bg-white border-2 border-blue-600 text-blue-700 shadow-sm shadow-blue-100"
                                                            : "bg-gray-50 border border-gray-200 text-gray-600"
                                                    )}
                                                >
                                                    {v.name}
                                                    {selectedVariant?.sku === v.sku && (
                                                        <div className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-bl-lg" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

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

                                <div className="h-px bg-gray-100 my-8" />

                                {/* Reviews Section */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center justify-between">
                                        Customer Reviews
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">
                                            <Star size={14} fill="currentColor" />
                                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '4.8'}
                                        </div>
                                    </h3>

                                    {/* Submissions form (Foldable or inline) */}
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">Rate this product</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">Reviews are moderated</p>

                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setNewReview({ ...newReview, rating: s })}
                                                        className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                                            newReview.rating >= s ? "bg-orange-100 text-orange-500" : "bg-white text-gray-300 border border-gray-100"
                                                        )}
                                                    >
                                                        <Star size={18} className={cn(newReview.rating >= s && "fill-current")} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                placeholder="Write your experience..."
                                                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium min-h-[100px] outline-none focus:border-blue-500/50 transition-all resize-none"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isSubmittingReview}
                                                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black rounded-xl text-xs uppercase tracking-widest"
                                            >
                                                {isSubmittingReview ? "Submitting..." : "Post Review"}
                                            </Button>
                                        </form>
                                    </div>

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        {reviewLoading ? (
                                            <div className="flex justify-center py-8">
                                                <Loader2 className="animate-spin text-blue-600" size={24} />
                                            </div>
                                        ) : reviews.length > 0 ? (
                                            reviews.map((r) => (
                                                <div key={r._id} className="p-5 rounded-2xl border border-gray-100 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600">
                                                                {r.userId?.name?.[0] || "A"}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-800">{r.userId?.name || "Anonymous"}</p>
                                                                <div className="flex gap-0.5">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} size={10} className={cn(i < r.rating ? "text-orange-400 fill-orange-400" : "text-gray-200")} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{r.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No reviews yet</p>
                                            </div>
                                        )}
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
                                            ₹{selectedVariant?.price || selectedProduct.originalPrice}
                                        </span>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                                            {selectedVariant
                                                ? Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)
                                                : Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) || 20}% OFF
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-[#1A1A1A]">
                                        ₹{selectedVariant?.salePrice || selectedVariant?.price || selectedProduct.price}
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
