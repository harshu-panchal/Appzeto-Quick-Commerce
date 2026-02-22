import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Modal from '@shared/components/ui/Modal';
import { useToast } from '@shared/components/ui/Toast';
import {
    HiOutlinePlus,
    HiOutlineTicket,
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineCalendarDays,
    HiOutlineUsers,
    HiOutlineBanknotes,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXMark,
    HiOutlineEye
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CouponManagement = () => {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock Data for Coupons
    const [coupons, setCoupons] = useState([
        {
            id: 'c1',
            code: 'WELCOME50',
            discountType: 'percentage',
            discountValue: 50,
            minOrder: 200,
            maxDiscount: 100,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            totalLimit: 1000,
            usedCount: 450,
            status: 'active',
            description: 'Flat 50% off on first order'
        },
        {
            id: 'c2',
            code: 'FREESHIP',
            discountType: 'fixed',
            discountValue: 40,
            minOrder: 500,
            maxDiscount: 40,
            startDate: '2024-02-01',
            endDate: '2024-06-30',
            totalLimit: 500,
            usedCount: 500,
            status: 'expired',
            description: 'Free delivery on orders above ₹500'
        },
        {
            id: 'c3',
            code: 'WEEKEND20',
            discountType: 'percentage',
            discountValue: 20,
            minOrder: 300,
            maxDiscount: 150,
            startDate: '2024-02-15',
            endDate: '2024-02-18',
            totalLimit: 200,
            usedCount: 85,
            status: 'active',
            description: 'Special weekend discount'
        }
    ]);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrder: '',
        maxDiscount: '',
        startDate: '',
        endDate: '',
        totalLimit: '',
        description: ''
    });

    const stats = useMemo(() => ({
        total: coupons.length,
        active: coupons.filter(c => c.status === 'active').length,
        totalRedeemed: coupons.reduce((acc, c) => acc + c.usedCount, 0),
        expiringSoon: 2 // Mock
    }), [coupons]);

    const filteredCoupons = useMemo(() => {
        return coupons.filter(c => {
            const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [coupons, searchTerm, statusFilter]);

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({ ...coupon });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrder: '',
                maxDiscount: '',
                startDate: '',
                endDate: '',
                totalLimit: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...formData, id: c.id, usedCount: c.usedCount, status: 'active' } : c));
            showToast('Coupon updated successfully', 'success');
        } else {
            const newCoupon = {
                ...formData,
                id: `c${Date.now()}`,
                usedCount: 0,
                status: 'active'
            };
            setCoupons([newCoupon, ...coupons]);
            showToast('New coupon launched!', 'success');
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to deactivate this coupon?')) {
            setCoupons(coupons.filter(c => c.id !== id));
            showToast('Coupon removed', 'warning');
        }
    };

    return (
        <div className="ds-section-spacing animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="ds-h1 flex items-center gap-3">
                        Promo Engine
                        <Badge variant="primary" className="text-[10px] font-black uppercase tracking-widest">v4.2 PRO</Badge>
                    </h1>
                    <p className="ds-description mt-1">Design, deploy, and track high-conversion discount campaigns.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    CREATE NEW PROMO
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Coupons', value: stats.total, icon: HiOutlineTicket, color: 'indigo' },
                    { label: 'Active Codes', value: stats.active, icon: HiOutlineCheckCircle, color: 'emerald' },
                    { label: 'Redemptions', value: stats.totalRedeemed.toLocaleString(), icon: HiOutlineUsers, color: 'amber' },
                    { label: 'Expiring Soon', value: stats.expiringSoon, icon: HiOutlineClock, color: 'rose' },
                ].map((s, i) => (
                    <Card key={i} className="p-6 border-none shadow-xl ring-1 ring-slate-100 bg-white group hover:ring-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2.5 rounded-2xl",
                                s.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                s.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                s.color === 'amber' && "bg-amber-50 text-amber-600",
                                s.color === 'rose' && "bg-rose-50 text-rose-600",
                            )}>
                                <s.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</h4>
                        <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-xl overflow-hidden">
                {/* Table Filters */}
                <div className="p-4 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative group flex-1 max-w-md">
                            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by code or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none ring-1 ring-transparent focus:ring-primary/10 transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                            {['all', 'active', 'expired'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        statusFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupon Code</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offerings</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCoupons.map((c) => (
                                <tr key={c.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <HiOutlineTicket className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-black text-slate-900 tracking-wider bg-slate-100 px-2 py-1 rounded-lg border-2 border-dashed border-slate-300">{c.code}</span>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1.5">{c.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-slate-900">
                                                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400">Min. Order: ₹{c.minOrder}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Redeemed</span>
                                                <span className="text-xs font-black text-slate-900">{c.usedCount}/{c.totalLimit}</span>
                                            </div>
                                            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${(c.usedCount / c.totalLimit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <HiOutlineCalendarDays className="h-4 w-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Till {new Date(c.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <Badge variant={c.status === 'active' ? 'success' : 'secondary'} className="text-[9px] font-black uppercase">
                                            {c.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(c)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            >
                                                <HiOutlinePencilSquare className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <HiOutlineTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCoupons.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <HiOutlineTicket className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">No codes found</h3>
                        <p className="text-sm font-bold text-slate-400 mt-2">Try adjusting your filters or create a new promotion.</p>
                    </div>
                )}
            </Card>

            {/* Modal for Create/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCoupon ? "Modify Promotion" : "New Promotion Protocol"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promo Code</label>
                            <input
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="E.G. SUMMER50"
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest outline-none ring-1 ring-transparent focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount Value</label>
                            <input
                                required
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Order Requirement</label>
                            <input
                                required
                                type="number"
                                value={formData.minOrder}
                                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
                            <input
                                required
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe the campaign..."
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        >
                            {editingCoupon ? 'SAVE CHANGES' : 'LAUNCH CAMPAIGN'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CouponManagement;
