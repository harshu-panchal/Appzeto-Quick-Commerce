import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import InvoiceModal from '../components/order/InvoiceModal';
import HelpModal from '../components/order/HelpModal';
import LiveTrackingMap from '../components/order/LiveTrackingMap';
import {
    ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin,
    CreditCard, Download, HelpCircle, Phone, ArrowRight, User, Loader2
} from 'lucide-react';
import { customerApi } from '../services/customerApi';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [showInvoice, setShowInvoice] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await customerApi.getOrderDetails(orderId);
                setOrder(response.data.result);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Package size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Order not found</h3>
                <Link to="/orders" className="text-green-600 font-bold mt-4">Back to my orders</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-4 py-4 flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <Link to="/orders" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={24} className="text-slate-800" />
                </Link>
                <div>
                    <h1 className="text-lg font-black text-slate-800">Order Details</h1>
                    <p className="text-xs text-slate-500 font-medium">#{order.orderId}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                {/* Live Tracking Map */}
                <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <LiveTrackingMap
                        status={order.status}
                        eta={order.status === 'delivered' ? 'Arrived' : '8 mins'}
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
                        {order.items.map((item, idx) => (
                            <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-xl transition-colors px-2 -mx-2">
                                <div className="h-16 w-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                                    <p className="text-slate-500 text-xs font-medium">{item.quantity} quantity</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800">₹{item.price * item.quantity}</p>
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
                            <span>₹{order.pricing.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium px-2">
                            <span>Delivery Fee</span>
                            <span className={order.pricing.deliveryFee === 0 ? "text-[#0c831f]" : ""}>
                                {order.pricing.deliveryFee === 0 ? "FREE" : `₹${order.pricing.deliveryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium px-2">
                            <span>GST</span>
                            <span>₹{order.pricing.gst}</span>
                        </div>
                        {order.pricing.tip > 0 && (
                            <div className="flex justify-between text-slate-500 font-medium px-2">
                                <span>Tip</span>
                                <span>₹{order.pricing.tip}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center px-2">
                            <span className="text-lg font-black text-slate-800">Grand Total</span>
                            <span className="text-2xl font-black text-[#0c831f]">₹{order.pricing.total}</span>
                        </div>
                    </div>
                    <div className="mt-6 bg-green-50 rounded-2xl p-4 flex items-center justify-between border border-green-100 border-dashed">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#0c831f] shadow-sm">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#0c831f] uppercase tracking-wider">Payment Method</span>
                                <span className="text-sm font-bold text-slate-800 truncate max-w-[150px]">
                                    {order.payment.method === 'cash' ? 'Cash on Delivery' : order.payment.method}
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] bg-white px-2 py-1 rounded-md text-slate-500 font-mono shadow-sm border border-green-100">
                            {order.payment.transactionId || 'N/A'}
                        </span>
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
                            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xs">{order.address.address}, {order.address.city}</p>
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
    );
};

export default OrderDetailPage;
