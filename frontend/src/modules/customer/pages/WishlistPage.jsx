import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { ChevronLeft, Heart, Trash2 } from 'lucide-react';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, clearWishlist } = useWishlist();

    return (
        <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 pt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">My Wishlist</h1>
                        <p className="text-slate-500 font-medium">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                    </div>
                </div>
                {wishlist.length > 0 && (
                    <button
                        onClick={clearWishlist}
                        className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                    >
                        <Trash2 size={18} /> Clear All
                    </button>
                )}
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={40} className="text-rose-500" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">No items in wishlist</h2>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start saving your favorite items to see them here later.</p>
                    <Link
                        to="/categories"
                        className="px-8 py-3 bg-[#0c831f] text-white font-bold rounded-2xl hover:bg-[#0b721b] transition-all shadow-xl shadow-green-100"
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
