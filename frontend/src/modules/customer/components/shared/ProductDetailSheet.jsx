import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronDown, Share2, Heart, Search, Clock, Minus, Plus, ShoppingBag, Star, MessageSquare, ArrowLeft, ChevronRight } from 'lucide-react';
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
    const { cart, cartCount, addToCart, updateQuantity, removeFromCart } = useCart();
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

    // Strip raw RTF/RTF-like codes from description strings from the backend
    const cleanDescription = (text) => {
        if (!text) return null;
        // Detect RTF format
        if (text.trim().startsWith('{\\rtf') || text.includes('\\par')) {
            // Extract readable text: remove RTF control words and braces
            return text
                .replace(/\{\\[^}]*\}/g, '') // Remove groups like {\rtf1 ...}
                .replace(/\\[a-z]+\d*\s?/gi, '') // Remove control words like \par \b \fs22
                .replace(/[{}]/g, '') // Remove remaining braces
                .replace(/\\'/g, "'") // Replace escaped apostrophes
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim()
                .slice(0, 400); // Limit length for display
        }
        return text;
    };

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

    const cleanDesc = cleanDescription(selectedProduct?.description);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - sits above header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProduct}
                        className="fixed inset-0 bg-black/60 z-[220] backdrop-blur-sm"
                    />

                    {/* ============================================================ */}
                    {/* DESKTOP LAYOUT: Wide 2-column modal (hidden on mobile) */}
                    {/* ============================================================ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                        className="hidden md:flex fixed z-[230] top-[72px] bottom-[16px] left-[3%] right-[3%] lg:left-[6%] lg:right-[6%] xl:left-[12%] xl:right-[12%] bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden"
                    >
                        {/* Left: Image Gallery */}
                        <div className="relative w-[42%] lg:w-[45%] flex-shrink-0 bg-gradient-to-br from-[#fafbfc] via-green-50/20 to-white flex flex-col">
                            {/* Back Button */}
                            <button
                                onClick={closeProduct}
                                className="absolute top-5 left-5 z-20 w-11 h-11 bg-white/90 backdrop-blur rounded-2xl shadow-md flex items-center justify-center hover:bg-white transition-all active:scale-90 border border-gray-100"
                            >
                                <ArrowLeft size={22} className="text-[#0c831f]" strokeWidth={3} />
                            </button>
                            {/* Wishlist */}
                            <button
                                onClick={toggleWishlist}
                                className="absolute top-5 right-5 z-20 w-11 h-11 bg-white/90 backdrop-blur rounded-2xl shadow-md flex items-center justify-center hover:bg-white transition-all border border-gray-100"
                            >
                                <Heart size={18} className={cn(isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400')} />
                            </button>

                            {/* Discount Badge */}
                            {(selectedProduct.originalPrice > selectedProduct.price) && (
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-[#0c831f] text-white text-xs font-[900] px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-md">
                                    {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                                </div>
                            )}

                            {/* Main image carousel */}
                            <div
                                ref={scrollRef}
                                className="flex-1 flex overflow-x-auto snap-x snap-mandatory no-scrollbar mt-16"
                                onScroll={(e) => {
                                    const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
                                    setActiveImageIndex(index);
                                }}
                            >
                                {allImages.map((img, i) => (
                                    <div key={i} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-12">
                                        <img
                                            src={img}
                                            alt={`${selectedProduct.name} ${i + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Carousel Dots */}
                            {allImages.length > 1 && (
                                <div className="flex justify-center gap-2 py-5">
                                    {allImages.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { scrollRef.current?.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: 'smooth' }); setActiveImageIndex(i); }}
                                            className={cn('rounded-full transition-all duration-300', i === activeImageIndex ? 'w-7 h-2 bg-[#0c831f]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400')}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Thumbnail strip */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 px-6 pb-5 justify-center">
                                    {allImages.slice(0, 5).map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { scrollRef.current?.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: 'smooth' }); setActiveImageIndex(i); }}
                                            className={cn('w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0', i === activeImageIndex ? 'border-[#0c831f] shadow-md shadow-green-100' : 'border-gray-100 opacity-60 hover:opacity-100')}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info (scrollable) */}
                        <div className="flex-1 flex flex-col border-l border-gray-100/60 overflow-hidden bg-white">
                            <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-7 lg:px-10 lg:py-8 space-y-7">
                                {/* Header: delivery badge + wishlist hint */}
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-green-100 text-[#15803d] px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider">
                                        <Clock size={12} strokeWidth={3} />
                                        {selectedProduct.deliveryTime || '8-15 MINS'}
                                    </div>
                                    {selectedProduct.originalPrice > selectedProduct.price && (
                                        <div className="text-xs font-black text-[#0c831f] bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                                            Save ₹{selectedProduct.originalPrice - selectedProduct.price}
                                        </div>
                                    )}
                                </div>

                                {/* Product Name */}
                                <div>
                                    <h1 className="text-2xl lg:text-[28px] font-[900] text-[#1A1A1A] leading-[1.2] tracking-tight mb-1" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
                                        {selectedProduct.name}
                                    </h1>
                                    {selectedProduct.weight && (
                                        <span className="text-sm text-gray-400 font-semibold">{selectedProduct.weight}</span>
                                    )}
                                </div>

                                {/* Price Row */}
                                <div className="flex items-center gap-4 py-5 px-6 bg-gradient-to-r from-green-50/80 to-emerald-50/40 rounded-2xl border border-green-100/70">
                                    <div className="flex flex-col">
                                        <span className="text-3xl lg:text-4xl font-[900] text-[#0c831f] tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>₹{selectedProduct.price}</span>
                                        {selectedProduct.originalPrice > selectedProduct.price && (
                                            <span className="text-sm text-gray-400 line-through font-medium">₹{selectedProduct.originalPrice}</span>
                                        )}
                                    </div>
                                    <div className="ml-auto">
                                        {quantity > 0 ? (
                                            <div className="flex items-center gap-3 bg-white border-2 border-[#0c831f] rounded-xl p-1.5 shadow-md shadow-green-100">
                                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleDecrement} className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors">
                                                    <Minus size={18} strokeWidth={3} />
                                                </motion.button>
                                                <span className="font-black text-xl text-gray-800 w-8 text-center">{quantity}</span>
                                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleIncrement} className="w-10 h-10 bg-[#0c831f] rounded-lg flex items-center justify-center text-white hover:bg-[#0b721b] transition-colors shadow-md shadow-green-200">
                                                    <Plus size={18} strokeWidth={3} />
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleAddToCart}
                                                className="bg-[#0c831f] text-white h-[52px] px-10 rounded-xl font-black text-base flex items-center gap-2 shadow-xl shadow-green-200 hover:bg-[#0b721b] transition-all uppercase tracking-wide"
                                            >
                                                ADD TO CART
                                            </motion.button>
                                        )}
                                    </div>
                                </div>

                                {/* View Cart */}
                                {cartCount > 0 && (
                                    <Link
                                        to="/checkout"
                                        onClick={closeProduct}
                                        className="w-full bg-[#0c831f] text-white h-[54px] rounded-xl flex items-center justify-between px-5 shadow-lg shadow-green-200/50 hover:bg-[#0b721b] transition-all active:scale-[0.98] block"
                                    >
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[13px] font-[1000] uppercase tracking-wide">View cart</span>
                                            <span className="text-[11px] font-bold opacity-90 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in cart</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[16px] font-[1000] tracking-tight">₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                                            <ChevronRight size={18} strokeWidth={4} />
                                        </div>
                                    </Link>
                                )}

                                {/* Variants */}
                                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                    <div className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100/70">
                                        <h4 className="text-[11px] font-[800] text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Variant</h4>
                                        <div className="flex gap-3 flex-wrap">
                                            {selectedProduct.variants.map((v, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedVariant(v)}
                                                    className={cn(
                                                        'px-5 py-2.5 font-bold rounded-xl text-sm transition-all border-2',
                                                        selectedVariant?.sku === v.sku
                                                            ? 'bg-green-50 border-[#0c831f] text-[#0c831f] shadow-sm'
                                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                                                    )}
                                                >
                                                    {v.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Description */}
                                {cleanDesc && (
                                    <div className="bg-[#fafbfc] rounded-2xl p-5 border border-gray-100/70">
                                        <h3 className="font-[800] text-gray-900 mb-3 text-[15px] tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>About this product</h3>
                                        <p className="text-[13px] text-gray-600 font-medium leading-[1.7]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{cleanDesc}</p>
                                    </div>
                                )}

                                {/* Product Details Grid */}
                                <div>
                                    <h3 className="font-[800] text-gray-900 mb-3 text-[15px] tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Product Details</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {[{ label: 'Shelf Life', value: '3 Days' }, { label: 'Country of Origin', value: 'India' }, { label: 'FSSAI License', value: '1001234567890' }, { label: 'Customer Care', value: 'support@appzeto.com' }].map(d => (
                                            <div key={d.label} className="bg-[#fafbfc] p-4 rounded-xl border border-gray-100/50">
                                                <span className="text-gray-400 text-[10px] block mb-1.5 font-bold uppercase tracking-[0.12em]">{d.label}</span>
                                                <span className="font-[700] text-gray-800 text-[13px]">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Reviews */}
                                <div className="space-y-5">
                                    <h3 className="text-[16px] font-[800] text-gray-900 flex items-center justify-between tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                                        Customer Reviews
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">
                                            <Star size={12} fill="currentColor" />
                                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '4.8'}
                                        </div>
                                    </h3>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <h4 className="font-bold text-gray-800 text-sm mb-3">Rate this product</h4>
                                        <form onSubmit={handleReviewSubmit} className="space-y-3">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })} className={cn('h-9 w-9 rounded-xl flex items-center justify-center transition-all', newReview.rating >= s ? 'bg-orange-100 text-orange-500' : 'bg-white text-gray-300 border border-gray-100')}>
                                                        <Star size={16} className={cn(newReview.rating >= s && 'fill-current')} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Write your experience..." className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-medium min-h-[80px] outline-none focus:border-[#0c831f]/50 transition-all resize-none" />
                                            <Button type="submit" disabled={isSubmittingReview} className="w-full h-11 bg-[#0c831f] hover:bg-[#0b721b] text-white font-black rounded-xl text-xs uppercase tracking-widest">
                                                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                                            </Button>
                                        </form>
                                    </div>
                                    <div className="space-y-3">
                                        {reviewLoading ? (
                                            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[#0c831f]" size={24} /></div>
                                        ) : reviews.length > 0 ? (
                                            reviews.map((r) => (
                                                <div key={r._id} className="p-4 rounded-xl border border-gray-100 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-black text-[#0c831f]">{r.userId?.name?.[0] || 'A'}</div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-800">{r.userId?.name || 'Anonymous'}</p>
                                                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={cn(i < r.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200')} />)}</div>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{r.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No reviews yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ============================================================ */}
                    {/* MOBILE LAYOUT: Bottom sheet (hidden on desktop md+) */}
                    {/* ============================================================ */}
                    <motion.div
                        drag={isExpanded ? false : "y"}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.7}
                        onDragEnd={handleDragEnd}
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: "100vh",
                            top: "10%",
                            bottom: "10%",
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
                            "md:hidden fixed z-[230] bg-white shadow-2xl overflow-hidden flex flex-col",
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
                                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-100 pointer-events-auto"
                            >
                                <ArrowLeft size={24} className="text-[#0c831f]" strokeWidth={3} />
                            </motion.button>
                            <div className="flex gap-3 pointer-events-auto invisible">
                                {/* Hidden as per request to simplify the view */}
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
                                                    i === activeImageIndex ? "w-6 bg-[#0c831f]" : "w-1.5 bg-gray-300"
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
                                {cleanDesc && (
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                                        {cleanDesc}
                                    </p>
                                )}

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
                            <div className="flex flex-col gap-3">
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
                                                className="w-10 h-10 bg-[#0c831f] rounded-lg flex items-center justify-center text-white hover:bg-[#0b721b] transition-colors shadow-md shadow-green-100"
                                            >
                                                <Plus size={18} strokeWidth={3} />
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-[#0c831f] text-white h-[52px] rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:bg-[#0b721b] transition-all"
                                        >
                                            ADD TO CART
                                        </motion.button>
                                    )}
                                </div>

                                {/* View Cart Button */}
                                {cartCount > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-2"
                                    >
                                        <Link
                                            to="/checkout"
                                            onClick={closeProduct}
                                            className="w-full bg-[#0c831f] text-white h-[56px] rounded-xl flex items-center justify-between px-5 shadow-lg shadow-green-100/50 hover:bg-[#0b721b] transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[13px] font-[1000] uppercase tracking-wide">View cart</span>
                                                <span className="text-[11px] font-bold opacity-90 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in cart</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-[1000] tracking-tight">₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                                                <ChevronRight size={18} strokeWidth={4} />
                                            </div>
                                        </Link>
                                    </motion.div>
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
