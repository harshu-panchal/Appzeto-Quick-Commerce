import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import InvoiceModal from '../components/order/InvoiceModal';
import HelpModal from '../components/order/HelpModal';
import LiveTrackingMap from '../components/order/LiveTrackingMap';
import CustomerLayout from '../components/layout/CustomerLayout';
import {
    ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin,
    CreditCard, Download, HelpCircle, Phone, ArrowRight, User
} from 'lucide-react';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [showInvoice, setShowInvoice] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock Order Data - Ideally this would be fetched based on orderId
    // In a real app, you would use useQuery or similar to fetch order details
    // Mock Order Data Lookup
    const mockOrders = {
        'ORD-2024-001': {
            id: 'ORD-2024-001',
            date: 'Oct 24, 2024 at 10:30 AM',
            status: 'Delivered',
            total: 450,
            items: [
                { id: 1, name: 'Fresh Red Apple', qty: '1 kg', price: 120, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200' },
                { id: 2, name: 'Amul Gold Milk', qty: '500 ml', price: 32, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200' },
                { id: 3, name: 'Whole Wheat Bread', qty: '1 pack', price: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
            ],
            bill: { itemTotal: 197, delivery: 0, tax: 15, grandTotal: 212 },
            address: { name: 'John Doe', type: 'Home', text: 'Flat 402, Sunshine Apartments, Sector 12, Dwarka, New Delhi - 110075', phone: '+91 98765 43210' },
            payment: { method: 'UPI (Google Pay)', status: 'Paid', txnId: 'UPI-1234567890' },
            timeline: [
                { status: 'Order Placed', date: '6:30 PM', completed: true },
                { status: 'Packed', date: '6:45 PM', completed: true },
                { status: 'Out for Delivery', date: '7:00 PM', completed: true },
                { status: 'Delivered', date: '7:15 PM', completed: true },
            ]
        },
        'ORD-2024-002': {
            id: 'ORD-2024-002',
            date: 'Yesterday, 8:15 PM',
            status: 'Out for Delivery',
            total: 1250,
            items: [
                { id: 1, name: 'Vegetables Pack', qty: '1 kg', price: 450, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200' },
                { id: 2, name: 'Rice 5kg', qty: '1 bag', price: 600, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
                { id: 3, name: 'Cooking Oil', qty: '1 liter', price: 200, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' },
            ],
            bill: { itemTotal: 1250, delivery: 0, tax: 50, grandTotal: 1300 },
            address: { name: 'John Doe', type: 'Work', text: 'Office No. 5, Technohub, Cyber City, Gurugram - 122002', phone: '+91 98765 43210' },
            payment: { method: 'Credit Card', status: 'Paid', txnId: 'CC-9876543210' },
            timeline: [
                { status: 'Order Placed', date: 'Yesterday, 8:15 PM', completed: true },
                { status: 'Packed', date: 'Yesterday, 8:30 PM', completed: true },
                { status: 'Out for Delivery', date: 'Today, 8:00 AM', completed: true },
                { status: 'Delivered', date: 'Expected by 10:00 AM', completed: false },
            ]
        }
    };

    const order = mockOrders[orderId] || mockOrders['ORD-2024-001'];

    return (
        <CustomerLayout showHeader={false}>
            <div className="min-h-screen bg-slate-50 pb-24 font-sans">
                {/* Header */}
                <div className="bg-white sticky top-0 z-30 px-4 py-4 flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                    <Link to="/orders" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronLeft size={24} className="text-slate-800" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-slate-800">Order Details</h1>
                        <p className="text-xs text-slate-500 font-medium">#{order.id}</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Live Tracking Map */}
                    <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                        <LiveTrackingMap
                            status={order.status}
                            eta={order.status === 'Delivered' ? 'Arrived' : '8 mins'}
                            riderName="Ramesh Kumar"
                        />
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-4 px-1 flex items-center gap-2">
                            <Package size={20} className="text-slate-400" />
                            Items in this Order
                        </h3>
                        <div className="divide-y divide-slate-50">
                            {order.items.map((item) => (
                                <div key={item.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-xl transition-colors px-2 -mx-2">
                                    <div className="h-16 w-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                                        <p className="text-slate-500 text-xs font-medium">{item.qty} quantity</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-800">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bill Details */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-4 px-1">Bill Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-500 font-medium px-2">
                                <span>Item Total</span>
                                <span>₹{order.bill.itemTotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-medium px-2">
                                <span>Delivery Fee</span>
                                <span className="text-[#0c831f]">FREE</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-medium px-2">
                                <span>Taxes & Charges</span>
                                <span>₹{order.bill.tax}</span>
                            </div>
                            <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center px-2">
                                <span className="text-lg font-black text-slate-800">Grand Total</span>
                                <span className="text-2xl font-black text-[#0c831f]">₹{order.bill.grandTotal}</span>
                            </div>
                        </div>
                        <div className="mt-6 bg-green-50 rounded-2xl p-4 flex items-center justify-between border border-green-100 border-dashed">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#0c831f] shadow-sm">
                                    <CreditCard size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-[#0c831f] uppercase tracking-wider">Payment Method</span>
                                    <span className="text-sm font-bold text-slate-800">{order.payment.method}</span>
                                </div>
                            </div>
                            <span className="text-[10px] bg-white px-2 py-1 rounded-md text-slate-500 font-mono shadow-sm border border-green-100">{order.payment.txnId}</span>
                        </div>
                    </div>

                    {/* Address & Actions */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-4 px-1">Delivery Details</h3>
                        <div className="flex gap-4 p-2">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-800">{order.address.type}</h4>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">{order.address.name}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xs">{order.address.text}</p>
                                <p className="text-sm text-slate-800 font-bold mt-2 flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400" /> {order.address.phone}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowInvoice(true)}
                                className="py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Download size={18} /> Download Invoice
                            </button>
                            <button
                                onClick={() => setShowHelp(true)}
                                className="py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <HelpCircle size={18} /> Need Help?
                            </button>
                        </div>
                    </div>

                </div>

                {/* Modals */}
                <InvoiceModal
                    isOpen={showInvoice}
                    onClose={() => setShowInvoice(false)}
                    order={order}
                />
                <HelpModal
                    isOpen={showHelp}
                    onClose={() => setShowHelp(false)}
                />
            </div>
        </CustomerLayout>
    );
};

export default OrderDetailPage;
