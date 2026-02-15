import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Modal from '@shared/components/ui/Modal';
import {
    Receipt,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Building2,
    Calendar,
    Download,
    Eye,
    ChevronRight,
    TrendingUp,
    CreditCard,
    Percent,
    ShoppingCart,
    Undo2,
    Wallet,
    Banknote,
    Info,
    RotateCw,
    ExternalLink,
    ShoppingBag,
    Landmark,
    Clock,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SellerTransactions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedSeller, setSelectedSeller] = useState('all');
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    // Mock Sellers for Filter
    const sellers = [
        { id: 'S1', name: 'Fresh Mart Superstore' },
        { id: 'S2', name: 'Tech Zone Electronics' },
        { id: 'S3', name: 'Organic Greens Co.' },
        { id: 'S4', name: 'Dairy Pure Farms' }
    ];

    // Detailed Mock Transaction History
    const [transactions] = useState([
        {
            id: 'TXN-SET-10024',
            orderId: 'ORD-9921',
            date: '15 Feb 2024, 11:30 AM',
            seller: 'Fresh Mart Superstore',
            type: 'sale',
            amount: 1250.00,
            commissionRate: 10,
            commissionAmount: 125.00,
            taxAmount: 22.50,
            netPayable: 1102.50,
            status: 'settled',
            paymentMethod: 'UPI / Online',
            items: [
                { name: 'Basmati Rice 5kg', qty: 2, price: 500 },
                { name: 'Sunflower Oil 2L', qty: 1, price: 250 }
            ]
        },
        {
            id: 'TXN-PAY-55012',
            date: '15 Feb 2024, 09:15 AM',
            seller: 'Tech Zone Electronics',
            type: 'payout',
            amount: 8500.00,
            status: 'processed',
            paymentMethod: 'IMPS Bank Transfer',
            referenceId: 'UTR662110099',
            bankDetails: 'HDFC Bank (XXXX 4421)'
        },
        {
            id: 'TXN-REF-22091',
            orderId: 'ORD-9882',
            date: '14 Feb 2024, 04:20 PM',
            seller: 'Organic Greens Co.',
            type: 'refund',
            amount: -450.00,
            status: 'completed',
            notes: 'Customer returned damaged products'
        },
        {
            id: 'TXN-SET-10023',
            orderId: 'ORD-9918',
            date: '14 Feb 2024, 02:10 PM',
            seller: 'Fresh Mart Superstore',
            type: 'sale',
            amount: 850.00,
            commissionRate: 10,
            commissionAmount: 85.00,
            taxAmount: 15.30,
            netPayable: 749.70,
            status: 'pending',
            paymentMethod: 'Cash (COD)'
        },
        {
            id: 'TXN-SET-10022',
            orderId: 'ORD-9915',
            date: '13 Feb 2024, 10:45 AM',
            seller: 'Dairy Pure Farms',
            type: 'sale',
            amount: 320.00,
            commissionRate: 5,
            commissionAmount: 16.00,
            taxAmount: 5.76,
            netPayable: 298.24,
            status: 'settled',
            paymentMethod: 'Online'
        }
    ]);

    const stats = useMemo(() => {
        return {
            totalGross: transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0),
            totalCommission: transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.commissionAmount, 0),
            totalPayouts: Math.abs(transactions.filter(t => t.type === 'payout').reduce((acc, t) => acc + t.amount, 0)),
            pendingSettlements: transactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0)
        };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.orderId && t.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                t.seller.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesSeller = selectedSeller === 'all' || t.seller === selectedSeller;

            return matchesSearch && matchesStatus && matchesType && matchesSeller;
        });
    }, [transactions, searchTerm, filterStatus, filterType, selectedSeller]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Financial ledger exported successfully.');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="admin-h1 flex items-center gap-3">
                        Shop Transactions
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                            <Receipt className="h-5 w-5 text-orange-600" />
                        </div>
                    </h1>
                    <p className="admin-description mt-1">Track sales, our share, and payments to shops.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-5 py-3 bg-white ring-1 ring-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isExporting ? <RotateCw className="h-4 w-4 animate-spin text-orange-500" /> : <Download className="h-4 w-4" />}
                        {isExporting ? 'Generating Report...' : 'Download Master Ledger'}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 group">
                        <TrendingUp className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Revenue Insights
                    </button>
                </div>
            </div>

            {/* Live Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Sales', value: `₹${stats.totalGross.toLocaleString()}`, icon: ShoppingBag, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    { label: 'Our Share', value: `₹${stats.totalCommission.toLocaleString()}`, icon: Percent, bg: 'bg-orange-50', color: 'text-orange-600' },
                    { label: 'Total Paid Out', value: `₹${stats.totalPayouts.toLocaleString()}`, icon: Banknote, bg: 'bg-blue-50', color: 'text-blue-600' },
                    { label: 'Pending Total', value: `₹${stats.pendingSettlements.toLocaleString()}`, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
                ].map((stat, i) => (
                    <Card key={i} className="px-5 py-4 border-none shadow-sm ring-1 ring-slate-100 hover:ring-orange-200 transition-all bg-white group overflow-hidden relative">
                        <div className="relative z-10">
                            <div className={cn("p-2 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <p className="admin-label mb-1">{stat.label}</p>
                            <h3 className="admin-stat-value">{stat.value}</h3>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <stat.icon className="h-24 w-24" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <Card className="p-4 border-none shadow-xl ring-1 ring-slate-100/50 bg-white/80 backdrop-blur-xl rounded-[28px]">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by Store, Order ID, or Txn Reference..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl ring-1 ring-slate-100">
                            <Filter className="h-3.5 w-3.5 text-slate-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="sale">Sales Only</option>
                                <option value="payout">Payouts Only</option>
                                <option value="refund">Refunds</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl ring-1 ring-slate-100">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <select
                                value={selectedSeller}
                                onChange={(e) => setSelectedSeller(e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none cursor-pointer max-w-[150px]"
                            >
                                <option value="all">All Merchants</option>
                                {sellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['all', 'paid', 'pending'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all",
                                        filterStatus === status ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Master Table Area */}
            <Card className="border-none shadow-2xl ring-1 ring-slate-100 overflow-hidden bg-white rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="admin-table-header pl-8 py-5">TXN Details</th>
                                <th className="admin-table-header">Shop</th>
                                <th className="admin-table-header">Info</th>
                                <th className="admin-table-header text-center">Amount</th>
                                <th className="admin-table-header text-center">Summary</th>
                                <th className="admin-table-header text-center">Status</th>
                                <th className="admin-table-header text-right pr-8">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-6 py-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                                txn.type === 'sale' ? "bg-blue-50 text-blue-600" : txn.type === 'payout' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            )}>
                                                {txn.type === 'sale' ? <ShoppingCart className="h-5 w-5" /> : txn.type === 'payout' ? <ArrowUpRight className="h-5 w-5" /> : <Undo2 className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{txn.id}</p>
                                                <p className="text-xs font-bold text-slate-900 mt-0.5">{txn.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3.5 w-3.5 text-slate-300" />
                                            <p className="text-sm font-bold text-slate-700">{txn.seller}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{txn.type}</span>
                                            {txn.orderId && <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{txn.orderId}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <p className={cn(
                                            "text-sm font-black",
                                            txn.amount > 0 ? "text-slate-900" : "text-rose-600"
                                        )}>
                                            ₹{Math.abs(txn.amount).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {txn.type === 'sale' ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-bold text-rose-500">(-₹{txn.commissionAmount})</span>
                                                <span className="text-xs font-black text-emerald-600 pt-0.5">₹{txn.netPayable.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 font-bold text-[10px]">---</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge
                                            variant={txn.status === 'settled' || txn.status === 'processed' || txn.status === 'completed' ? 'success' : 'warning'}
                                            className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest"
                                        >
                                            {txn.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right pr-8">
                                        <button
                                            onClick={() => setSelectedTxn(txn)}
                                            className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-orange-500 transition-all active:scale-90"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-32 text-center text-slate-400 font-bold">
                                        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        No transactions match your current search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Drill-down Detail Modal */}
            <Modal
                isOpen={!!selectedTxn}
                onClose={() => setSelectedTxn(null)}
                title="Transaction Intelligence"
                size="md"
            >
                {selectedTxn && (
                    <div className="space-y-8">
                        <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                            <div className={cn(
                                "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white",
                                selectedTxn.type === 'sale' ? "bg-orange-500" : selectedTxn.type === 'payout' ? "bg-emerald-500" : "bg-rose-500"
                            )}>
                                {selectedTxn.type === 'sale' ? <ShoppingCart className="h-8 w-8" /> : selectedTxn.type === 'payout' ? <ArrowUpRight className="h-8 w-8" /> : <Undo2 className="h-8 w-8" />}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {selectedTxn.amount > 0 ? '' : '-'}₹{Math.abs(selectedTxn.amount).toLocaleString()}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{selectedTxn.id}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 px-4">
                                <div>
                                    <p className="admin-label">Chronology</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <p className="text-sm font-bold text-slate-700">{selectedTxn.date}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="admin-label">Merchant Name</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        <p className="text-sm font-bold text-slate-700">{selectedTxn.seller}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="admin-label">Payment Pathway</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CreditCard className="h-4 w-4 text-slate-400" />
                                        <p className="text-sm font-bold text-slate-700">{selectedTxn.paymentMethod}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="admin-label">Gateway Status</p>
                                    <div className="mt-1">
                                        <Badge variant={selectedTxn.status === 'settled' ? 'success' : 'warning'}>{selectedTxn.status.toUpperCase()}</Badge>
                                    </div>
                                </div>
                            </div>

                            {selectedTxn.type === 'sale' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Financial Drill-Down</h4>
                                    <div className="bg-slate-900 rounded-[28px] p-6 text-white space-y-4">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="opacity-60">Base Subtotal</span>
                                            <span>₹{selectedTxn.amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="opacity-60">Admin Fee ({selectedTxn.commissionRate}%)</span>
                                            <span className="text-orange-400">-₹{selectedTxn.commissionAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="opacity-60">Tax & Surcharge</span>
                                            <span className="text-orange-400">-₹{selectedTxn.taxAmount}</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest">Merchant Net Payable</span>
                                            <span className="text-lg font-black text-emerald-400">₹{selectedTxn.netPayable}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTxn.type === 'payout' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Transfer Intel</h4>
                                    <div className="bg-emerald-50 ring-1 ring-emerald-100 rounded-[24px] p-6 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Info className="h-5 w-5 text-emerald-600" />
                                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Successful Disbursement</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-emerald-600/60 uppercase">Reference Identifier</span>
                                                <span className="text-xs font-mono font-black text-emerald-900 line-clamp-1">{selectedTxn.referenceId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-emerald-600/60 uppercase">Settlement Target</span>
                                                <span className="text-xs font-black text-emerald-900">{selectedTxn.bankDetails}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">
                                    Download Voucher
                                </button>
                                <button className="p-4 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all">
                                    <ExternalLink className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SellerTransactions;
