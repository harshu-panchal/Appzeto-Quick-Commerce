// Comprehensive Order Management System
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    Search,
    Filter,
    ChevronRight,
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    RotateCcw,
    MoreVertical,
    Eye,
    Download,
    Calendar,
    ArrowUpRight,
    Package,
    MapPin,
    IndianRupee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@shared/components/ui/Toast';

const OrdersList = () => {
    const { status = 'all' } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('All Time');

    // Mock Order Data
    const [orders] = useState([
        {
            id: 'ORD-9921',
            customer: 'John Doe',
            items: 3,
            amount: 1250,
            status: 'delivered',
            date: '15 Feb, 11:30 AM',
            payment: 'Digital',
            deliveryBoy: 'Rahul Sharma',
            seller: 'Fresh Mart'
        },
        {
            id: 'ORD-9882',
            customer: 'Sarah Smith',
            items: 1,
            amount: 450,
            status: 'pending',
            date: '14 Feb, 04:20 PM',
            payment: 'COD',
            deliveryBoy: null,
            seller: 'Daily Needs'
        },
        {
            id: 'ORD-9812',
            customer: 'Michael Brown',
            items: 5,
            amount: 3200,
            status: 'processed',
            date: '10 Feb, 02:10 PM',
            payment: 'Digital',
            deliveryBoy: 'Amit Patel',
            seller: 'Grocery Hub'
        },
        {
            id: 'ORD-9750',
            customer: 'Emily Davis',
            items: 2,
            amount: 1800,
            status: 'out-for-delivery',
            date: '05 Feb, 09:15 AM',
            payment: 'Digital',
            deliveryBoy: 'Suresh Kumar',
            seller: 'Fresh Mart'
        },
        {
            id: 'ORD-9690',
            customer: 'David Wilson',
            items: 1,
            amount: 250,
            status: 'cancelled',
            date: '01 Feb, 06:45 PM',
            payment: 'Cancelled',
            deliveryBoy: null,
            seller: 'Quick Shop'
        },
        {
            id: 'ORD-9650',
            customer: 'Anna Taylor',
            items: 4,
            amount: 2100,
            status: 'returned',
            date: '28 Jan, 01:20 PM',
            payment: 'Refunded',
            deliveryBoy: 'Vikram Singh',
            seller: 'Grocery Hub'
        },
        {
            id: 'ORD-9600',
            customer: 'Chris Evans',
            items: 2,
            amount: 950,
            status: 'pending',
            date: '27 Jan, 10:00 AM',
            payment: 'COD',
            deliveryBoy: null,
            seller: 'Fresh Mart'
        }
    ]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.seller.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = status === 'all' || order.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, status]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'processed': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'out-for-delivery': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-600 border-rose-200';
            case 'returned': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'processed': return <CheckCircle2 className="h-4 w-4" />;
            case 'out-for-delivery': return <Truck className="h-4 w-4" />;
            case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
            case 'cancelled': return <XCircle className="h-4 w-4" />;
            case 'returned': return <RotateCcw className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    const handleExport = () => {
        showToast('Exporting order data archive...', 'info');
    };

    const pageTitle = status === 'all' ? 'All Orders' : status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="ds-section-spacing animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="ds-h1 flex items-center gap-3">
                        {pageTitle}
                        <div className="p-2 bg-fuchsia-100 rounded-xl">
                            <ShoppingBag className="h-5 w-5 text-fuchsia-600" />
                        </div>
                    </h1>
                    <p className="ds-description mt-1">View and manage all orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-3 bg-white ring-1 ring-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Download className="h-4 w-4 text-sky-500" />
                        EXPORT
                    </button>
                    <div className="h-10 w-px bg-slate-200 mx-1 hidden lg:block" />
                    <button className="flex items-center gap-2 px-5 py-3 bg-white ring-1 ring-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        {dateRange}
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Earnings', value: '₹4.2L', trend: '+12.5%', icon: IndianRupee, color: 'emerald' },
                    { label: 'Active Orders', value: orders.filter(o => ['pending', 'processed', 'out-for-delivery'].includes(o.status)).length, trend: '+5', icon: ShoppingBag, color: 'blue' },
                    { label: 'Average Prep Time', value: '18m', trend: '-2m', icon: Clock, color: 'amber' },
                    { label: 'Delivery Rate', value: '98.2%', trend: '+0.4%', icon: CheckCircle2, color: 'fuchsia' },
                ].map((stat, i) => (
                    <Card key={i} className="p-5 border-none shadow-sm ring-1 ring-slate-100 bg-white group hover:ring-fuchsia-200 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded-xl", `bg-${stat.color}-50`)}>
                                <stat.icon className={cn("h-5 w-5", `text-${stat.color}-600`)} />
                            </div>
                            <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">
                                {stat.trend}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Orders Table Section */}
            <Card className="border-none shadow-2xl ring-1 ring-slate-100/50 bg-white rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-fuchsia-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer, or Shop..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-fuchsia-500/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer & Shop</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50/30 transition-all cursor-pointer" onClick={() => navigate(`/admin/orders/view/${order.id}`)}>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400 group-hover:text-fuchsia-500 font-bold text-xs">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                                    #{order.id}
                                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all text-slate-400" />
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-400 py-0.5">
                                                        {order.items} {order.items > 1 ? 'Items' : 'Item'}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold text-slate-300">•</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{order.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                <span className="text-xs font-black text-slate-700">{order.customer}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-bold text-slate-400">{order.seller}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all",
                                            getStatusStyles(order.status)
                                        )}>
                                            {getStatusIcon(order.status)}
                                            {order.status.replace(/-/g, ' ')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-900">₹{order.amount.toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-0.5">{order.payment}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-right">
                                        <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Search className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-300 uppercase tracking-tight">No Orders Found</h4>
                                                <p className="text-sm font-bold text-slate-300 mt-1">We couldn't find any orders matching your search.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-900 font-black">{filteredOrders.length}</span> of {orders.length} Orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Prev</button>
                        <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-fuchsia-100">1</button>
                        <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OrdersList;
