import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';

const categories = [
    { id: 1, name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200&auto=format&fit=crop', color: 'bg-red-50' },
    { id: 2, name: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=200&auto=format&fit=crop', color: 'bg-green-50' },
    { id: 3, name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=200&auto=format&fit=crop', color: 'bg-blue-50' },
    { id: 4, name: 'Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200&auto=format&fit=crop', color: 'bg-orange-50' },
    { id: 5, name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', color: 'bg-yellow-50' },
    { id: 6, name: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200&auto=format&fit=crop', color: 'bg-purple-50' },
    { id: 7, name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-28b12e81658b?q=80&w=200&auto=format&fit=crop', color: 'bg-pink-50' },
    { id: 8, name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8d84f5ae1d41?q=80&w=200&auto=format&fit=crop', color: 'bg-teal-50' },
    { id: 9, name: 'Baby Care', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=200&auto=format&fit=crop', color: 'bg-indigo-50' },
    { id: 10, name: 'Pet Food', image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=200&auto=format&fit=crop', color: 'bg-amber-50' },
    { id: 11, name: 'Household', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=200&auto=format&fit=crop', color: 'bg-gray-50' },
    { id: 12, name: 'Breakfast', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=200&auto=format&fit=crop', color: 'bg-amber-50' },
    { id: 13, name: 'Frozen Food', image: 'https://images.unsplash.com/photo-1579870535560-44bd4c784954?q=80&w=200&auto=format&fit=crop', color: 'bg-cyan-50' },
    { id: 14, name: 'Biscuits', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=200&auto=format&fit=crop', color: 'bg-orange-50' },
    { id: 15, name: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=200&auto=format&fit=crop', color: 'bg-stone-50' },
];

const CategoriesPage = () => {
    return (
        <CustomerLayout>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-48 md:mt-24">
                <div className="mb-8 text-left">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0c831f] mb-1">All Categories</h1>
                    <p className="text-gray-500 text-sm md:text-lg font-medium">Explore our wide range of fresh products.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 justify-items-center">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.name.toLowerCase()}`}
                            className="flex flex-col items-center gap-4 group cursor-pointer w-full p-4 hover:bg-[#f0fdf4] rounded-2xl transition-all border border-transparent hover:border-green-100"
                        >
                            <div className={`h-36 w-36 md:h-44 md:w-44 rounded-full ${category.color} p-6 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl border border-white ring-4 ring-transparent group-hover:ring-[#0c831f]/20`}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-contain drop-shadow-md mix-blend-multiply"
                                />
                            </div>
                            <span className="text-lg font-bold text-green-900 group-hover:text-[#0c831f] transition-colors text-center">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CategoriesPage;
