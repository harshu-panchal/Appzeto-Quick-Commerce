import React from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import ProductCard from '../components/shared/ProductCard';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
    const { wishlist, clearWishlist } = useWishlist();

    return (
        <CustomerLayout>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-36 md:mt-24">
                <div className="mb-8 flex flex-row items-end justify-between gap-4">
                    <div className="text-left">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0c831f] mb-1">My Wishlist</h1>
                        <p className="text-gray-500 text-sm md:text-lg font-medium">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="text-xs md:text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-6">Save items you like to find them easily here later.</p>
                        <a href="/products" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#0c831f] text-white font-bold hover:bg-[#0b721b] transition-colors shadow-lg">
                            Start Shopping
                        </a>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default WishlistPage;
