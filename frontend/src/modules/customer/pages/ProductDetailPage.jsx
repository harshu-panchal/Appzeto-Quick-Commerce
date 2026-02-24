import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star, ShieldCheck, Clock, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '@shared/components/ui/Toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock product data (In a real app, this would come from an API or central store)
const allProducts = [
    {
        id: 1,
        name: 'Fresh Organic Strawberry',
        category: 'Fruits',
        price: 349,
        originalPrice: 499,
        description: "Experience the burst of sweetness with our hand-picked organic strawberries. These berries are grown without synthetic pesticides, ensuring they are as natural as nature intended. Perfect for snacking, desserts, or adding a healthy touch to your breakfast.",
        images: [
            'https://images.unsplash.com/photo-1464960726335-6c7178ed40ad?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1543528176-61b239510d11?q=80&w=600&auto=format&fit=crop'
        ],
        details: [
            { label: 'Shelf Life', value: '3-4 Days' },
            { label: 'Storage', value: 'Refrigerate' },
            { label: 'Weight', value: '500g' }
        ]
    },
    {
        id: 2,
        name: 'Green Bell Pepper',
        category: 'Vegetables',
        price: 45,
        originalPrice: 60,
        description: "Crispy and fresh green bell peppers, perfect for stir-fries, salads, and stuffing. These peppers are rich in Vitamin C and add a vibrant crunch to any dish.",
        images: [
            'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526346695784-f18aa35730a8?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600&auto=format&fit=crop'
        ],
        details: [
            { label: 'Shelf Life', value: '7 Days' },
            { label: 'Storage', value: 'Cool & Dry Place' },
            { label: 'Weight', value: '250g' }
        ]
    }
];

const ProductDetailPage = () => {
    const { id } = useParams();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    // Find product or use a robust fallback for demo purposes
    const product = allProducts.find(p => p.id === parseInt(id)) || {
        id: parseInt(id),
        name: 'Fresh Premium Product',
        category: 'Essentials',
        price: 99,
        originalPrice: 149,
        description: "This premium quality product is sourced directly from certified organic farms. We ensure the highest standards of freshness and hygiene during packaging to deliver only the best to your doorstep.",
        images: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506484334306-0d536ee18ec3?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=600&auto=format&fit=crop'
        ],
        details: [
            { label: 'Shelf Life', value: '5-7 Days' },
            { label: 'Storage', value: 'Fresh Section' },
            { label: 'Weight', value: '1 Unit' }
        ]
    };

    const [activeImage, setActiveImage] = useState(product.images[0]);
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isWishlisted = isInWishlist(product.id);

    const handleToggleWishlist = () => {
        toggleWishlistGlobal(product);
        showToast(
            isWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
            isWishlisted ? 'info' : 'success'
        );
    };

    return (
        <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in duration-700 mt-48 md:mt-24">
            {/* Back Button */}
            <Link to={-1} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0c831f] font-bold mb-6 transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                {/* Image Gallery Section */}
                <div className="lg:w-[45%] xl:w-[40%] space-y-4">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                            onClick={handleToggleWishlist}
                            className={cn(
                                "absolute top-5 right-5 p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
                                isWishlisted ? "bg-red-50 text-red-500" : "bg-white text-slate-400"
                            )}
                        >
                            <Heart size={20} className={cn(isWishlisted && "fill-current")} />
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={cn(
                                    "relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2",
                                    activeImage === img ? "border-[#0c831f] shadow-lg scale-95" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                <img src={img} alt={`Angle ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="lg:w-[55%] xl:w-[60%] space-y-6 md:space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#0c831f]/10 text-[#0c831f] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#0c831f]/20">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-3 py-0.5 rounded-full text-xs">
                                <Star size={12} fill="currentColor" /> 4.8 (120+ Reviews)
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-3">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-5">
                            <span className="text-4xl font-black text-[#0c831f]">₹{product.price}</span>
                            <span className="text-lg text-slate-400 line-through font-bold">₹{product.originalPrice}</span>
                            <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg font-black uppercase">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </div>

                        <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium max-w-2xl">
                            {product.description}
                        </p>
                    </div>

                    {/* Order Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        {quantity > 0 ? (
                            <div className="flex items-center bg-[#0c831f] text-white rounded-2xl h-16 w-full sm:w-auto px-2 shadow-xl shadow-green-100">
                                <button
                                    onClick={() => updateQuantity(product.id, -1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <Minus size={24} strokeWidth={3} />
                                </button>
                                <span className="w-16 text-center font-black text-xl">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <Plus size={24} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => {
                                    addToCart(product);
                                    showToast(`${product.name} added to cart`, 'success');
                                }}
                                className="h-16 w-full sm:w-64 bg-[#0c831f] hover:bg-[#0b721b] text-white text-lg font-black rounded-2xl shadow-xl shadow-green-100 transition-all hover:-translate-y-1"
                            >
                                <Plus className="mr-2" size={24} strokeWidth={3} /> ADD TO CART
                            </Button>
                        )}

                        <div className="flex flex-col gap-1 text-center sm:text-left">
                            <span className="text-xs font-black text-[#0c831f] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                                <ShieldCheck size={14} /> Hygiene Guaranteed
                            </span>
                            <span className="text-sm font-bold text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                                <Clock size={14} /> Delivered in 10-15 mins
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {product.details.map((detail, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{detail.label}</p>
                                <p className="text-sm font-black text-slate-800">{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Organic & Fresh', desc: 'Directly sourced from trusted local organic farms.', icon: '🌱' },
                    { title: 'Superfast Delivery', desc: 'Your groceries at your doorstep in under 10 minutes.', icon: '⚡' },
                    { title: 'Quality Checked', desc: 'Every item goes through 3 layers of quality checks.', icon: '🏆' }
                ].map((benefit, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm text-center">
                        <span className="text-4xl mb-4 block">{benefit.icon}</span>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{benefit.title}</h3>
                        <p className="text-slate-500 font-medium">{benefit.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetailPage;
