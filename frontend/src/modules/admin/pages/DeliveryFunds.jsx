import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import { 
    HiOutlineMagnifyingGlass, 
    HiOutlineFunnel, 
    HiOutlineWallet,
    HiOutlineBanknotes,
    HiOutlineArrowUpRight,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineArrowPath,
    HiOutlineCreditCard,
    HiOutlineBuildingLibrary,
    HiOutlineReceiptRefund,
    HiOutlineDocumentText,
    HiOutlineShieldCheck,
    HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryFunds = () => {
    // Mock Data for Fund Transfers
    const [transfers, setTransfers] = useState([
        {
            id: 'TXN-001',
            riderName: 'Rahul Sharma',
            riderId: 'RD-001',
            amount: 4250,
            status: 'completed', // completed, pending, failed
            paymentMethod: 'UPI / PhonePe',
            accountInfo: 'rahul.s@okaxis',
            dateTime: '15 Feb 2024, 10:30 AM',
            referenceId: '882310223941',
            type: 'settlement'
        },
        {
            id: 'TXN-002',
            riderName: 'Vikram Singh',
            riderId: 'RD-002',
            amount: 1850,
            status: 'pending',
            paymentMethod: 'Bank IMPS',
            accountInfo: 'XXXX-XXXX-5678',
            dateTime: '15 Feb 2024, 02:15 PM',
            referenceId: 'WAITING_BANK_ACK',
            type: 'incentive'
        },
        {
            id: 'TXN-003',
            riderName: 'Amit Kumar',
            riderId: 'RD-003',
            amount: 920,
            status: 'failed',
            paymentMethod: 'Direct Deposit',
            accountInfo: 'XXXX-XXXX-9012',
            dateTime: '14 Feb 2024, 06:45 PM',
            referenceId: 'ERR_INSUFFICIENT_FUNDS',
            type: 'rebate'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewingTxn, setViewingTxn] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredTransfers = useMemo(() => {
        return transfers.filter(tx => {
            const matchesSearch = tx.riderName.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.includes(searchTerm);
            const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [transfers, searchTerm, filterStatus]);

    const stats = [
        { label: 'Total Settled', value: '₹1,24,500', icon: HiOutlineBanknotes, color: 'emerald' },
        { label: 'Pending Payouts', value: '₹12,850', icon: HiOutlineClock, color: 'amber' },
        { label: 'System Float', value: '₹45,000', icon: HiOutlineWallet, color: 'indigo' },
        { label: 'Refunded', value: '₹2,400', icon: HiOutlineReceiptRefund, color: 'rose' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Funds Settlement
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <HiOutlineShieldCheck className="h-5 w-5 text-emerald-600" />
                        </div>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Audit and execute secure fund transfers to your fleet partners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                        <HiOutlineBanknotes className="h-4 w-4" />
                        <span>BULK SETTLE ALL</span>
                    </button>
                </div>
            </div>

            {/* Financial Multi-Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-6 border-none shadow-xl ring-1 ring-slate-100 hover:ring-primary/20 transition-all group relative overflow-hidden bg-white">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={cn(
                                "p-3.5 rounded-2xl transition-all duration-500 group-hover:rotate-12",
                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                                "bg-rose-50 text-rose-600"
                            )}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 opacity-[0.03] translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                            <stat.icon className="h-32 w-32" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Utility Ledger Bar */}
            <Card className="p-4 border-none shadow-lg ring-1 ring-slate-100/50 bg-white/60 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text"
                            placeholder="Find transaction by ID or rider name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border-none rounded-2xl text-xs font-semibold outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center gap-1">
                            {['all', 'completed', 'pending', 'failed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                        filterStatus === status 
                                            ? "bg-white text-slate-900 shadow-md" 
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button className="p-3.5 bg-white ring-1 ring-slate-200 rounded-2xl text-slate-600 hover:text-primary transition-all shadow-sm">
                            <HiOutlineFunnel className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Funds Ledger Table */}
            <Card className="border-none shadow-2xl ring-1 ring-slate-100 overflow-hidden bg-white rounded-[40px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-12">Transaction Node</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider Entity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Ledger Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransfers.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="px-10 py-7 pl-12">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-900/5 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <HiOutlineArrowUpRight className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 tracking-tight">{tx.id}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{tx.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{tx.riderName}</p>
                                            <span className="text-[10px] font-bold text-slate-400">{tx.riderId}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-black text-slate-900">₹{tx.amount.toLocaleString()}</p>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            {tx.status === 'completed' ? (
                                                <HiOutlineCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                            ) : tx.status === 'pending' ? (
                                                <HiOutlineClock className="h-4 w-4 text-amber-500 shrink-0 animate-spin-slow" />
                                            ) : (
                                                <HiOutlineXCircle className="h-4 w-4 text-rose-500 shrink-0" />
                                            )}
                                            <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'destructive'} className="text-[8px] font-black uppercase tracking-wider px-2">
                                                {tx.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right pr-12">
                                        <button 
                                            onClick={() => setViewingTxn(tx)}
                                            className="p-3 bg-white ring-1 ring-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:ring-slate-900 transition-all shadow-sm active:scale-95"
                                        >
                                            <HiOutlineDocumentText className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Detailed Transaction Modal (Receipt Style) */}
            <AnimatePresence>
                {viewingTxn && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setViewingTxn(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-lg relative z-10 bg-white rounded-[40px] shadow-3xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Ledger Entry</h3>
                                    <button onClick={() => setViewingTxn(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                                        <HiOutlineXCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="text-center mb-10">
                                    <div className={cn(
                                        "h-20 w-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-lg",
                                        viewingTxn.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                                        viewingTxn.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        <HiOutlineBanknotes className="h-10 w-10" />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">₹{viewingTxn.amount.toLocaleString()}</h4>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <Badge variant={viewingTxn.status === 'completed' ? 'success' : 'warning'} className="uppercase font-black text-[9px]">
                                            {viewingTxn.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{viewingTxn.id}</span>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-dashed border-slate-200">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fleet Partner</p>
                                            <p className="text-sm font-bold text-slate-900">{viewingTxn.riderName}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{viewingTxn.riderId}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Date</p>
                                            <p className="text-sm font-bold text-slate-900">{viewingTxn.dateTime}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</p>
                                            <div className="flex items-center gap-2">
                                                <HiOutlineCreditCard className="h-4 w-4 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-900">{viewingTxn.paymentMethod}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                            <div className="flex items-center gap-2">
                                                <HiOutlineBuildingLibrary className="h-4 w-4 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-900">{viewingTxn.accountInfo}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref. ID</p>
                                            <span className="text-xs font-black text-slate-900 font-mono tracking-tight">{viewingTxn.referenceId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button className="flex-1 py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                        Download Receipt
                                    </button>
                                    <button className="p-4.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
                                        <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeliveryFunds;
