import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, ReceiptIndianRupee } from 'lucide-react';
import { customerApi } from '../services/customerApi';

const OrderTransactionsPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await customerApi.getMyOrders();
                setOrders(res.data.results || []);
            } catch (error) {
                console.error('Failed to fetch orders for transaction history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-8 pb-24 relative z-10 rounded-b-[3rem] shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                <div className="flex items-center gap-2 mb-6 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-2xl font-black text-white tracking-tight">Order Transactions</h1>
                </div>

                <div className="relative z-10 text-left">
                    <p className="text-green-50 text-sm font-medium">
                        View a history of all your paid orders and refunds.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Transaction History</h3>
                            <p className="text-[11px] text-slate-400 font-semibold">
                                Based on your recent orders
                            </p>
                        </div>
                        <ReceiptIndianRupee className="h-6 w-6 text-slate-300" />
                    </div>

                    {loading ? (
                        <div className="py-10 flex items-center justify-center text-xs text-slate-400 font-semibold">
                            Loading transactions...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center px-6">
                            <p className="text-sm font-semibold text-slate-500 mb-1">
                                No transactions yet
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Place an order to see your payment history here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {orders.map((order) => {
                                const isRefund = order.paymentStatus === 'refunded';
                                const amount = order.totalAmount || order.payableAmount || 0;
                                const createdAt = order.createdAt ? new Date(order.createdAt) : null;

                                return (
                                    <div
                                        key={order._id}
                                        className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                                                    isRefund
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-emerald-50 text-emerald-600'
                                                }`}
                                            >
                                                {isRefund ? (
                                                    <ArrowUpRight size={22} />
                                                ) : (
                                                    <ArrowDownLeft size={22} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">
                                                    {isRefund ? 'Refund' : 'Order Payment'}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 font-semibold">
                                                    #{order.orderId || order._id?.slice(-8)} •{' '}
                                                    {order.paymentMethod || 'Online'}
                                                </p>
                                                {createdAt && (
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                        {createdAt.toLocaleDateString()},{' '}
                                                        {createdAt.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className={`text-base font-black ${
                                                isRefund ? 'text-amber-600' : 'text-slate-900'
                                            }`}
                                        >
                                            {isRefund ? '+' : '-'}₹{amount}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTransactionsPage;

