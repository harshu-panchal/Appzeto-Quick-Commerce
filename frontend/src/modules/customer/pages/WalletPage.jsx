import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, Wallet } from 'lucide-react';

const WalletPage = () => {
    const navigate = useNavigate();
    const transactions = [
        { id: 1, type: 'credit', title: 'Added to Wallet', date: 'Today, 10:30 AM', amount: 500 },
        { id: 2, type: 'debit', title: 'Order Payment', date: 'Yesterday, 8:15 PM', amount: 350 },
        { id: 3, type: 'credit', title: 'Refund Processed', date: '15 Feb, 2:00 PM', amount: 120 },
    ];

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
                    <h2 className="text-6xl font-black text-white">₹1,250</h2>
                    <button className="mt-8 px-8 py-3 bg-white text-[#0c831f] font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                        Add Money
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800">Transaction History</h3>
                        <Wallet size={20} className="text-slate-300" />
                    </div>

                    <div className="divide-y divide-slate-50">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{tx.title}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{tx.date}</p>
                                    </div>
                                </div>
                                <div className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'
                                    }`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 text-center">
                        <button className="text-sm font-bold text-slate-400 hover:text-[#0c831f] transition-colors">
                            View All Transactions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
