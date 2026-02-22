import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Badge from '@shared/components/ui/Badge';
import Input from '@shared/components/ui/Input';
import {
    HiOutlineCube,
    HiOutlineExclamationTriangle,
    HiOutlineArchiveBoxXMark,
    HiOutlineArrowsUpDown,
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineArrowPath,
    HiOutlineClipboardDocumentList,
    HiOutlineXMark,
    HiOutlineCheck,
    HiOutlineCalendarDays
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';

const MOCK_INVENTORY = [
    { id: '1', name: 'Fresh Alfonso Mangoes', sku: 'MGO-001', stock: 124, threshold: 50, price: 450, category: 'Fruits', status: 'In Stock', lastRestock: '2023-10-15' },
    { id: '2', name: 'Organic Bananas (Dozen)', sku: 'BAN-005', stock: 12, threshold: 30, price: 60, category: 'Fruits', status: 'Low Stock', lastRestock: '2023-10-12' },
    { id: '3', name: 'Premium Basmati Rice 5kg', sku: 'RIC-102', stock: 0, threshold: 20, price: 850, category: 'Grocery', status: 'Out of Stock', lastRestock: '2023-10-01' },
    { id: '4', name: 'Natural Honey 500g', sku: 'HNY-044', stock: 45, threshold: 15, price: 320, category: 'Grocery', status: 'In Stock', lastRestock: '2023-10-18' },
    { id: '5', name: 'Red Apples (Washington)', sku: 'APL-009', stock: 8, threshold: 40, price: 180, category: 'Fruits', status: 'Low Stock', lastRestock: '2023-10-14' },
];

const MOCK_HISTORY = [
    { id: 'H1', productName: 'Fresh Alfonso Mangoes', type: 'Restock', quantity: '+50', date: '2023-10-15', time: '10:30 AM', note: 'Bulk purchase from supplier' },
    { id: 'H2', productName: 'Organic Bananas (Dozen)', type: 'Sale', quantity: '-5', date: '2023-10-19', time: '02:15 PM', note: 'Order #ORD-1022' },
    { id: 'H3', productName: 'Red Apples (Washington)', type: 'Correction', quantity: '-2', date: '2023-10-18', time: '11:00 AM', note: 'Damaged inventory removal' },
];

const StockManagement = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('inventory'); // 'inventory' or 'history'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustType, setAdjustType] = useState('Restock');
    const [adjustValue, setAdjustValue] = useState('');
    const [adjustNote, setAdjustNote] = useState('');

    const stats = useMemo(() => [
        { label: 'Total Inventory', value: inventory.reduce((acc, item) => acc + item.stock, 0), icon: HiOutlineCube, color: 'text-indigo-600', bg: 'bg-indigo-50', status: 'All' },
        { label: 'Low Stock Items', value: inventory.filter(i => i.stock > 0 && i.stock <= i.threshold).length, icon: HiOutlineExclamationTriangle, color: 'text-amber-600', bg: 'bg-amber-50', status: 'Low Stock' },
        { label: 'Out of Stock', value: inventory.filter(i => i.stock === 0).length, icon: HiOutlineArchiveBoxXMark, color: 'text-rose-600', bg: 'bg-rose-50', status: 'Out of Stock' },
        { label: 'Stock Valuation', value: `₹${inventory.reduce((acc, item) => acc + (item.stock * item.price), 0).toLocaleString()}`, icon: HiOutlineArrowsUpDown, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'In Stock' }
    ], [inventory]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [inventory, searchTerm, filterStatus]);

    const handleQuickAdjust = (id, delta) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newStock = Math.max(0, item.stock + delta);
                let newStatus = 'In Stock';
                if (newStock === 0) newStatus = 'Out of Stock';
                else if (newStock <= item.threshold) newStatus = 'Low Stock';
                return { ...item, stock: newStock, status: newStatus };
            }
            return item;
        }));
    };

    const openAdjustModal = (item) => {
        setSelectedItem(item);
        setAdjustValue('');
        setAdjustNote('');
        setIsAdjustModalOpen(true);
    };

    const handleFullAdjustment = () => {
        const value = parseInt(adjustValue);
        if (isNaN(value) || value <= 0) return;

        const delta = adjustType === 'Restock' ? value : -value;
        handleQuickAdjust(selectedItem.id, delta);
        setIsAdjustModalOpen(false);
    };

    return (
        <div className="space-y-6 pb-16">
            <BlurFade delay={0.1}>
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Stock Management
                            <Badge variant="warning" className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase bg-amber-100 text-amber-700">Inventory Control</Badge>
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-medium">Monitor stock levels, manage restocks, and track movements.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveView('inventory')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                activeView === 'inventory' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            In Stock
                        </button>
                        <button
                            onClick={() => setActiveView('history')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                activeView === 'history' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            History Log
                        </button>
                    </div>
                </div>
            </BlurFade>

            {activeView === 'inventory' ? (
                <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <BlurFade key={i} delay={0.1 + (i * 0.05)}>
                                <div onClick={() => setFilterStatus(stat.status)} className="cursor-pointer">
                                    <MagicCard
                                        className="border-none shadow-sm ring-1 ring-slate-100 p-0 overflow-hidden group bg-white"
                                        gradientColor="#f8fafc"
                                    >
                                        <div className="flex items-center gap-3 p-4 relative z-10">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm", stat.bg, stat.color)}>
                                                <stat.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                                            </div>
                                        </div>
                                    </MagicCard>
                                </div>
                            </BlurFade>
                        ))}
                    </div>

                    <BlurFade delay={0.3}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl">
                            {/* Toolbox */}
                            <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
                                <div className="relative w-full md:w-80">
                                    <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by product name or SKU..."
                                        className="pl-10 pr-4 py-2.5 rounded-2xl border-none ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-primary/20 transition-all text-xs font-semibold"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="rounded-xl px-4 py-2 text-[10px] font-bold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-sm">
                                        <HiOutlineFunnel className="h-4 w-4 mr-2" />
                                        FILTERS
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/seller/products/add')}
                                        className="rounded-xl px-4 py-2 text-[10px] font-bold shadow-lg shadow-primary/20"
                                    >
                                        <HiOutlinePlus className="h-4 w-4 mr-2" />
                                        ADD NEW PRODUCT
                                    </Button>
                                </div>
                            </div>

                            {/* Stock Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Information</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Capacity</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Health</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Adjust</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence>
                                            {filteredInventory.map((item) => (
                                                <motion.tr
                                                    key={item.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-slate-50/80 transition-all cursor-default"
                                                >
                                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4 group">
                                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                                                <HiOutlineCube className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Product Code: {item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-black",
                                                    item.stock <= item.threshold ? "text-rose-600" : "text-slate-900"
                                                )}>
                                                    {item.stock} units
                                                </span>
                                                {item.stock <= item.threshold && (
                                                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded w-fit mt-0.5">Low Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={item.status === 'In Stock' ? 'success' : 'destructive'} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-black text-slate-900">₹{item.price}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => openAdjustModal(item)}
                                            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                                        >
                                            Adjust Stock
                                        </button>
                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </BlurFade>
                </>
            ) : (
                /* History View */
                <BlurFade delay={0.2}>
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Inventory Movement Log</h3>
                                <p className="text-xs text-slate-500 font-medium">Audit trail for all stock adjustments and sales.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl text-xs font-bold bg-white">
                                <HiOutlineArrowPath className="h-4 w-4 mr-2" />
                                REFRESH LOG
                            </Button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {MOCK_HISTORY.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                                            log.type === 'Restock' ? "bg-emerald-50 text-emerald-600" :
                                                log.type === 'Sale' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {log.type === 'Restock' ? <HiOutlinePlus className="h-6 w-6" /> :
                                                log.type === 'Sale' ? <HiOutlineCube className="h-6 w-6" /> : <HiOutlineArrowPath className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-black text-slate-900">{log.productName}</h4>
                                                <Badge className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0",
                                                    log.type === 'Restock' ? "bg-emerald-100 text-emerald-700" :
                                                        log.type === 'Sale' ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                                                )}>
                                                    {log.type.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-semibold mt-1">Note: {log.note}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "text-lg font-black tracking-tight mb-0.5",
                                            log.quantity.startsWith('+') ? "text-emerald-600" :
                                                log.quantity.startsWith('-') ? "text-rose-600" : "text-slate-900"
                                        )}>
                                            {log.quantity}
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-400">
                                            <HiOutlineCalendarDays className="h-3.5 w-3.5" />
                                            {log.date} • {log.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </BlurFade>
            )}

            {/* Advanced Adjustment Modal */}
            <AnimatePresence>
                {isAdjustModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsAdjustModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                                        <HiOutlineArrowsUpDown className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">Adjust Inventory</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Update product stock</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAdjustModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                    <HiOutlineXMark className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <HiOutlineCube className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{selectedItem.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400">CURRENT STOCK: <span className="text-slate-900 font-black">{selectedItem.stock} UNITS</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                                        {['Restock', 'Remove'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setAdjustType(type)}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                    adjustType === type
                                                        ? "bg-white text-slate-900 shadow-md"
                                                        : "text-slate-400 hover:text-slate-600"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity Change</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">#</div>
                                            <input
                                                type="number"
                                                value={adjustValue}
                                                onChange={(e) => setAdjustValue(e.target.value)}
                                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Note (Optional)</label>
                                        <textarea
                                            value={adjustNote}
                                            onChange={(e) => setAdjustNote(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none h-20"
                                            placeholder="Reason for adjustment..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                                <Button
                                    onClick={() => setIsAdjustModalOpen(false)}
                                    variant="outline"
                                    className="flex-1 py-4 text-xs font-bold rounded-2xl bg-white"
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    onClick={handleFullAdjustment}
                                    className="flex-1 py-4 text-xs font-bold rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    SAVE CHANGES
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StockManagement;
