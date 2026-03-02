import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Mic, ArrowLeft, X, TrendingUp, ChevronRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { customerApi } from '../services/customerApi';
import ProductCard from '../components/shared/ProductCard';

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get initial query from URL state or params
    const initialQuery = location.state?.query || new URLSearchParams(location.search).get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Manage Recent Searches with LocalStorage
    const [pastSearches, setPastSearches] = useState(() => {
        const saved = localStorage.getItem('appzeto_recent_searches');
        return saved ? JSON.parse(saved) : [];
    });

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await customerApi.getProducts({ limit: 100 });
                if (response.data.success) {
                    const dbProds = response.data.results || response.data.result || [];
                    const formattedProds = dbProds.map(p => ({
                        ...p,
                        id: p._id,
                        image: p.mainImage || p.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2',
                        price: p.salePrice || p.price,
                        originalPrice: p.price,
                        weight: p.weight || '1 unit',
                        deliveryTime: '8-15 mins'
                    }));
                    setAllProducts(formattedProds);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Save search term to history
    const saveSearch = (term) => {
        if (!term.trim()) return;
        const updated = [term, ...pastSearches.filter(s => s !== term)].slice(0, 10);
        setPastSearches(updated);
        localStorage.setItem('appzeto_recent_searches', JSON.stringify(updated));
    };

    // Remove specific search term
    const handleRemoveSearch = (e, term) => {
        e.stopPropagation();
        const updated = pastSearches.filter(s => s !== term);
        setPastSearches(updated);
        localStorage.setItem('appzeto_recent_searches', JSON.stringify(updated));
    };

    // Trigger save on Enter or clicking a result
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            saveSearch(query);
        }
    };

    // Real-time filtering logic
    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];
        return allProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.categoryId?.name?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allProducts]);

    useEffect(() => {
        setResults(filteredResults);
    }, [filteredResults]);

    // Lowest Price Section
    const lowestPriceProducts = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);
    }, [allProducts]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-white font-outfit">
            {/* Header / Search Input */}
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-[#0c831f] tracking-tight">Appzeto</h1>
                    <button className="p-2 hover:bg-slate-50 rounded-full text-[#0c831f]">
                        <Mic size={24} />
                    </button>
                </div>

                <div className="px-4 pb-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-800" />
                    </button>

                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search size={20} className="text-slate-400" />
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder='Search "eggs"'
                            value={query}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full h-12 bg-slate-50 rounded-2xl pl-11 pr-10 border border-slate-100 outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium focus:ring-2 focus:ring-[#0c831f]/10"
                        />
                        {query && (
                            <button
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 rounded-full"
                            >
                                <X size={14} className="text-slate-600" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-10 pb-24">
                {/* Search Results List */}
                {query ? (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                Search Results
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.length} found</span>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-7">
                                {results.map((product) => (
                                    <div key={product.id} onClick={() => saveSearch(query)}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center text-center">
                                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
                                <p className="text-slate-400 text-sm">Try different keywords or check spelling.</p>
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* 1. Recently Searched Item Section */}
                        {pastSearches.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recently Searched</h3>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {pastSearches.map((term) => (
                                        <div
                                            key={term}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 shadow-sm rounded-full whitespace-nowrap active:scale-95 transition-transform cursor-pointer"
                                            onClick={() => setQuery(term)}
                                        >
                                            <div className="h-5 w-5 bg-[#0c831f]/10 rounded flex items-center justify-center">
                                                <History size={12} className="text-[#0c831f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{term}</span>
                                            <button
                                                onClick={(e) => handleRemoveSearch(e, term)}
                                                className="ml-1 p-0.5 hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X size={12} className="text-slate-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. Lowest Price Ever Section */}
                        <section>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Lowest Price Ever!</h2>
                                <button className="flex items-center gap-1 text-[#0c831f] text-sm font-bold">
                                    See All <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-4 snap-x">
                                {isLoading && allProducts.length === 0 ? (
                                    [...Array(4)].map((_, i) => (
                                        <div key={i} className="min-w-[170px] h-64 bg-slate-50 rounded-2xl animate-pulse" />
                                    ))
                                ) : lowestPriceProducts.map((product) => (
                                    <div key={product.id} className="min-w-[180px] snap-start">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
