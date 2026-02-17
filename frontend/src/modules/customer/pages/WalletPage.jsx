import React from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const WalletPage = () => {
    const transactions = [
        { id: 1, type: 'credit', title: 'Added to Wallet', date: 'Today, 10:30 AM', amount: 500 },
        { id: 2, type: 'debit', title: 'Order Payment', date: 'Yesterday, 8:15 PM', amount: 350 },
        { id: 3, type: 'credit', title: 'Refund Processed', date: '15 Feb, 2:00 PM', amount: 120 },
    ];

    return (
        <CustomerLayout headerText="Transaction History" showHeader={false}>
            <div className="min-h-screen bg-slate-50 pb-24 font-sans">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-10 pb-28 relative z-10 rounded-b-[2.5rem] shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
                    <h1 className="text-3xl font-black text-white tracking-tight relative z-10">Transaction History</h1>
                    <p className="text-green-50 text-sm font-medium mt-1 relative z-10">View your recent payments and refunds</p>
                </div>

                <div className="max-w-2xl mx-auto px-4 -mt-20 relative z-20 space-y-6">

                    {/* Transaction History List - Now the main card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 min-h-[400px]">

                        <div className="space-y-6">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{tx.title}</h4>
                                            <p className="text-slate-400 text-xs font-medium">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-lg ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default WalletPage;
