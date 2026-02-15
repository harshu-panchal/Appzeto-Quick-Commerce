import React, { useState } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    TrendingUp,
    DollarSign,
    Building2,
    Clock,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Download,
    Filter,
    Search,
    ChevronRight,
    ArrowRight,
    History,
    PieChart,
    BarChart3,
    ArrowDownCircle,
    ArrowUpCircle,
    RotateCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@shared/components/ui/Modal';

const AdminWallet = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, earnings, payouts, refunds
    const stats = [
        {
            label: 'Total Platform Earning',
            value: '₹320',
            description: 'Total money collected',
            icon: TrendingUp,
            color: 'blue',
            bg: 'bg-blue-50',
            iconColor: 'text-blue-500'
        },
        {
            label: 'Total Admin Earning',
            value: '₹65',
            description: 'Net profit for platform',
            icon: DollarSign,
            color: 'purple',
            bg: 'bg-purple-50',
            iconColor: 'text-purple-500'
        },
        {
            label: 'Current Platform Balance',
            value: '₹320',
            description: 'Available for business',
            icon: Building2,
            color: 'emerald',
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-500'
        },
        {
            label: 'Pending from Delivery Boys',
            value: '₹0',
            description: 'COD cash to be collected',
            icon: Clock,
            color: 'amber',
            bg: 'bg-orange-50',
            iconColor: 'text-orange-500'
        },
        {
            label: 'Seller Pending Payouts',
            value: '₹270',
            description: 'Owed to sellers',
            icon: CreditCard,
            color: 'blue',
            bg: 'bg-blue-50',
            iconColor: 'text-blue-500'
        },
        {
            label: 'Delivery Boy Pending Payouts',
            value: '₹15',
            description: 'Owed to delivery partners',
            icon: CreditCard,
            color: 'purple',
            bg: 'bg-purple-50',
            iconColor: 'text-purple-500'
        }
    ];

    const [transactions] = useState([
        { id: 'TXN-8821', type: 'order_commission', amount: 45, status: 'completed', date: 'Today, 10:30 AM', sender: 'Order #9921', recipient: 'Platform Wallet', method: 'Internal Transfer', notes: 'Platform commission for Order #9921' },
        { id: 'TXN-8820', type: 'seller_payout', amount: -210, status: 'pending', date: 'Today, 09:15 AM', sender: 'Platform Wallet', recipient: 'Fresh Mart Store', method: 'Bank Transfer (IMPS)', notes: 'Weekly payout for verified seller' },
        { id: 'TXN-8819', type: 'delivery_earning', amount: 15, status: 'completed', date: 'Yesterday, 08:45 PM', sender: 'Order #9918', recipient: 'Rahul Delivery Partner', method: 'Internal Transfer', notes: 'Delivery fee payout for Order #9918' },
        { id: 'TXN-8818', type: 'cod_collection', amount: 850, status: 'completed', date: 'Yesterday, 06:30 PM', sender: 'Suresh Delivery Partner', recipient: 'Platform Wallet', method: 'Cash Deposit', notes: 'COD cash collected and verified' },
        { id: 'TXN-8817', type: 'refund_issued', amount: -120, status: 'completed', date: '13 Feb, 04:20 PM', sender: 'Platform Wallet', recipient: 'John Doe (User)', method: 'Gateway Refund', notes: 'Refund for cancelled Order #9812' },
    ]);

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.recipient.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === 'all' ||
            (activeTab === 'earnings' && txn.amount > 0) ||
            (activeTab === 'payouts' && txn.amount < 0 && txn.type !== 'refund_issued') ||
            (activeTab === 'refunds' && txn.type === 'refund_issued');

        return matchesSearch && matchesTab;
    });

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const headers = ['ID', 'Type', 'Amount', 'Status', 'Date', 'Sender', 'Recipient'];
            const data = filteredTransactions.map(t => [t.id, t.type, t.amount, t.status, t.date, t.sender, t.recipient]);
            const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `transaction_report_${new Date().toLocaleDateString()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
            alert('Statement exported successfully!');
        }, 1000);
    };

    const handleProcessPayouts = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert('All pending payouts have been processed successfully.');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="admin-h1">Admin Wallet & Finance</h1>
                    <p className="admin-description mt-1">Manage transactions, track earnings, and process withdrawals.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isExporting ? <RotateCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {isExporting ? 'EXPORTING...' : 'EXPORT STATEMENT'}
                    </button>
                    <button
                        onClick={handleProcessPayouts}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isProcessing ? <RotateCw className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                        {isProcessing ? 'PROCESSING...' : 'PROCESS PAYOUTS'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                    >
                        <Card className="px-5 py-3 border-none shadow-sm ring-1 ring-slate-100 hover:ring-primary/20 transition-all hover:shadow-xl bg-white group relative overflow-hidden">
                            <div className="flex flex-col h-full relative z-10">
                                {/* Top Row: Icon and Live Status */}
                                <div className="flex justify-between items-center mb-2">
                                    <div className={cn("p-1.5 rounded-xl transition-all duration-500 group-hover:rotate-6", stat.bg)}>
                                        <stat.icon className={cn("h-4 w-4", stat.iconColor)} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Live</span>
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                                    </div>
                                </div>

                                {/* Middle Row: Label and Value */}
                                <div className="mb-2.5">
                                    <p className="admin-label mb-0.5">{stat.label}</p>
                                    <h3 className="admin-stat-value">{stat.value}</h3>
                                </div>

                                {/* Bottom Row: Description */}
                                <div className="pt-2 border-t border-slate-50 mt-auto">
                                    <p className="text-[10px] font-semibold text-slate-400/80 flex items-center gap-2">
                                        <span className="w-1 h-3 rounded-full bg-slate-100" />
                                        {stat.description}
                                    </p>
                                </div>
                            </div>

                            {/* Background ghost icon */}
                            <div className="absolute -bottom-3 -right-3 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:scale-110">
                                <stat.icon className="h-24 w-24" strokeWidth={1} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <History className="h-5 w-5" />
                            </div>
                            <h2 className="admin-h2">Recent Transactions</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {['all', 'earnings', 'payouts', 'refunds'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all",
                                            activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search details..."
                                    className="pl-9 pr-4 py-2 bg-white ring-1 ring-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/10 w-48 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <Card className="border-none shadow-2xl ring-1 ring-slate-100/50 overflow-hidden bg-white rounded-[32px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="admin-table-header pl-8">Transaction Details</th>
                                        <th className="admin-table-header">Entities</th>
                                        <th className="admin-table-header text-center">Amount</th>
                                        <th className="admin-table-header">Status</th>
                                        <th className="admin-table-header text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredTransactions.map((txn, i) => (
                                        <tr
                                            key={txn.id}
                                            onClick={() => setSelectedTransaction(txn)}
                                            className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                        >
                                            <td className="px-6 py-5 pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                                        txn.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        {txn.amount > 0 ? <ArrowDownCircle className="h-5 w-5" /> : <ArrowUpCircle className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{txn.type.replace('_', ' ').toUpperCase()}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{txn.id} • {txn.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <ArrowDownLeft className="h-3 w-3 text-emerald-500" />
                                                        <span className="text-[11px] font-bold text-slate-600">{txn.recipient}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 opacity-50">
                                                        <ArrowUpRight className="h-3 w-3 text-rose-500" />
                                                        <span className="text-[10px] font-semibold text-slate-400">{txn.sender}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <p className={cn(
                                                    "text-sm font-black",
                                                    txn.amount > 0 ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge variant={txn.status === 'completed' ? 'success' : 'warning'} className="text-[8px] font-black px-2.5 py-1">
                                                    {txn.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5 text-right pr-8">
                                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-primary active:scale-90">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                        <Search className="h-8 w-8 text-slate-200" />
                                                    </div>
                                                    <p className="text-slate-400 font-bold text-sm">No transactions found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Side Panels */}
                <div className="space-y-8">
                    {/* Settlement Overview */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <PieChart className="h-5 w-5" />
                            </div>
                            <h2 className="admin-h2">Settlements</h2>
                        </div>
                        <Card className="p-6 border-none shadow-xl ring-1 ring-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Ready for Settlement</p>
                                    <h3 className="text-4xl font-black">₹285.00</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                                            <span className="text-xs font-bold text-slate-300">Sellers</span>
                                        </div>
                                        <span className="text-xs font-black">₹270.00</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-400" />
                                            <span className="text-xs font-bold text-slate-300">Riders</span>
                                        </div>
                                        <span className="text-xs font-black">₹15.00</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleProcessPayouts}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isProcessing ? <RotateCw className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4 group-hover:rotate-12 transition-transform" />}
                                    {isProcessing ? 'SETTLING...' : 'Bulk Settlement'}
                                </button>
                            </div>
                            <div className="absolute -bottom-8 -right-8 opacity-10">
                                <Wallet className="h-40 w-40" />
                            </div>
                        </Card>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Analytics</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Platform Revenue Report', icon: TrendingUp, path: '/admin' },
                                { label: 'Settlement History', icon: History, path: '/admin/delivery-funds' },
                                { label: 'Tax Statements', icon: DollarSign, path: '#' },
                            ].map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.path !== '#' ? navigate(link.path) : alert('Tax Statements generation is coming soon!')}
                                    className="w-full p-4 bg-white ring-1 ring-slate-100 rounded-[24px] flex items-center justify-between group hover:ring-primary/20 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            <link.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-black text-slate-700">{link.label}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            <Modal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                title="Transaction Details"
                size="md"
            >
                {selectedTransaction && (
                    <div className="space-y-6">
                        <div className="text-center pb-6 border-b border-slate-100">
                            <div className={cn(
                                "h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                                selectedTransaction.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {selectedTransaction.amount > 0 ? <ArrowDownCircle className="h-8 w-8" /> : <ArrowUpCircle className="h-8 w-8" />}
                            </div>
                            <h4 className="text-3xl font-black text-slate-900">₹{Math.abs(selectedTransaction.amount)}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedTransaction.status}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                                <p className="text-sm font-bold text-slate-900">{selectedTransaction.type.replace('_', ' ').toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                                <p className="text-sm font-bold text-slate-900">{selectedTransaction.date}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                                <p className="text-sm font-bold text-slate-700">{selectedTransaction.sender}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</p>
                                <p className="text-sm font-bold text-slate-700">{selectedTransaction.recipient}</p>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</p>
                                <p className="text-sm font-mono font-bold text-slate-900">{selectedTransaction.id}</p>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                                <p className="text-sm font-bold text-slate-700">{selectedTransaction.method}</p>
                            </div>
                            <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                                <p className="text-xs font-medium text-slate-600 italic">"{selectedTransaction.notes}"</p>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminWallet;
