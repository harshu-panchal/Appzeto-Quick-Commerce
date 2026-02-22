import React, { useState } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Modal from '@shared/components/ui/Modal';
import { useToast } from '@shared/components/ui/Toast';
import {
    HiOutlinePlus,
    HiOutlinePhoto,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineArrowUpCircle,
    HiOutlineArrowDownCircle,
    HiOutlineDevicePhoneMobile,
    HiOutlineEye,
    HiOutlineLink,
    HiOutlineSparkles,
    HiOutlineMegaphone,
    HiOutlineXMark
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion, Reorder } from 'framer-motion';

const ContentManager = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('hero');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '', link: '', subtitle: '' });

    // Mock Data
    const [heroBanners, setHeroBanners] = useState([
        { id: 'b1', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', title: 'Fresh Groceries', link: '/category/grocery', status: 'active', order: 1 },
        { id: 'b2', image: 'https://images.unsplash.com/photo-1540340061722-6245b991840b?w=800', title: 'Electronics Sale', link: '/category/electronics', status: 'active', order: 2 },
    ]);

    const [deals, setDeals] = useState([
        { id: 'd1', title: 'Crazy 50% Off', subtitle: 'Weekend Special', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', status: 'active' }
    ]);

    const [popups, setPopups] = useState([
        { id: 'p1', title: 'Spin the Wheel!', type: 'gamified', image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800', status: 'active', trigger: 'on_load' }
    ]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                image: item.image,
                link: item.link || '',
                subtitle: item.subtitle || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ title: '', image: '', link: '', subtitle: '' });
        }
        setIsModalOpen(true);
    };

    const handlePublish = () => {
        if (!formData.title || !formData.image) {
            showToast('Please fill in required fields', 'warning');
            return;
        }

        if (activeTab === 'hero') {
            if (editingItem) {
                setHeroBanners(heroBanners.map(b => b.id === editingItem.id ? { ...b, ...formData } : b));
                showToast('Banner updated', 'success');
            } else {
                const newBanner = { ...formData, id: `b${Date.now()}`, status: 'active', order: heroBanners.length + 1 };
                setHeroBanners([...heroBanners, newBanner]);
                showToast('New banner added', 'success');
            }
        } else if (activeTab === 'deals') {
            if (editingItem) {
                setDeals(deals.map(d => d.id === editingItem.id ? { ...d, ...formData } : d));
                showToast('Deal updated', 'success');
            } else {
                const newDeal = { ...formData, id: `d${Date.now()}`, status: 'active' };
                setDeals([...deals, newDeal]);
                showToast('New flash deal launched', 'success');
            }
        } else if (activeTab === 'popups') {
            if (editingItem) {
                setPopups(popups.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
                showToast('Popup updated', 'success');
            } else {
                const newPopup = { ...formData, id: `p${Date.now()}`, status: 'active' };
                setPopups([...popups, newPopup]);
                showToast('New marketing popup scheduled', 'success');
            }
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id, type) => {
        if (window.confirm('Are you sure you want to remove this component?')) {
            if (type === 'hero') {
                setHeroBanners(heroBanners.filter(b => b.id !== id));
            } else if (type === 'deals') {
                setDeals(deals.filter(d => d.id !== id));
            } else {
                setPopups(popups.filter(p => p.id !== id));
            }
            showToast('Component removed', 'warning');
        }
    };

    return (
        <div className="ds-section-spacing animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="ds-h1 flex items-center gap-3">
                        Experience Studio
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </h1>
                    <p className="ds-description">Visual orchestrator for your customer-facing mobile application.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-2xl text-[10px] font-black border border-slate-200 hover:bg-slate-50 transition-all">
                        <HiOutlineEye className="h-4 w-4" />
                        PREVIEW APP
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                    >
                        <HiOutlinePlus className="h-5 w-5" />
                        ADD COMPONENT
                    </button>
                </div>
            </div>

            {/* Studio Navigation */}
            <div className="flex p-1.5 bg-slate-100 rounded-xl w-fit">
                {[
                    { id: 'hero', label: 'Hero Banners', icon: HiOutlinePhoto },
                    { id: 'deals', label: 'Flash Deals', icon: HiOutlineSparkles },
                    { id: 'popups', label: 'Marketing Popups', icon: HiOutlineMegaphone },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Canvas Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Visual Editor */}
                <div className="lg:col-span-8 space-y-6">
                    {activeTab === 'hero' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Active Banners Stack</h3>
                                <span className="text-[10px] font-bold text-slate-400">DRAG TO REORDER</span>
                            </div>

                            <div className="space-y-4">
                                {heroBanners.map((banner, index) => (
                                    <Card key={banner.id} className="p-4 border-none shadow-lg ring-1 ring-slate-100 bg-white rounded-xl group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-24 w-40 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                                                <img src={banner.image} alt="" className="h-full w-full object-cover" />
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black text-white">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-black text-slate-900 mb-1">{banner.title}</h4>
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold mb-3">
                                                    <HiOutlineLink className="h-3 w-3" />
                                                    {banner.link}
                                                </div>
                                                <Badge variant="success" className="text-[8px] font-black uppercase">ACTIVE</Badge>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(banner)}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                >
                                                    <HiOutlinePencilSquare className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner.id, 'hero')}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <HiOutlineTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'deals' && (
                        <div className="grid grid-cols-2 gap-6">
                            {deals.map(deal => (
                                <Card key={deal.id} className="aspect-[4/5] p-6 border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-2xl relative overflow-hidden group">
                                    <img src={deal.image} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="relative h-full flex flex-col justify-end">
                                        <Badge variant="danger" className="w-fit mb-4">FLASH DEAL</Badge>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{deal.title}</h3>
                                        <p className="text-xs font-bold text-slate-500 mb-6">{deal.subtitle}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(deal)}
                                                className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                onClick={() => handleDelete(deal.id, 'deals')}
                                                className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-rose-500 transition-colors"
                                            >
                                                <HiOutlineTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'popups' && (
                        <div className="grid grid-cols-1 gap-6">
                            {popups.map(popup => (
                                <Card key={popup.id} className="p-6 border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-2xl group overflow-hidden relative">
                                    <div className="flex flex-col lg:flex-row items-center gap-4 relative z-10">
                                        <div className="h-40 w-40 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                            <img src={popup.image} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="primary" className="text-[8px] font-black">{popup.type.toUpperCase()}</Badge>
                                                <Badge variant="secondary" className="text-[8px] font-black">TRIGGER: {popup.trigger.toUpperCase()}</Badge>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">{popup.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Targeting: All App Users</p>
                                        </div>
                                        <div className="flex lg:flex-col gap-3">
                                            <button
                                                onClick={() => handleOpenModal(popup)}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                                            >
                                                CONFIGURE
                                            </button>
                                            <button
                                                onClick={() => handleDelete(popup.id, 'popups')}
                                                className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-rose-500 transition-colors"
                                            >
                                                <HiOutlineTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <HiOutlineMegaphone className="absolute -bottom-6 -right-6 h-32 w-32 text-slate-50 opacity-10" />
                                </Card>
                            ))}
                            {popups.length === 0 && (
                                <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                    <HiOutlineMegaphone className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active popups</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Device Mockup */}
                <div className="lg:col-span-4 sticky top-4">
                    <div className="relative mx-auto border-[8px] border-slate-900 rounded-[3rem] h-[650px] w-[320px] shadow-2xl overflow-hidden bg-white ring-8 ring-slate-100">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />

                        {/* Mock App Content */}
                        <div className="h-full overflow-y-auto pt-8 pb-20 no-scrollbar">
                            <div className="p-4 flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200" />
                                <div className="h-4 w-24 bg-slate-50 rounded-full" />
                                <div className="h-10 w-10 flex items-center justify-center text-slate-300">
                                    <HiOutlineSparkles className="h-6 w-6" />
                                </div>
                            </div>

                            {/* Live Hero Banner Preview */}
                            <div className="px-4 mb-6">
                                <div className="h-40 rounded-xl overflow-hidden shadow-lg relative">
                                    <img src={heroBanners[0]?.image} alt="" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="text-white font-black text-sm">{heroBanners[0]?.title}</h4>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-1.5 mt-3">
                                    {heroBanners.map((_, i) => (
                                        <div key={i} className={cn("h-1 w-4 rounded-full", i === 0 ? "bg-primary" : "bg-slate-200")} />
                                    ))}
                                </div>
                            </div>

                            {/* Categories Mock */}
                            <div className="px-4 grid grid-cols-4 gap-3 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="aspect-square rounded-2xl bg-slate-50 border border-slate-100" />
                                        <div className="h-2 w-full bg-slate-50 rounded-full" />
                                    </div>
                                ))}
                            </div>

                            {/* Deal Mock */}
                            <div className="px-4">
                                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-[10px] font-black text-rose-600 uppercase">Flash Sales</h5>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="h-4 w-4 bg-rose-200 rounded" />)}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-20 w-20 bg-white rounded-2xl shadow-sm ring-1 ring-rose-100" />
                                        <div className="flex-1 pt-2 space-y-2">
                                            <div className="h-3 w-2/3 bg-rose-100 rounded-full" />
                                            <div className="h-2 w-1/3 bg-rose-100 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* App Bottom Nav */}
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-6 rounded-lg bg-slate-100" />)}
                        </div>
                    </div>
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">LIVE APP OVERVIEW</p>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update App Design"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Component Title</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                            placeholder="E.g. Summer Essentials"
                        />
                    </div>
                    {activeTab === 'deals' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtitle</label>
                            <input
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                                placeholder="E.g. Weekend Special"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset URL (High-Res Image)</label>
                        <input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                    {activeTab === 'hero' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Deep-Link</label>
                            <input
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                                placeholder="/category/..."
                            />
                        </div>
                    )}
                    {activeTab === 'popups' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popup Type</label>
                                <select
                                    value={formData.type || 'info'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-black outline-none"
                                >
                                    <option value="info">Informational</option>
                                    <option value="promo">Promotion</option>
                                    <option value="gamified">Gamified</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Event</label>
                                <select
                                    value={formData.trigger || 'on_load'}
                                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-black outline-none"
                                >
                                    <option value="on_load">On App Load</option>
                                    <option value="exit_intent">Exit Intent</option>
                                    <option value="checkout">Before Checkout</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handlePublish}
                        className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {editingItem ? 'SAVE CHANGES' : 'PUBLISH COMPONENT'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ContentManager;
