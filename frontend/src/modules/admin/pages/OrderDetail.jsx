// Ultimate Order Intelligence Dossier
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    ChevronLeft,
    Box,
    Truck,
    MapPin,
    User,
    Building2,
    Calendar,
    Clock,
    ShoppingBag,
    Printer,
    Download,
    Mail,
    Phone,
    Copy,
    ArrowUpRight,
    Search,
    IndianRupee,
    CreditCard,
    CheckCircle2,
    X,
    MoreVertical,
    MessageSquare,
    AlertCircle,
    Package,
    Navigation,
    Star,
    Store,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@shared/components/ui/Toast';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Mock Deep Order Intelligence
    const [order] = useState({
        id: orderId || 'ORD-9921',
        status: 'delivered',
        date: '15 Feb 2024',
        time: '11:20 AM',
        paymentStatus: 'paid',
        paymentMethod: 'UPI (PhonePe)',
        transactionId: 'TXN-8827364551',
        subtotal: 1150,
        deliveryFee: 50,
        tax: 50,
        discount: 0,
        total: 1250,
        items: [
            { id: 1, name: 'Premium Alphonso Mangoes', qty: 2, price: 400, total: 800, weight: '1kg', image: '🥭' },
            { id: 2, name: 'Saffron Tea Extracts', qty: 1, price: 350, total: 350, weight: '250g', image: '🍵' }
        ],
        customer: {
            id: 'CUST-001',
            name: 'Johnathan Doe',
            email: 'john.doe@business.com',
            phone: '+91 98765 43210',
            type: 'VVIP Premium',
            address: 'Penthouse 42, Sky Tower A, HSR Layout, Sector 2, Bangalore, KA - 560102',
            coordinates: '12.9141° N, 77.6411° E',
            orders: 42,
            lifetimeValue: '₹84,200'
        },
        merchant: {
            name: 'Fresh Mart Superstore',
            id: 'SMR-882',
            rating: 4.8,
            location: 'HSR Layout, BDA Complex Area',
            contact: '+91 88888 77777',
            type: 'Anchor Partner'
        },
        delivery: {
            riderName: 'Rahul Sharma',
            id: 'RID-421',
            phone: '+91 77777 66666',
            rating: 4.9,
            vehicle: 'EV Scooter (KA-01-EV-4421)',
            status: 'Delivered',
            tracking: [
                { time: '11:00 AM', event: 'Order Placed', desc: 'Handshake complete.' },
                { time: '11:05 AM', event: 'Merchant Confirmed', desc: 'Fresh Mart acknowledged order.' },
                { time: '11:12 AM', event: 'Rider Assigned', desc: 'Rahul Sharma accepted the delivery.' },
                { time: '11:18 AM', event: 'Out for Delivery', desc: 'On the way to customer.' },
                { time: '11:25 AM', event: 'Delivered', desc: 'Successful handover at Penthouse 42.' }
            ]
        },
        notes: 'Customer requested contactless delivery. Place near the main entry biometric sensor. Fragile contents.',
        billing: {
            gstin: '29ABCDE1234F1Z5',
            invoiceNo: 'INV-2024-9921'
        }
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-600 border-rose-200';
            default: return 'bg-blue-100 text-blue-600 border-blue-200';
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        showToast(`${label} copied to internal clipboard`, 'success');
    };

    return (
        <div className="ds-section-spacing animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white ring-1 ring-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 group"
                    >
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order #{order.id}</h1>
                            <Badge className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1", getStatusStyles(order.status))}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {order.date} • <Clock className="h-3.5 w-3.5 ml-1" /> {order.time}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white ring-1 ring-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Printer className="h-4 w-4 text-slate-400" />
                        Print Invoice
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                        <Download className="h-4 w-4 text-emerald-400" />
                        Export Intelligence
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Order Composition */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items in Order */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Box className="h-4 w-4 text-indigo-500" />
                                Items in Order
                            </h3>
                            <Badge className="bg-indigo-50 text-indigo-700 border-none text-[9px] font-black">{order.items.length} ITEMS</Badge>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Node</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aggregate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/30 transition-all">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center ds-h1 shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                                                        {item.image}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weight: {item.weight}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-sm font-bold text-slate-600">₹{item.price}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-700">x{item.qty}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right text-sm font-black text-slate-900">₹{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50/50 flex flex-col items-end gap-3 text-right">
                            <div className="flex items-center justify-between w-full max-w-[240px]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal Intelligence</span>
                                <span className="text-sm font-black text-slate-700">₹{order.subtotal}</span>
                            </div>
                            <div className="flex items-center justify-between w-full max-w-[240px]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistical Fee</span>
                                <span className="text-sm font-bold text-emerald-600">₹{order.deliveryFee}</span>
                            </div>
                            <div className="flex items-center justify-between w-full max-w-[240px]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax (GST)</span>
                                <span className="text-sm font-bold text-slate-600">₹{order.tax}</span>
                            </div>
                            <div className="h-px w-full max-w-[240px] bg-slate-200 my-2" />
                            <div className="flex items-center justify-between w-full max-w-[240px]">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Net Exposure</span>
                                <span className="text-2xl font-black text-fuchsia-600">₹{order.total}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Shop Details */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-2xl p-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Shop Details
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center ds-h2 font-black text-orange-600">
                                {order.merchant.name[0]}
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{order.merchant.name}</h3>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Verified Shop</p>
                            </div>
                        </div>
                    </Card>

                    {/* Delivery Status */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-xl p-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Navigation className="h-4 w-4 text-emerald-500" />
                            Delivery Status
                        </h3>
                        <div className="space-y-6 relative ml-4">
                            <div className="absolute top-0 bottom-0 left-[7px] w-0.5 bg-slate-100" />
                            {order.delivery.tracking.map((track, i) => (
                                <div key={i} className="flex gap-6 relative">
                                    <div className={cn(
                                        "h-4 w-4 rounded-full ring-4 ring-white z-10 mt-1",
                                        i === order.delivery.tracking.length - 1 ? "bg-emerald-500 shadow-lg shadow-emerald-200" : "bg-slate-300"
                                    )} />
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={cn("text-xs font-black uppercase tracking-tight", i === order.delivery.tracking.length - 1 ? "text-slate-900" : "text-slate-500")}>
                                                {track.event}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{track.time}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">"{track.desc}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Entities & Payment */}
                <div className="ds-section-spacing">
                    {/* Customer Details */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-2xl p-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer Details
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center ds-h2 font-black text-indigo-600">
                                {order.customer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{order.customer.name}</h3>
                                <p className="text-xs font-bold text-slate-400">Customer ID: {order.customer.id}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6 text-left">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> {order.customer.email}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                            <Phone className="h-3 w-3" /> {order.customer.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Logistical Destination</span>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{order.customer.address}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-sky-50/50 rounded-xl">
                                    <span className="text-[8px] font-black text-sky-600 uppercase tracking-widest block mb-1">Lifetime Vault</span>
                                    <span className="text-sm font-black text-slate-900">{order.customer.lifetimeValue}</span>
                                </div>
                                <div className="p-3 bg-emerald-50/50 rounded-xl">
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Order Frequency</span>
                                    <span className="text-sm font-black text-slate-900">{order.customer.orders} Units</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Merchant & Rider Intelligence */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-xl p-6 text-left">
                        <div className="ds-section-spacing">
                            {/* Merchant Node */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Building2 className="h-3.5 w-3.5" /> Merchant Node
                                    </h4>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                        <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                                        <span className="text-[9px] font-black text-amber-700">{order.merchant.rating}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                                        <ShoppingBag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-slate-900">{order.merchant.name}</h5>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {order.merchant.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Rider Node */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Truck className="h-3.5 w-3.5" /> Logistical Node (Rider)
                                    </h4>
                                    <Badge variant="success" className="text-[8px] font-black uppercase tracking-widest">Active</Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 overflow-hidden">
                                        <div className="h-full w-full flex items-center justify-center font-black text-slate-300 ds-h3">{order.delivery.riderName.charAt(0)}</div>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-slate-900">{order.delivery.riderName}</h5>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.delivery.vehicle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Details */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-2xl overflow-hidden">
                        <div className="p-6 bg-slate-900 text-white">
                            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-emerald-400" />
                                Payment Details
                            </h4>
                        </div>
                        <div className="p-4 space-y-6">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Summary</span>
                                <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase">PAID</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TXN Vector</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-700">{order.transactionId}</span>
                                    <button onClick={() => copyToClipboard(order.transactionId, 'Transaction ID')} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-300"><Copy className="h-3 w-3" /></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escrow State</span>
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* System Notes */}
                    <Card className="border-none shadow-xl ring-1 ring-amber-100 bg-amber-50/30 rounded-xl p-6 text-left">
                        <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Order Notes
                        </h4>
                        <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
                            "{order.notes}"
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
