import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '@shared/components/ui/Toast';

const ProductCard = ({ product }) => {
    const { toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const { showToast } = useToast();

    // Find item in cart to get quantity
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const isWishlisted = isInWishlist(product.id);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasWishlisted = isWishlisted;
        toggleWishlistGlobal(product);
        showToast(
            wasWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
            wasWishlisted ? 'info' : 'success'
        );
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        showToast(`${product.name} added to cart`, 'success');
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
            removeFromCart(product.id);
            showToast(`${product.name} removed from cart`, 'info');
        } else {
            updateQuantity(product.id, -1);
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-100 p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#0c831f]/30 h-full flex flex-col">
            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className={cn(
                    "absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-sm",
                    isWishlisted
                        ? "bg-red-50 text-red-500"
                        : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-red-50"
                )}
            >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </button>

            {/* Image Container */}
            <Link to={`/product/${product.id}`} className="block relative aspect-square mb-3 overflow-hidden rounded-xl bg-slate-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Flash Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent z-20 -translate-x-[150%] skew-x-12 transition-transform duration-700 group-hover:translate-x-[150%]" />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0c831f] bg-[#0c831f]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        10 MINS
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {product.category}
                    </span>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-slate-800 line-clamp-2 text-sm leading-tight group-hover:text-[#0c831f] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-slate-500 font-medium">1 kg</p>

                <div className="flex flex-row items-center justify-between mt-auto pt-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs line-through decoration-slate-400/60">
                            ₹{product.originalPrice}
                        </span>
                        <span className="text-slate-900 font-bold text-lg">
                            ₹{product.price}
                        </span>
                    </div>

                    {quantity > 0 ? (
                        <div className="flex items-center bg-[#0c831f] text-white rounded-lg h-8 px-1 shadow-sm">
                            <button
                                onClick={handleDecrement}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-8 text-center font-bold text-xs">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="h-8 px-4 rounded-lg font-bold shadow-sm transition-all duration-300 text-xs bg-white text-[#0c831f] border border-[#0c831f]/30 hover:bg-[#0c831f] hover:text-white hover:border-[#0c831f]"
                        >
                            ADD
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
