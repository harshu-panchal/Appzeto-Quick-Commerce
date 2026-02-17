import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import MainLocationHeader from '../components/shared/MainLocationHeader';

const categoryGroups = [
    {
        title: "Grocery & Kitchen",
        categories: [
            { id: 1, name: "Vegetables & Fruits", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-1_9.png", color: "bg-[#E9F3E4]" },
            { id: 2, name: "Atta, Rice & Dal", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png", color: "bg-[#F3F1E4]" },
            { id: 3, name: "Oil, Ghee & Masala", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-3_9.png", color: "bg-[#F3E9E4]" },
            { id: 4, name: "Dairy, Bread & Eggs", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png", color: "bg-[#E4F1F3]" },
            { id: 5, name: "Bakery & Biscuits", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png", color: "bg-[#F3E4F1]" },
            { id: 6, name: "Dry Fruits & Cereals", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png", color: "bg-[#F3E9E4]" },
            { id: 7, name: "Chicken, Meat & Fish", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7_3.png", color: "bg-[#F1E4E4]" },
            { id: 8, name: "Kitchenware & Appliances", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png", color: "bg-[#E4F3F1]" },
        ]
    },
    {
        title: "Snacks & Drinks",
        categories: [
            { id: 9, name: "Chips & Namkeen", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-9_3.png", color: "bg-[#F3E4EB]" },
            { id: 10, name: "Sweets & Chocolates", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10.png", color: "bg-[#E4E9F3]" },
            { id: 11, name: "Drinks & Juices", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png", color: "bg-[#E4F3E9]" },
            { id: 12, name: "Tea, Coffee & Milk Drinks", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png", color: "bg-[#E9E4F3]" },
            { id: 13, name: "Instant Food", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-13.png", color: "bg-[#F3F1E4]" },
            { id: 14, name: "Sauces & Spreads", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-14.png", color: "bg-[#F1E4E4]" },
            { id: 15, name: "Baby Care", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-15.png", color: "bg-[#E4F1F3]" },
            { id: 16, name: "Pet Care", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-16.png", color: "bg-[#F3E9E4]" },
        ]
    }
];

const CategoriesPage = () => {
    return (
        <CustomerLayout showHeader={false}>
            <div className="min-h-screen bg-white">
                <MainLocationHeader />
                <div className="max-w-[1280px] mx-auto px-4 pt-4 md:pt-6 pb-20">
                    {categoryGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="mb-10">
                            {/* Group Title */}
                            <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] mb-6 px-1">
                                {group.title}
                            </h2>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-3 gap-y-8">
                                {group.categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/category/${category.id}`}
                                        className="flex flex-col group cursor-pointer"
                                    >
                                        <div className={`aspect-square ${category.color} rounded-[24px] md:rounded-[32px] p-2.5 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md`}>
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <span className="text-[10px] md:text-[12px] font-bold text-[#333] leading-tight text-center px-1 group-hover:text-[#0c831f] transition-colors">
                                            {category.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CategoriesPage;
