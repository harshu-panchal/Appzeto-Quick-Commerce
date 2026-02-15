import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    HiOutlinePlus,
    HiOutlineCube,
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineEye,
    HiOutlinePhoto,
    HiOutlineCurrencyDollar,
    HiOutlineArchiveBox,
    HiOutlineTag,
    HiOutlineScale,
    HiOutlineArrowPath,
    HiOutlineXMark,
    HiOutlineChevronRight,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineFolderOpen,
    HiOutlineSwatch,
    HiOutlineSquaresPlus
} from 'react-icons/hi2';
import Modal from '@shared/components/ui/Modal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
    // Mock Data
    const [products, setProducts] = useState([
        {
            id: 'p1',
            name: 'Fresh Alphonso Mangoes',
            slug: 'fresh-alphonso-mangoes',
            sku: 'FRT-MAN-001',
            price: 799,
            salePrice: 599,
            stock: 45,
            category: 'Fruits & Vegetables',
            header: 'Grocery',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200',
            sales: 124,
            rating: 4.8
        },
        {
            id: 'p2',
            name: 'Amul Taaza Milk 1L',
            slug: 'amul-taaza-milk-1l',
            sku: 'DRY-MLK-002',
            price: 66,
            salePrice: 64,
            stock: 12,
            category: 'Milk',
            header: 'Grocery',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1563636619-e910ef4a8b9b?auto=format&fit=crop&q=80&w=200',
            sales: 890,
            rating: 4.9
        },
        {
            id: 'p3',
            name: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            sku: 'ELE-MOB-001',
            price: 129000,
            salePrice: 119000,
            stock: 5,
            category: 'Smartphone',
            header: 'Electronics',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200',
            sales: 45,
            rating: 4.7
        },
        {
            id: 'p4',
            name: 'Organic Whole Wheat Bread',
            slug: 'organic-whole-wheat-bread',
            sku: 'BRD-WHT-001',
            price: 45,
            salePrice: 40,
            stock: 0,
            category: 'Bread & Pav',
            header: 'Grocery',
            status: 'inactive',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
            sales: 320,
            rating: 4.5
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [modalTab, setModalTab] = useState('general');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        salePrice: '',
        stock: '',
        lowStockAlert: 5,
        category: '',
        header: '',
        status: 'active',
        tags: '',
        weight: '',
        brand: '',
        mainImage: null,
        galleryImages: [],
        variants: [
            { id: 1, name: 'Default', price: '', salePrice: '', stock: '', sku: '' }
        ]
    });

    const categories = useMemo(() => [
        { id: 'h1', name: 'Grocery', children: ['Fruits & Vegetables', 'Milk', 'Bread & Pav'] },
        { id: 'h2', name: 'Electronics', children: ['Smartphone', 'Laptops', 'Wearables'] }
    ], []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || p.category === filterCategory || p.header === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, filterCategory]);

    const stats = useMemo(() => ({
        total: products.length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        active: products.filter(p => p.status === 'active').length
    }), [products]);

    const handleSave = () => {
        console.log('Saving Product:', formData);
        setIsProductModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteClick = (product) => {
        setItemToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setProducts(products.filter(p => p.id !== itemToDelete.id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const openModal = (item = null) => {
        if (item) {
            setFormData({
                name: item.name || '',
                slug: item.slug || '',
                sku: item.sku || '',
                description: item.description || '',
                price: item.price || '',
                salePrice: item.salePrice || '',
                stock: item.stock || '',
                lowStockAlert: item.lowStockAlert || 5,
                category: item.category || '',
                header: item.header || '',
                status: item.status || 'active',
                tags: item.tags || '',
                weight: item.weight || '',
                brand: item.brand || '',
                mainImage: item.image || item.mainImage || null,
                galleryImages: item.galleryImages || [],
                variants: item.variants || [{
                    id: Date.now(),
                    name: 'Default',
                    price: item.price || '',
                    salePrice: item.salePrice || '',
                    stock: item.stock || '',
                    sku: item.sku || ''
                }]
            });
            setEditingItem(item);
        } else {
            setFormData({
                name: '', slug: '', sku: '', description: '',
                price: '', salePrice: '', stock: '', lowStockAlert: 5,
                category: '', header: '', status: 'active',
                tags: '', weight: '', brand: '',
                mainImage: null, galleryImages: [],
                variants: [{ id: Date.now(), name: 'Default', price: '', salePrice: '', stock: '', sku: '' }]
            });
            setEditingItem(null);
        }
        setModalTab('general');
        setIsProductModalOpen(true);
    };

    const StatusBadge = ({ status, stock }) => {
        if (stock === 0) return <Badge variant="error" className="text-[10px] px-1.5 py-0">Out of Stock</Badge>;
        if (stock <= 10) return <Badge variant="warning" className="text-[10px] px-1.5 py-0">Low Stock</Badge>;
        if (status === 'active') return <Badge variant="success" className="text-[10px] px-1.5 py-0">Active</Badge>;
        return <Badge variant="gray" className="text-[10px] px-1.5 py-0">Draft</Badge>;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-16">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="admin-h1 flex items-center gap-2">
                        Product List
                        <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase">Live</Badge>
                    </h1>
                    <p className="admin-description mt-0.5">Track your items, prices, and how many are left in stock.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
                >
                    <HiOutlinePlus className="h-4 w-4" />
                    <span>ADD NEW PRODUCT</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'All Items', val: stats.total, icon: HiOutlineCube, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Items', val: stats.active, icon: HiOutlineCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Low Stock', val: stats.lowStock, icon: HiOutlineExclamationCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Out of Stock', val: stats.outOfStock, icon: HiOutlineArchiveBox, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 p-4 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="admin-label">{stat.label}</p>
                                <h4 className="admin-stat-value">{stat.val}</h4>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Toolbox */}
            <Card className="border-none shadow-sm ring-1 ring-slate-100 p-3 bg-white/60 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-3 items-center">
                    <div className="relative flex-1 group w-full">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, SKU or slug..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/5 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2 shrink-0 w-full lg:w-auto">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="flex-1 lg:flex-none px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/5 outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(h => (
                                <optgroup key={h.id} label={h.name}>
                                    {h.children.map(c => <option key={c} value={c}>{c}</option>)}
                                </optgroup>
                            ))}
                        </select>
                        <button className="flex items-center space-x-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <HiOutlineFunnel className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>
            </Card>

            {/* Product Table */}
            <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="admin-table-header px-6">Product</th>
                                <th className="admin-table-header px-6">Header</th>
                                <th className="admin-table-header px-6">Category</th>
                                <th className="admin-table-header px-6">Reg. Price</th>
                                <th className="admin-table-header px-6">Sale Price</th>
                                <th className="admin-table-header px-6 text-center">Variant</th>
                                <th className="admin-table-header px-6 text-center">Stock</th>
                                <th className="admin-table-header px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                                                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                                <p className="text-[9px] font-semibold text-slate-400">SKU: {p.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded-full">{p.header || 'Grocery'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-600">{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-400">₹{p.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-emerald-600">₹{p.salePrice || p.price}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                                            {p.variants?.[0]?.name || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn("text-xs font-bold", p.stock === 0 ? "text-rose-500" : p.stock <= 10 ? "text-amber-500" : "text-emerald-500")}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">

                                        <div className="flex items-center justify-end space-x-1.5">
                                            <button
                                                onClick={() => openModal(p)}
                                                className="p-1.5 hover:bg-white hover:text-primary rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-gray-100"
                                            >
                                                <HiOutlinePencilSquare className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(p)}
                                                className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-gray-100"
                                            >
                                                <HiOutlineTrash className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Super Detailed Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setIsProductModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-5xl relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                        <HiOutlineCube className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="admin-h3">
                                            {editingItem ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <Badge variant="primary" className="text-[7px] font-bold uppercase tracking-widest px-1">SYSTEM</Badge>
                                            <HiOutlineChevronRight className="h-2.5 w-2.5 text-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.sku || 'PENDING SKU'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <HiOutlineXMark className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-col lg:flex-row flex-1 min-h-[400px] max-h-[calc(100vh-200px)] overflow-hidden">
                                {/* Modal Sidebar Tabs */}
                                <div className="lg:w-1/4 bg-slate-50/50 border-r border-slate-100 p-4 space-y-1 overflow-y-auto scrollbar-hide">
                                    {[
                                        { id: 'general', label: 'General Info', icon: HiOutlineTag },
                                        { id: 'pricing', label: 'Pricing & Stock', icon: HiOutlineCurrencyDollar },
                                        { id: 'variants', label: 'Item Variants', icon: HiOutlineSwatch },
                                        { id: 'category', label: 'Groups', icon: HiOutlineFolderOpen },
                                        { id: 'media', label: 'Photos', icon: HiOutlinePhoto },
                                        { id: 'attributes', label: 'SEO & Details', icon: HiOutlineScale }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setModalTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all",
                                                modalTab === tab.id
                                                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                                                    : "text-slate-500 hover:bg-slate-100"
                                            )}
                                        >
                                            <tab.icon className="h-4 w-4" />
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}

                                    <div className="pt-8 px-4">
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-transparent border-none text-xs font-bold text-emerald-700 outline-none p-0 cursor-pointer"
                                            >
                                                <option value="active">PUBLISHED</option>
                                                <option value="inactive">DRAFT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content Area */}
                                <div className="flex-1 p-8 overflow-y-auto">
                                    {modalTab === 'general' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                                                    <input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-semibold outline-none ring-primary/5 focus:ring-2"
                                                        placeholder="e.g. Premium Basmati Rice"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
                                                    <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5">
                                                        <span className="text-[10px] text-slate-400 font-bold mr-1">/product/</span>
                                                        <input
                                                            value={formData.slug}
                                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                            className="flex-1 bg-transparent border-none text-sm text-slate-500 font-semibold outline-none"
                                                            placeholder="premium-basmati-rice"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 flex flex-col">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">About this item</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-semibold min-h-[120px] outline-none"
                                                    placeholder="Describe the item here..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                                                    <input
                                                        value={formData.brand}
                                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-semibold outline-none ring-primary/5 focus:ring-2"
                                                        placeholder="e.g. Amul"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">SKU Identification</label>
                                                    <input
                                                        value={formData.sku}
                                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-mono font-bold outline-none ring-primary/5 focus:ring-2"
                                                        placeholder="AUTO-GENERATED"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {modalTab === 'pricing' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-2 gap-8">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Regular Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white shadow-sm ring-1 ring-slate-200 border-none rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-primary/10"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest ml-1 text-emerald-600">Sale Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.salePrice}
                                                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                                        className="w-full px-4 py-3 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-100 border-none rounded-xl text-lg font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-200"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Stock Count</label>
                                                    <input
                                                        type="number"
                                                        value={formData.stock}
                                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-bold outline-none ring-primary/5 focus:ring-2"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-rose-500">Low Stock Alert at</label>
                                                    <input
                                                        type="number"
                                                        value={formData.lowStockAlert}
                                                        onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-rose-50/30 border-none rounded-xl text-sm font-bold text-rose-600 outline-none ring-rose-100 focus:ring-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {modalTab === 'variants' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">Product Variants</h4>
                                                    <p className="text-[10px] text-slate-500 font-medium">Add different sizes, colors or weights for this item.</p>
                                                </div>
                                                <button
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        variants: [...formData.variants, { id: Date.now(), name: '', price: '', salePrice: '', stock: '', sku: '' }]
                                                    })}
                                                    className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-all"
                                                >
                                                    <HiOutlineSquaresPlus className="h-4 w-4" />
                                                    <span>ADD VARIANT</span>
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {(formData.variants || []).map((variant, index) => (
                                                    <div key={variant.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-12 gap-4 items-end group relative">
                                                        <div className="col-span-3 space-y-1">
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Variant Name</label>
                                                            <input
                                                                value={variant.name}
                                                                onChange={(e) => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[index].name = e.target.value;
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                                placeholder="e.g. 1kg Bag"
                                                                className="w-full px-3 py-2 bg-white ring-1 ring-slate-200 border-none rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/10"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price</label>
                                                            <input
                                                                type="number"
                                                                value={variant.price}
                                                                onChange={(e) => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[index].price = e.target.value;
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                                placeholder="500"
                                                                className="w-full px-3 py-2 bg-white ring-1 ring-slate-200 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest ml-1">Sale</label>
                                                            <input
                                                                type="number"
                                                                value={variant.salePrice}
                                                                onChange={(e) => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[index].salePrice = e.target.value;
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                                placeholder="450"
                                                                className="w-full px-3 py-2 bg-emerald-50 ring-1 ring-emerald-100 border-none rounded-xl text-xs font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-200"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                                                            <input
                                                                type="number"
                                                                value={variant.stock}
                                                                onChange={(e) => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[index].stock = e.target.value;
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                                placeholder="10"
                                                                className="w-full px-3 py-2 bg-white ring-1 ring-slate-200 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">SKU</label>
                                                            <input
                                                                value={variant.sku}
                                                                onChange={(e) => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[index].sku = e.target.value;
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                                placeholder="SKU-001"
                                                                className="w-full px-3 py-2 bg-white ring-1 ring-slate-200 border-none rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-primary/10"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <button
                                                                onClick={() => {
                                                                    if (formData.variants.length > 1) {
                                                                        const newVariants = formData.variants.filter((_, i) => i !== index);
                                                                        setFormData({ ...formData, variants: newVariants });
                                                                    }
                                                                }}
                                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                            >
                                                                <HiOutlineTrash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {modalTab === 'category' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Group</label>
                                                    <select
                                                        value={formData.header}
                                                        onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
                                                    >
                                                        <option value="">Select Main Group</option>
                                                        {categories.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specific Category</label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.find(h => h.name === formData.header)?.children?.map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {modalTab === 'media' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                                            {/* Main Image Section */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Cover Photo</label>
                                                <div className="flex items-start gap-6">
                                                    <div className="w-48 aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative">
                                                        {formData.mainImage ? (
                                                            <img src={formData.mainImage} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <HiOutlinePhoto className="h-10 w-10 text-slate-200 group-hover:text-primary transition-colors" />
                                                                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest group-hover:text-primary">Upload Cover</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2 pt-2">
                                                        <p className="text-xs font-bold text-slate-900">Choose a primary image</p>
                                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">This image will be shown on the search page and the main store listing. Make sure it is clear and bright.</p>
                                                        <button className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline">Pick from Library</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gallery Section */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gallery Photos (Max 5)</label>
                                                <div className="grid grid-cols-5 gap-3">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                                                            <HiOutlinePlus className="h-5 w-5 text-slate-200 group-hover:text-primary transition-colors" />
                                                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest group-hover:text-primary">Add</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-slate-400 font-medium italic text-center pt-4 border-t border-slate-50 outline-none">
                                                Quick Tip: Using WebP format at 800x800px makes your store load 3x faster.
                                            </p>
                                        </div>
                                    )}

                                    {modalTab === 'attributes' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Physical Weight (kg)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.weight}
                                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-bold outline-none ring-primary/5 focus:ring-2"
                                                        placeholder="0.5"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Tags</label>
                                                    <input
                                                        value={formData.tags}
                                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-semibold outline-none ring-primary/5 focus:ring-2"
                                                        placeholder="mango, fresh, fruits..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <HiOutlineArrowPath className="h-4 w-4 text-emerald-500 animate-spin-slow" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saving changes...</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-100">CLOSE</button>
                                    <button onClick={handleSave} className="bg-slate-900 text-white px-10 py-2.5 rounded-xl text-xs font-bold shadow-xl hover:-translate-y-0.5 transition-all">
                                        SAVE ITEM
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                        >
                            DELETE PRODUCT
                        </button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                        <HiOutlineExclamationCircle className="h-10 w-10 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Delete Product?</h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Are you sure you want to delete <span className="font-bold text-slate-900">"{itemToDelete?.name}"</span>?
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>

        </div>
    );
};

export default ProductManagement;
