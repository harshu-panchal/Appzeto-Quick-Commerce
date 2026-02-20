import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
    MapPin,
    Clock,
    Wallet,
    CreditCard,
    Banknote,
    ChevronRight,
    ChevronLeft,
    Share2,
    Gift,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    Heart,
    Truck,
    Tag,
    Sparkles,
    Plus,
    Minus,
    Search,
    X,
    Clipboard,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@shared/components/ui/Toast';
import SlideToPay from '../components/shared/SlideToPay';
import ProductCard from '../components/shared/ProductCard';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckoutPage = () => {
    const { cart, addToCart, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
    const { wishlist, addToWishlist } = useWishlist();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // State management
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('now');
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [selectedTip, setSelectedTip] = useState(0);
    const [showAllCartItems, setShowAllCartItems] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({
        type: 'Home',
        name: 'Harshvardhan Panchal',
        address: '81 Pipliyahana Road, Near 214',
        city: 'Indore - 452018'
    });
    const [isLocationConfirmed, setIsLocationConfirmed] = useState(true);

    // Mock saved addresses
    const savedAddresses = [
        {
            id: 1,
            type: 'Home',
            name: 'Harshvardhan Panchal',
            address: '81 Pipliyahana Road, Near 214',
            city: 'Indore - 452018'
        },
        {
            id: 2,
            type: 'Work',
            name: 'John Doe',
            address: 'Office No. 5, Technohub, Cyber City',
            city: 'Gurugram - 122002'
        }
    ];

    // Mock data for recommendations
    const recommendedProducts = [
        { id: 101, name: 'Uncle Chips', price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200' },
        { id: 102, name: "Lay's Chips", price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200' },
        { id: 103, name: 'Bread', price: 35, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
    ];

    const coupons = [
        { code: 'FIRST50', description: 'Get ₹50 off on first order', discount: 50 },
        { code: 'SAVE100', description: 'Save ₹100 on orders above ₹999', discount: 100 },
    ];

    const deliveryAddress = {
        type: 'Home',
        name: 'John Doe',
        address: 'Flat 402, Sunshine Apartments, Sector 12, Dwarka',
        city: 'New Delhi - 110075'
    };

    const timeSlots = [
        { id: 'now', label: 'Now', sublabel: '10-15 min' },
        { id: '30min', label: '30 min', sublabel: 'Standard' },
        { id: '1hour', label: '1 hour', sublabel: 'Scheduled' },
        { id: '2hours', label: '2 hours', sublabel: 'Scheduled' }
    ];

    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', icon: Banknote, sublabel: 'Pay after delivery' },
        { id: 'online', label: 'Online Payment', icon: CreditCard, sublabel: 'UPI, Cards, Wallets' },
        { id: 'wallet', label: 'Wallet', icon: Wallet, sublabel: 'Balance: ₹450' }
    ];

    const tipAmounts = [
        { value: 0, label: 'No Tip' },
        { value: 10, label: '₹10' },
        { value: 20, label: '₹20' },
        { value: 30, label: '₹30' }
    ];

    const deliveryFee = 0;
    const platformFee = 3;
    const gst = Math.round(cartTotal * 0.05);
    const discountAmount = selectedCoupon ? selectedCoupon.discount : 0;
    const totalAmount = (cartTotal - discountAmount) + deliveryFee + platformFee + gst + selectedTip;

    const displayCartItems = showAllCartItems ? cart : cart;

    const handleMoveToWishlist = (item) => {
        addToWishlist(item);
        removeFromCart(item.id);
        showToast(`${item.name} moved to wishlist`, 'success');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Appzeto Checkout',
                    text: `Hey! I'm ordering some goodies from Appzeto. Total: ₹${totalAmount}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const handleApplyCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        setIsCouponModalOpen(false);
        showToast(`Coupon ${coupon.code} applied!`, 'success');
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast(`${product.name} added to cart!`, 'success');
    };

    const getCartItem = (productId) => cart.find(item => item.id === productId);

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create order object
        const order = {
            orderId: `ORD${Date.now()}`,
            items: cart,
            address: deliveryAddress,
            timeSlot: selectedTimeSlot,
            payment: selectedPayment,
            tip: selectedTip,
            subtotal: cartTotal,
            deliveryFee,
            platformFee,
            gst,
            total: totalAmount,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        // Store order in localStorage (simulating backend)
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Clear cart
        cart.forEach(item => removeFromCart(item.id));

        // Show success message
        showToast(`Order placed successfully! Order ID: ${order.orderId}`, 'success');

        // Redirect to Order Tracking page immediately
        navigate(`/orders/${order.orderId}`);
    };

    if (cart.length === 0) {
        return (
            <CustomerLayout showHeader={false} showBottomNav={true}>
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                    {/* Artistic Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-50/50 via-transparent to-transparent pointer-events-none" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -right-20 w-80 h-80 bg-green-100/30 rounded-full blur-3xl pointer-events-none"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, -45, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-40 -left-20 w-60 h-60 bg-yellow-100/40 rounded-full blur-3xl pointer-events-none"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto"
                    >
                        {/* Empty Cart Illustration Composition */}
                        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 bg-white rounded-full p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                            >
                                <ShoppingBag size={64} className="text-[#0c831f]" strokeWidth={1.5} />

                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-white transform rotate-12"
                                >
                                    Empty!
                                </motion.div>
                            </motion.div>

                            {/* Decorative Particles */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full"
                            />
                        </div>

                        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Your Cart is Empty</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">It feels lighter than air! <br />Explore our aisles and fill it with goodies.</p>

                        <Link
                            to="/"
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0c831f] to-[#10b981] text-white font-bold rounded-2xl overflow-hidden shadow-xl shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2 text-lg">
                                Start Shopping <ChevronRight size={20} />
                            </span>
                        </Link>

                        <div className="mt-8 flex gap-6 text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <Clock size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <Tag size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Daily Deals</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Fresh Items</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout showHeader={false} showBottomNav={false}>
            <div className="min-h-screen bg-[#f5f1e8] pb-32 font-sans">
                {/* Dark Green Header with Navigation - Curved Bottom */}
                <div className="bg-gradient-to-br from-[#0a5f17] to-[#084a12] pt-4 pb-8 relative z-10 shadow-lg rounded-b-[2rem] overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />

                    {/* Header Content */}
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-white" />
                            </button>

                            <div className="flex flex-col items-center">
                                <h1 className="text-lg font-black text-white tracking-wide uppercase">Checkout</h1>
                                <p className="text-green-100/80 text-xs font-medium tracking-wide mt-0.5">{cartCount} items in cart</p>
                            </div>

                            <button
                                onClick={handleShare}
                                className="h-10 px-3 flex items-center gap-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <Share2 size={18} className="text-white" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:block">Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-4">


                    {/* Delivery Time Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                <Clock size={24} className="text-[#0c831f]" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg">Delivery in 12-15 mins</h3>
                                <p className="text-sm text-slate-500">Shipment of {cartCount} items</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Delivery Address Section - New UI */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-slate-500 font-medium">Ordering for someone else?</span>
                            <button className="text-[#0c831f] text-xs font-bold hover:underline">Add details</button>
                        </div>
                        <div className="mb-3">
                            <h3 className="font-black text-slate-800 text-base">Delivery Address</h3>
                            <p className="text-xs text-slate-500">Select or edit your saved address</p>
                        </div>

                        {/* Address Card */}
                        <div
                            className={`border rounded-xl p-3 mb-3 relative cursor-pointer transition-all ${isLocationConfirmed
                                ? 'border-[#0c831f] bg-green-50/50'
                                : 'border-slate-200 hover:bg-slate-50'
                                }`}
                            onClick={() => setIsLocationConfirmed(!isLocationConfirmed)}
                        >
                            <div className="flex items-start gap-3">
                                {/* Radio/Check Button */}
                                <div className="mt-1">
                                    {isLocationConfirmed ? (
                                        <div className="h-5 w-5 rounded-full bg-[#0c831f] flex items-center justify-center">
                                            <Check size={12} className="text-white stroke-[4]" />
                                        </div>
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800 text-sm">{currentAddress.name}</h4>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsAddressModalOpen(true);
                                            }}
                                            className="text-[#0c831f] text-xs font-bold hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">6268423925</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {currentAddress.address}, {currentAddress.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Actions */}
                        <AnimatePresence mode="wait">
                            {isLocationConfirmed ? (
                                <motion.button
                                    key="update-btn"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full py-3 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center gap-2 text-[#0c831f] font-bold text-sm hover:bg-green-100 transition-colors"
                                >
                                    <MapPin size={18} />
                                    Update Precise Location on Map
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="precise-banner"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-center gap-2 overflow-hidden"
                                >
                                    <Check size={16} className="text-[#0c831f] stroke-[3]" />
                                    <span className="text-[#0c831f] font-bold text-sm">Precise Location Selected</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Cart Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4"
                    >
                        {displayCartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 mb-1">{item.name}</h4>
                                    <p className="text-xs text-slate-500 mb-2">75 g</p>
                                    <button
                                        onClick={() => handleMoveToWishlist(item)}
                                        className="text-xs text-slate-500 underline hover:text-[#0c831f] transition-colors"
                                    >
                                        Move to wishlist
                                    </button>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 bg-[#0c831f] rounded-lg px-2 py-1">
                                        <button
                                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                                            className="text-white p-1 hover:bg-white/20 rounded transition-colors"
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="text-white p-1 hover:bg-white/20 rounded transition-colors"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <p className="text-base font-black text-slate-800">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Your Wishlist */}
                    {wishlist.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                        >
                            <h3 className="font-black text-slate-800 text-lg mb-4">Your wishlist</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
                                {wishlist.map((item) => (
                                    <div key={item.id} className="flex-shrink-0 w-[140px] snap-start">
                                        <ProductCard product={item} compact={true} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* You might also like */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <h3 className="font-black text-slate-800 text-lg mb-4">You might also like</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
                            {recommendedProducts.map((product) => (
                                <div key={product.id} className="flex-shrink-0 w-[140px] snap-start">
                                    <ProductCard product={product} compact={true} />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Available Coupons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Tag size={20} className="text-orange-500" />
                                <h3 className="font-black text-slate-800">Available Coupons</h3>
                            </div>
                            <button
                                onClick={() => setIsCouponModalOpen(true)}
                                className="text-[#0c831f] text-sm font-bold hover:underline"
                            >
                                See All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {coupons.map((coupon) => (
                                <div key={coupon.code} className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                                    <div className="flex-1">
                                        <p className="font-black text-slate-800 text-sm">{coupon.code}</p>
                                        <p className="text-xs text-slate-600">{coupon.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApplyCoupon(coupon)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${selectedCoupon?.code === coupon.code
                                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                            : 'bg-[#0c831f] text-white hover:bg-[#0b721b]'
                                            }`}
                                        disabled={selectedCoupon?.code === coupon.code}
                                    >
                                        {selectedCoupon?.code === coupon.code ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>



                    {/* Tip for Partner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Heart size={18} className="text-pink-500 fill-pink-500" />
                            <h3 className="font-black text-slate-800">Tip your delivery partner</h3>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">100% of the tip goes to them</p>
                        <div className="grid grid-cols-4 gap-2">
                            {tipAmounts.map((tip) => (
                                <button
                                    key={tip.value}
                                    onClick={() => setSelectedTip(tip.value)}
                                    className={`py-2 rounded-xl border-2 transition-all font-bold text-sm ${selectedTip === tip.value
                                        ? 'border-pink-500 bg-pink-100 text-pink-700'
                                        : 'border-pink-200 bg-white text-slate-700 hover:border-pink-300'
                                        }`}
                                >
                                    {tip.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Payment Method */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <h3 className="font-black text-slate-800 mb-4">Payment Method</h3>
                        <div className="space-y-2">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPayment(method.id)}
                                        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedPayment === method.id
                                            ? 'border-[#0c831f] bg-green-50'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedPayment === method.id ? 'bg-green-100' : 'bg-slate-100'
                                            }`}>
                                            <Icon size={18} className={selectedPayment === method.id ? 'text-[#0c831f]' : 'text-slate-600'} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className={`font-bold text-sm ${selectedPayment === method.id ? 'text-[#0c831f]' : 'text-slate-800'}`}>
                                                {method.label}
                                            </p>
                                            <p className="text-xs text-slate-500">{method.sublabel}</p>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-[#0c831f]' : 'border-slate-300'
                                            }`}>
                                            {selectedPayment === method.id && (
                                                <div className="h-3 w-3 rounded-full bg-[#0c831f]" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Bill Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                    >
                        <h3 className="font-black text-slate-800 mb-4">Bill Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Item Total</span>
                                <span className="font-bold text-slate-800">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Delivery Fee</span>
                                <span className="font-bold text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Platform Fee</span>
                                <span className="font-bold text-slate-800">₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">GST (5%)</span>
                                <span className="font-bold text-slate-800">₹{gst}</span>
                            </div>
                            {selectedCoupon && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#0c831f] flex items-center gap-1">
                                        <Tag size={12} />
                                        Coupon ({selectedCoupon.code})
                                    </span>
                                    <span className="font-bold text-[#0c831f]">-₹{selectedCoupon.discount}</span>
                                </div>
                            )}
                            {selectedTip > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 flex items-center gap-1">
                                        <Heart size={12} className="text-pink-500 fill-pink-500" />
                                        Tip for Partner
                                    </span>
                                    <span className="font-bold text-slate-800">₹{selectedTip}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-slate-200 flex justify-between">
                                <span className="font-black text-slate-800">Total Amount</span>
                                <span className="font-black text-[#0c831f] text-lg">₹{totalAmount}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
                    <div className="max-w-4xl mx-auto">
                        <SlideToPay
                            amount={totalAmount}
                            onSuccess={handlePlaceOrder}
                            isLoading={isPlacingOrder}
                            text="Slide to Pay"
                        />
                    </div>
                </div>

                {/* Address Selection Modal */}
                <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Select Delivery Address</DialogTitle>
                            <DialogDescription>
                                Choose where you want your order delivered.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    onClick={() => {
                                        setCurrentAddress(addr);
                                        setIsAddressModalOpen(false);
                                    }}
                                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${currentAddress.id === addr.id
                                        ? 'border-[#0c831f] bg-green-50 shadow-sm'
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-full ${currentAddress.id === addr.id ? 'bg-[#0c831f] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{addr.type}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{addr.name}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-1">{addr.address}</p>
                                    <p className="text-xs text-slate-400">{addr.city}</p>
                                </button>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                onClick={() => navigate('/addresses')}
                            >
                                <Plus size={16} className="mr-2" /> Add New Address
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Coupon Selection Modal */}
                <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Apply Coupon</DialogTitle>
                            <DialogDescription>
                                Browse available offers and save more.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.code}
                                    className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${selectedCoupon?.code === coupon.code
                                        ? 'border-[#0c831f] bg-green-50 shadow-sm'
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                        }`}
                                >
                                    {selectedCoupon?.code === coupon.code && (
                                        <div className="absolute top-0 right-0 p-1.5 bg-[#0c831f] text-white rounded-bl-xl">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-2xl ${selectedCoupon?.code === coupon.code ? 'bg-[#0c831f]/10 text-[#0c831f]' : 'bg-orange-50 text-orange-500'}`}>
                                            <Tag size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 tracking-wider mb-1">{coupon.code}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed mb-3">{coupon.description}</p>
                                            <button
                                                onClick={() => handleApplyCoupon(coupon)}
                                                disabled={selectedCoupon?.code === coupon.code}
                                                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${selectedCoupon?.code === coupon.code
                                                    ? 'bg-white text-[#0c831f] border-2 border-[#0c831f] cursor-default'
                                                    : 'bg-[#0c831f] text-white hover:bg-[#0b721b]'
                                                    }`}
                                            >
                                                {selectedCoupon?.code === coupon.code ? 'Applied' : 'Apply Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Enter coupon code manually"
                                    className="pl-10 h-12 rounded-xl focus-visible:ring-[#0c831f]"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0c831f] font-bold text-xs">
                                    CHECK
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </CustomerLayout >
    );
};

export default CheckoutPage;
