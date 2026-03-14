import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, Wallet } from 'lucide-react';
import { customerApi } from '../services/customerApi';

const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const WalletPage = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    customerApi.getProfile(),
                    customerApi.getMyOrders(),
                ]);
                const profile = profileRes.data?.result ?? profileRes.data?.data ?? profileRes.data;
                const rawOrders = ordersRes.data?.results ?? ordersRes.data?.result ?? [];
                const orders = Array.isArray(rawOrders) ? rawOrders : [];
                setBalance(profile?.walletBalance ?? 0);
                // Only orders purchased using wallet
                const walletOrders = orders.filter(
                    (o) => (o.payment?.method || '').toLowerCase() === 'wallet'
                );
                const items = walletOrders.map((o) => ({
                    _id: o._id,
                    type: 'debit',
                    title: 'Order Payment',
                    amount: o.pricing?.total ?? o.payableAmount ?? 0,
                    date: o.createdAt,
                    orderId: o.orderId,
                }));
                setTransactions(items);
            } catch (err) {
                console.error('Wallet fetch error:', err);
                setBalance(0);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-8 pb-32 relative z-10 rounded-b-[3rem] shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                <div className="flex items-center gap-2 mb-8 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-2xl font-black text-white tracking-tight">Appzeto Wallet</h1>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <p className="text-green-50 text-sm font-bold uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-6xl font-black text-white">
                        {loading ? '...' : `₹${(balance || 0).toLocaleString('en-IN')}`}
                    </h2>
                    <p className="text-green-50/80 text-xs font-medium mt-2">Return refunds are credited here</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">Transaction History</h3>
                        <Wallet size={20} className="text-slate-300" />
                    </div>

                    {loading ? (
                        <div className="py-12 flex justify-center text-slate-400 text-sm font-semibold">
                            Loading...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                            <p className="text-sm font-semibold text-slate-500 mb-1">No wallet payments yet</p>
                            <p className="text-xs text-slate-400">
                                Orders paid using wallet will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <div key={tx._id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{tx.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium">{formatDate(tx.date)}</p>
                                            {tx.orderId && (
                                                <p className="text-[10px] text-slate-400">#{tx.orderId}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{(tx.amount || 0).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
