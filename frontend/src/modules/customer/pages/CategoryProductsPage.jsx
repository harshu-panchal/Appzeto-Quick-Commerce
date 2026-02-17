import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Search, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '@shared/components/ui/Toast';
import { cn } from '@/lib/utils';

import ProductCard from '../components/shared/ProductCard';
import ProductDetailSheet from '../components/shared/ProductDetailSheet';
import { ProductDetailProvider } from '../context/ProductDetailContext';
import MiniCart from '../components/shared/MiniCart';

const subCategories = [
    { id: 'all', name: 'All', icon: 'https://cdn-icons-png.flaticon.com/128/2321/2321831.png' },
    { id: 'veg', name: 'Fresh Vegetables', icon: 'https://cdn-icons-png.flaticon.com/128/2321/2321801.png' },
    { id: 'new', name: 'New Launches', icon: 'https://cdn-icons-png.flaticon.com/128/1147/1147832.png' },
    { id: 'fruits', name: 'Fresh Fruits', icon: 'https://cdn-icons-png.flaticon.com/128/3194/3194761.png' },
    { id: 'exotics', name: 'Exotics & Premium', icon: 'https://cdn-icons-png.flaticon.com/128/2909/2909808.png' },
    { id: 'organic', name: 'Organics & More', icon: 'https://cdn-icons-png.flaticon.com/128/3014/3014498.png' },
];

const allProducts = [
    {
        id: 1,
        name: 'Apple Ber',
        weight: '250g',
        price: 31,
        originalPrice: 46,

        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '8 mins'
    },
    {
        id: 2,
        name: 'Coriander Leaves',
        weight: '100g',
        price: 7,
        originalPrice: 14,

        category: 'veg',
        image: 'https://images.unsplash.com/photo-1564149504817-d1378368926e?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '12 mins'
    },
    {
        id: 3,
        name: 'Tomato Local',
        weight: '500g',
        price: 16,
        originalPrice: 28,

        category: 'veg',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '10 mins'
    },
    {
        id: 4,
        name: 'Tender Coconut',
        weight: '1 pc',
        price: 58,
        originalPrice: 102,

        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '15 mins'
    },
    {
        id: 5,
        name: 'Green Chili',
        weight: '100g',
        price: 5,
        originalPrice: 10,

        category: 'veg',
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '7 mins'
    },
    {
        id: 6,
        name: 'Potato New',
        weight: '1kg',
        price: 24,
        originalPrice: 35,

        category: 'veg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=260&auto=format&fit=crop',
        deliveryTime: '9 mins'
    },
];

const CategoryProductsPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');

    const filteredProducts = allProducts.filter(p =>
        selectedSubCategory === 'all' || p.category === selectedSubCategory
    );

    return (
        <ProductDetailProvider>
            <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-50 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronLeft size={24} className="text-gray-900" />
                        </button>
                        <h1 className="text-[18px] font-bold text-gray-800 tracking-tight">
                            {categoryName === '1' ? 'Fruits & Vegetables' : categoryName}
                        </h1>
                    </div>

                </header>

                <div className="flex flex-1 relative items-start">
                    {/* Sidebar */}
                    <aside className="w-[80px] border-r border-gray-50 flex flex-col bg-white overflow-y-auto hide-scrollbar sticky top-[60px] h-[calc(100vh-60px)]">
                        {subCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedSubCategory(cat.id)}
                                className={cn(
                                    "flex flex-col items-center py-4 px-1 gap-2 transition-all relative border-l-4",
                                    selectedSubCategory === cat.id
                                        ? "bg-[#F7FCF5] border-[#0c831f]"
                                        : "border-transparent hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center p-2 transition-all duration-300",
                                    selectedSubCategory === cat.id ? "scale-110" : "grayscale opacity-70"
                                )}>
                                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                                </div>
                                <span className={cn(
                                    "text-[10px] text-center font-bold font-sans leading-tight px-1",
                                    selectedSubCategory === cat.id ? "text-[#0c831f]" : "text-gray-500"
                                )}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </aside>

                    {/* Content */}
                    <main className="flex-1 p-3 pb-24 bg-white">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {/* Visual Fill */}
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id + 10} product={{ ...product, id: product.id + 10 }} />
                            ))}
                        </div>
                    </main>
                </div>

                <MiniCart />
                <ProductDetailSheet />

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                    
                    body {
                        font-family: 'Outfit', sans-serif;
                        background-color: #f8f8f8;
                    }
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
            </div>
        </ProductDetailProvider>
    );
};

export default CategoryProductsPage;
