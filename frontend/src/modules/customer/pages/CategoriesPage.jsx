import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import MainLocationHeader from '../components/shared/MainLocationHeader';
import { customerApi } from '../services/customerApi';

const COLORS = [
    "bg-[#E9F3E4]", "bg-[#F3F1E4]", "bg-[#F3E9E4]", "bg-[#E4F1F3]",
    "bg-[#F3E4F1]", "bg-[#F3E9E4]", "bg-[#F1E4E4]", "bg-[#E4F3F1]"
];

const CategoriesPage = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await customerApi.getCategories({ tree: true });
            if (res.data.success) {
                const tree = res.data.results || res.data.result || [];
                const formattedGroups = tree.map((header, idx) => ({
                    title: header.name,
                    categories: (header.children || []).map((cat, cIdx) => ({
                        id: cat._id,
                        name: cat.name,
                        image: cat.image || "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-1_9.png",
                        color: COLORS[(idx + cIdx) % COLORS.length]
                    }))
                }));
                setGroups(formattedGroups);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <CustomerLayout showHeader={false}>
            <div className="min-h-screen bg-white">
                <MainLocationHeader />
                <div className="max-w-[1280px] mx-auto px-4 pt-[140px] md:pt-[150px] pb-20">
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                            {/* Group Title */}
                            <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] mb-6 px-1">
                                {group.title}
                            </h2>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-3 gap-y-8">
                                {group.categories.map((category, idx) => (
                                    <div key={category.id} className="flex flex-col group cursor-pointer">
                                        <Link
                                            to={`/category/${category.id}`}
                                            className="contents"
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
                                    </div>
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
