import React, { useState, useMemo, useEffect } from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Badge from '@shared/components/ui/Badge';
import Input from '@shared/components/ui/Input';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlineEye,
    HiOutlinePrinter,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineTruck,
    HiOutlineBanknotes,
    HiOutlineClock,
    HiOutlineArchiveBoxXMark,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
    HiOutlineChevronDown
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Orders Page

import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import ShimmerButton from '@/components/ui/shimmer-button';
import { sellerApi } from '../services/sellerApi';
import { useToast } from '@shared/components/ui/Toast';
import { Loader2 } from 'lucide-react';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await sellerApi.getOrders();
            const formattedOrders = (response.data.results || []).map(order => ({
                id: order.orderId,
                _id: order._id,
                customer: {
                    name: order.customer.name,
                    phone: order.customer.phone,
                    avatar: order.customer.name.charAt(0)
                },
                items: order.items.map(item => ({
                    name: item.name,
                    price: item.price,
                    qty: item.quantity,
                    image: item.image
                })),
                total: order.pricing.total,
                status: order.status, // Keep it raw for selection
                date: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                time: new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                address: `${order.address.address}, ${order.address.city}`,
                payment: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Online Paid'
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            showToast("Failed to fetch orders", "error");
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['All', 'Pending', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusToMatch = activeTab === 'Out for Delivery' ? 'out_for_delivery' : activeTab.toLowerCase();
            const matchesTab = activeTab === 'All' || order.status.toLowerCase() === statusToMatch;
            return matchesSearch && matchesTab;
        });
    }, [orders, searchTerm, activeTab]);

    const stats = useMemo(() => [
        {
            label: 'Total Orders',
            value: orders.length,
            icon: HiOutlineArchiveBoxXMark,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            label: 'Pending',
            value: orders.filter(o => o.status.toLowerCase() === 'pending').length,
            icon: HiOutlineClock,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Confirmed',
            value: orders.filter(o => o.status.toLowerCase() === 'confirmed').length,
            icon: HiOutlineCheck,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Delivered',
            value: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
            icon: HiOutlineCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    ], [orders]);

    const getStatusColor = (status) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'packed': return 'primary';
            case 'out_for_delivery': return 'secondary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'secondary';
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await sellerApi.updateOrderStatus(orderId, { status: newStatus.toLowerCase() });
            showToast(`Order status updated to ${newStatus}`, "success");
            fetchOrders(); // Refresh orders
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const exportOrders = () => {
        console.log('Exporting orders...');
        alert('Exporting ' + orders.length + ' orders as Excel/CSV (Simulation)');
    };

    return (
        <div className="space-y-6 pb-16">
            <BlurFade delay={0.1}>
                {/* Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Order Management
                            <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase bg-blue-100 text-blue-700">Real-time</Badge>
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-medium">Process and track your customer orders with ease.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={exportOrders}
                            variant="outline"
                            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
                        >
                            <HiOutlinePrinter className="h-4 w-4" />
                            <span>EXPORT ALL</span>
                        </Button>
                        <ShimmerButton
                            onClick={() => setIsQuickViewModalOpen(true)}
                            className="px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-xl flex items-center space-x-2"
                        >
                            <HiOutlineEye className="h-4 w-4 mr-2" />
                            <span>QUICK VIEW</span>
                        </ShimmerButton>
                    </div>
                </div>
            </BlurFade>

            {/* Quick Stats */}
            {loading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-xs">Fetching Active Orders...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <BlurFade key={i} delay={0.1 + (i * 0.05)}>
                                <MagicCard
                                    className="border-none shadow-sm ring-1 ring-slate-100 p-0 overflow-hidden group bg-white"
                                    gradientColor={stat.bg.includes('indigo') ? "#eef2ff" : stat.bg.includes('amber') ? "#fffbeb" : stat.bg.includes('emerald') ? "#ecfdf5" : "#fff1f2"}
                                >
                                    <div className="flex items-center gap-3 p-4 relative z-10">
                                        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm", stat.bg, stat.color)}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                                        </div>
                                    </div>
                                </MagicCard>
                            </BlurFade>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <BlurFade delay={0.3}>
                        <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden rounded-lg bg-white">
                            {/* Tabs */}
                            <div className="border-b border-slate-100 bg-slate-50/30 overflow-x-auto scrollbar-hide">
                                <div className="flex px-6 items-center">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "relative py-4 px-4 text-xs font-bold whitespace-nowrap transition-all duration-300",
                                                activeTab === tab
                                                    ? "text-primary scale-105"
                                                    : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="tab-underline"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toolbox */}
                            <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 items-center">
                                <div className="relative flex-1 group w-full">
                                    <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by Order ID or Customer Name..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-lg text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 shrink-0 w-full lg:w-auto">
                                    <button className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm w-full lg:w-auto">
                                        <HiOutlineFunnel className="h-4 w-4" />
                                        <span>DATE FILTER</span>
                                    </button>
                                </div>
                            </div>

                            {/* Order Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence mode="popLayout">
                                            {filteredOrders.map((order) => (
                                                <motion.tr
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    key={order.id}
                                                    className="hover:bg-slate-50/50 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleViewDetails(order)}>
                                                                #{order.id}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 mt-1">
                                                                <HiOutlineCalendarDays className="h-3 w-3" />
                                                                {order.date} • {order.time}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                                                                {order.customer.avatar}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-900">{order.customer.name}</p>
                                                                <p className="text-[9px] font-semibold text-slate-400">{order.customer.phone}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-900">₹{order.total.toLocaleString()}</span>
                                                            <span className="text-[9px] font-semibold text-slate-400">{order.items.length} items</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="relative inline-block w-36">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                className={cn(
                                                                    "w-full text-[9px] pl-2.5 pr-8 py-1.5 rounded-full font-black uppercase tracking-widest cursor-pointer appearance-none focus:ring-2 focus:ring-offset-1 transition-all border-none outline-none shadow-sm",
                                                                    order.status === 'pending' ? "bg-amber-100 text-amber-700 focus:ring-amber-200" :
                                                                        order.status === 'confirmed' ? "bg-blue-100 text-blue-700 focus:ring-blue-200" :
                                                                            order.status === 'packed' ? "bg-indigo-100 text-indigo-700 focus:ring-indigo-200" :
                                                                                order.status === 'out_for_delivery' ? "bg-purple-100 text-purple-700 focus:ring-purple-200" :
                                                                                    order.status === 'delivered' ? "bg-emerald-100 text-emerald-700 focus:ring-emerald-200" :
                                                                                        order.status === 'cancelled' ? "bg-rose-100 text-rose-700 focus:ring-rose-200" :
                                                                                            "bg-slate-100 text-slate-700 focus:ring-slate-200"
                                                                )}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="confirmed">Confirmed</option>
                                                                <option value="packed">Packed</option>
                                                                <option value="out_for_delivery">Out for Delivery</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-60" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end space-x-1.5">
                                                            <button
                                                                onClick={() => handleViewDetails(order)}
                                                                className="p-1.5 hover:bg-white hover:text-primary rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-slate-100"
                                                            >
                                                                <HiOutlineEye className="h-4 w-4" />
                                                            </button>
                                                            {order.status === 'Pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusUpdate(order.id, 'Processing');
                                                                        }}
                                                                        className="p-1.5 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-slate-100"
                                                                    >
                                                                        <HiOutlineCheck className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusUpdate(order.id, 'Cancelled');
                                                                        }}
                                                                        className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-slate-100"
                                                                    >
                                                                        <HiOutlineXMark className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                                {filteredOrders.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 px-6">
                                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                            <HiOutlineInboxStack className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">No orders found</h3>
                                        <p className="text-xs text-slate-400 font-medium max-w-xs text-center mt-1">We couldn't find any orders matching your current filters. Try adjusting your search.</p>
                                        <Button variant="outline" className="mt-6 rounded-xl text-xs" onClick={() => { setActiveTab('All'); setSearchTerm(''); }}>CLEAR ALL FILTERS</Button>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between px-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Showing {filteredOrders.length} of {orders.length} Orders
                                </p>
                                <div className="flex gap-1">
                                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed"><HiOutlineChevronRight className="h-3.5 w-3.5 rotate-180" /></button>
                                    <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed"><HiOutlineChevronRight className="h-3.5 w-3.5" /></button>
                                </div>
                            </div>
                        </Card>
                    </BlurFade>

                    {/* Order Details Modal */}
                    {/* ... (existing details modal) */}

                    {/* Quick View Summary Modal */}
                    <AnimatePresence>
                        {isQuickViewModalOpen && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                                    onClick={() => setIsQuickViewModalOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="w-full max-w-lg relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden"
                                >
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                                <HiOutlineChartBar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-slate-900">Quick Snapshot</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Performance</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsQuickViewModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                            <HiOutlineXMark className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Summary Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Revenue</p>
                                                <p className="text-xl font-black text-indigo-700">₹{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Avg. Order Value</p>
                                                <p className="text-xl font-black text-emerald-700">₹{(orders.reduce((acc, o) => acc + o.total, 0) / orders.length).toFixed(0)}</p>
                                            </div>
                                        </div>

                                        {/* Recent Pending */}
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                Latest Pending Orders
                                                <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'Pending').length} Action needed</span>
                                            </h4>
                                            <div className="space-y-2">
                                                {orders.filter(o => o.status === 'Pending').slice(0, 3).map((order) => (
                                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                                                                {order.customer.avatar}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-900">#{order.id}</p>
                                                                <p className="text-[10px] font-medium text-slate-400">₹{order.total.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setIsQuickViewModalOpen(false);
                                                                handleViewDetails(order);
                                                            }}
                                                            className="text-[10px] font-black text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Process
                                                        </button>
                                                    </div>
                                                ))}
                                                {orders.filter(o => o.status === 'Pending').length === 0 && (
                                                    <p className="text-xs text-center text-slate-400 py-4 font-medium italic">All caught up! No pending orders.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                                        <Button
                                            onClick={() => {
                                                setIsQuickViewModalOpen(false);
                                                setActiveTab('Pending');
                                            }}
                                            className="w-full py-3 text-xs font-bold"
                                        >
                                            VIEW ALL PENDING ORDERS
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isDetailsModalOpen && selectedOrder && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                                    onClick={() => setIsDetailsModalOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="w-full max-w-2xl relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                                >
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                                <HiOutlineTruck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-slate-900">Order Details</h3>
                                                <div className="flex items-center space-x-2 mt-0.5">
                                                    <Badge variant={getStatusColor(selectedOrder.status)} className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0">{selectedOrder.status}</Badge>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{selectedOrder.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                            <HiOutlineXMark className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <HiOutlineMapPin className="h-3 w-3 text-primary" /> Delivery Address
                                                    </h4>
                                                    <p className="text-xs font-bold text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                                                        {selectedOrder.address}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <HiOutlinePhone className="h-3 w-3 text-emerald-500" /> Contact Info
                                                    </h4>
                                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                                                        <p className="text-xs font-bold text-slate-800">{selectedOrder.customer.name}</p>
                                                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{selectedOrder.customer.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10">
                                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Order Summary</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="font-bold text-slate-500">Subtotal</span>
                                                            <span className="font-black text-slate-900">₹{(selectedOrder.total - 10).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="font-bold text-slate-500">Delivery Fee</span>
                                                            <span className="font-black text-emerald-600">₹10.00</span>
                                                        </div>
                                                        <div className="h-px bg-primary/10 my-2" />
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-black text-slate-900">Total</span>
                                                            <span className="font-black text-primary">₹{selectedOrder.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-900 p-4 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Status</h4>
                                                    <div className="flex items-center gap-2">
                                                        <HiOutlineBanknotes className="h-5 w-5 text-emerald-400" />
                                                        <span className="text-xs font-bold tracking-tight">{selectedOrder.payment}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Ordered ({selectedOrder.items.length})</h4>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white ring-1 ring-slate-100 rounded-2xl group hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200">
                                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{item.name}</p>
                                                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">₹{item.price.toFixed(2)} × {item.qty}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-slate-900">₹{(item.price * item.qty).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                                        <button
                                            onClick={() => window.print()}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                                        >
                                            <HiOutlinePrinter className="h-4 w-4" />
                                            Print Invoice
                                        </button>
                                        <div className="flex gap-2 items-center">
                                            <button onClick={() => setIsDetailsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-100 transition-all">CLOSE</button>
                                            <div className="relative inline-block w-40">
                                                <select
                                                    value={selectedOrder.status.toLowerCase()}
                                                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                                    className={cn(
                                                        "w-full text-[10px] pl-3 pr-8 py-2 rounded-xl font-black uppercase tracking-wider border appearance-none cursor-pointer focus:ring-2 focus:ring-offset-1 transition-all outline-none shadow-sm",
                                                        getStatusColor(selectedOrder.status) === 'warning' ? "bg-amber-100 text-amber-700 focus:ring-amber-200" :
                                                            getStatusColor(selectedOrder.status) === 'info' ? "bg-blue-100 text-blue-700 focus:ring-blue-200" :
                                                                getStatusColor(selectedOrder.status) === 'primary' ? "bg-indigo-100 text-indigo-700 focus:ring-indigo-200" :
                                                                    getStatusColor(selectedOrder.status) === 'secondary' ? "bg-purple-100 text-purple-700 focus:ring-purple-200" :
                                                                        getStatusColor(selectedOrder.status) === 'success' ? "bg-emerald-100 text-emerald-700 focus:ring-emerald-200" :
                                                                            getStatusColor(selectedOrder.status) === 'error' ? "bg-rose-100 text-rose-700 focus:ring-rose-200" :
                                                                                "bg-slate-100 text-slate-700 focus:ring-slate-200"
                                                    )}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="packed">Packed</option>
                                                    <option value="out_for_delivery">Out for Delivery</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-60" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

const HiOutlineInboxStack = ({ className }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

export default Orders;
