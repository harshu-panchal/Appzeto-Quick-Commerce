import React from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import CategoryStories from '../components/home/CategoryStories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ProductRow from '../components/home/ProductRow';
import FlashDeals from '../components/home/FlashDeals';

// Mock data for new sections
const morningEssentials = [
    { id: 101, name: 'Premium Full Cream Milk', category: 'Dairy', price: 68, originalPrice: 72, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=260&auto=format&fit=crop' },
    { id: 102, name: 'Fresh Brown Eggs (12 pcs)', category: 'Dairy', price: 95, originalPrice: 120, image: 'https://images.unsplash.com/photo-1582722872445-44ad5c7c3488?q=80&w=260&auto=format&fit=crop' },
    { id: 103, name: 'Salted Butter (100g)', category: 'Dairy', price: 58, originalPrice: 65, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb1a5ec0d?q=80&w=260&auto=format&fit=crop' },
    { id: 104, name: 'Multigrain Bread', category: 'Bakery', price: 45, originalPrice: 55, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=260&auto=format&fit=crop' },
    { id: 105, name: 'Greek Yogurt (Blueberry)', category: 'Dairy', price: 40, originalPrice: 50, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=260&auto=format&fit=crop' },
    { id: 106, name: 'Fresh Paneer (200g)', category: 'Dairy', price: 85, originalPrice: 95, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=260&auto=format&fit=crop' },
];

const veggieHighlights = [
    { id: 201, name: 'Red Onion (1kg)', category: 'Vegetables', price: 35, originalPrice: 50, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=260&auto=format&fit=crop' },
    { id: 202, name: 'Fresh Spinach (Bunch)', category: 'Vegetables', price: 25, originalPrice: 35, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=260&auto=format&fit=crop' },
    { id: 203, name: 'Baby Potato (1kg)', category: 'Vegetables', price: 40, originalPrice: 55, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=260&auto=format&fit=crop' },
    { id: 204, name: 'Cucumber (500g)', category: 'Vegetables', price: 20, originalPrice: 30, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d02e?q=80&w=260&auto=format&fit=crop' },
    { id: 205, name: 'Fresh Carrot (500g)', category: 'Vegetables', price: 30, originalPrice: 45, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=260&auto=format&fit=crop' },
    { id: 206, name: 'Cauliflower', category: 'Vegetables', price: 45, originalPrice: 60, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?q=80&w=260&auto=format&fit=crop' },
];

const flashDeals = [
    { id: 301, name: 'Nutella Hazelnut Spread', category: 'Snacks', price: 299, originalPrice: 450, image: 'https://images.unsplash.com/photo-1543528176-61b239510d11?q=80&w=260&auto=format&fit=crop' },
    { id: 302, name: 'Extra Virgin Olive Oil', category: 'Household', price: 850, originalPrice: 1200, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=260&auto=format&fit=crop' },
    { id: 303, name: 'Mixed Fruit Juice (1L)', category: 'Drinks', price: 99, originalPrice: 160, image: 'https://images.unsplash.com/photo-1613478223719-2ab302624894?q=80&w=260&auto=format&fit=crop' },
    { id: 304, name: 'Assorted Chocolates', category: 'Snacks', price: 499, originalPrice: 750, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=260&auto=format&fit=crop' },
    { id: 305, name: 'Premium Coffee Beans', category: 'Drinks', price: 549, originalPrice: 899, image: 'https://images.unsplash.com/photo-1447933630911-821f7593c200?q=80&w=260&auto=format&fit=crop' },
    { id: 306, name: 'Natural Honey (500g)', category: 'Household', price: 199, originalPrice: 350, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=260&auto=format&fit=crop' },
];

const Home = () => {
    return (
        <CustomerLayout>
            <div className="animate-in fade-in duration-500 overflow-x-hidden">
                <CategoryStories />
                <Hero />
                <Categories />

                {/* Horizontal Shelf - Morning Essentials */}
                <ProductRow
                    title="Morning Essentials"
                    subtitle="Everything you need to start your day fresh"
                    badge="FAST DELIVERY"
                    products={morningEssentials}
                />

                <FeaturedProducts />

                {/* Eye-catching Flash Deals Section */}
                <FlashDeals products={flashDeals} />

                {/* Horizontal Shelf - Fresh Veggies */}
                <ProductRow
                    title="Healthy Veggies"
                    subtitle="Farm fresh vegetables picked daily"
                    badge="DIRECT FROM FARM"
                    products={veggieHighlights}
                />

                {/* Legacy Promo Banner Section */}
                <section className="py-12 w-full max-w-[1920px] mx-auto px-4 md:px-[50px]">
                    <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-16 shadow-2xl sm:px-12 md:px-24 group">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <span className="text-orange-400 font-black text-xs uppercase tracking-widest mb-4">Limited Offer</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                                Get <span className="text-[#0c831f]">20% OFF</span> on your first order!
                            </h2>
                            <p className="max-w-2xl text-lg md:text-xl text-brand-100 font-medium mb-10 opacity-90">
                                Freshness delivered in 10 minutes. Join our community today and save big on your first grocery haul.
                            </p>
                            <div className="flex gap-4">
                                <button className="rounded-2xl bg-white px-10 py-4 text-lg font-black text-brand-900 shadow-xl hover:bg-brand-50 transition-all hover:-translate-y-1 active:scale-95">
                                    Use Code: WELCOME20
                                </button>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-brand-800/30 blur-3xl" />
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-[#0c831f]/20 blur-3xl transition-transform duration-1000 group-hover:scale-125" />
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
};

export default Home;
