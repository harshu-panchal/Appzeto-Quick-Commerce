import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Modal from '@shared/components/ui/Modal';
import {
    Banknote,
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ChevronRight,
    Building2,
    Truck,
    ArrowUpRight,
    CreditCard,
    MoreVertical,
    Download,
    Eye,
    CheckCircle,
    FileText,
    AlertCircle,
    RotateCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const WithdrawalRequests = () => {
    const [activeTab, setActiveTab] = useState('sellers'); // sellers or delivery
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionModal, setActionModal] = useState({ isOpen: false, type: null, request: null });

    // Mock Data for Withdrawals
    const [sellerRequests] = useState([
        {
            id: 'WR-S-901',
            name: 'Fresh Mart Store',
            type: 'seller',
            amount: 4500,
            status: 'pending',
            date: 'Today, 11:20 AM',
            bankDetails: { name: 'HDFC Bank', account: 'XXXX 4421', ifsc: 'HDFC0001234' },
            walletBalance: 8200,
            lastWithdrawal: '01 Feb 2024'
        },
        {
            id: 'WR-S-902',
            name: 'Organic Greens Co.',
            type: 'seller',
            amount: 12800,
            status: 'approved',
            date: 'Yesterday, 04:45 PM',
            bankDetails: { name: 'ICICI Bank', account: 'XXXX 8821', ifsc: 'ICIC0005512' },
            walletBalance: 15000,
            lastWithdrawal: '15 Jan 2024'
        },
        {
            id: 'WR-S-903',
            name: 'Dairy Pure Farms',
            type: 'seller',
            amount: 3200,
            status: 'processed',
            date: '12 Feb, 10:30 AM',
            bankDetails: { name: 'SBI Bank', account: 'XXXX 1102', ifsc: 'SBIN0004412' },
            walletBalance: 500,
            lastWithdrawal: '05 Feb 2024'
        }
    ]);

    const [deliveryRequests] = useState([
        {
            id: 'WR-D-701',
            name: 'Rahul Kumar',
            type: 'delivery',
            amount: 850,
            status: 'pending',
            date: 'Today, 09:15 AM',
            bankDetails: { name: 'Paytm Payments Bank', account: '9988776655', ifsc: 'PYTM0123456' },
            walletBalance: 1200,
            lastWithdrawal: 'Never'
        },
        {
            id: 'WR-D-702',
            name: 'Suresh Raina',
            type: 'delivery',
            amount: 1200,
            status: 'rejected',
            date: 'Yesterday, 02:00 PM',
            bankDetails: { name: 'Axis Bank', account: 'XXXX 5566', ifsc: 'UTIB0001221' },
            walletBalance: 1150,
            lastWithdrawal: '10 Feb 2024',
            rejectReason: 'Incomplete KYC documents'
        },
        {
            id: 'WR-D-703',
            name: 'Amit Singh',
            type: 'delivery',
            amount: 500,
            status: 'pending',
            date: '13 Feb, 06:20 PM',
            bankDetails: { name: 'HDFC Bank', account: 'XXXX 9901', ifsc: 'HDFC0001234' },
            walletBalance: 650,
            lastWithdrawal: '01 Feb 2024'
        }
    ]);

    const stats = {
        sellers: {
            pending: sellerRequests.filter(r => r.status === 'pending').length,
            amount: sellerRequests.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0),
            processed: sellerRequests.filter(r => r.status === 'processed').length
        },
        delivery: {
            pending: deliveryRequests.filter(r => r.status === 'pending').length,
            amount: deliveryRequests.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0),
            processed: deliveryRequests.filter(r => r.status === 'processed').length
        }
    };

    const currentData = useMemo(() => {
        const data = activeTab === 'sellers' ? sellerRequests : deliveryRequests;
        return data.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [activeTab, sellerRequests, deliveryRequests, searchTerm, filterStatus]);

    const handleAction = (type, request) => {
        setActionModal({ isOpen: true, type, request });
    };

    const confirmAction = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setActionModal({ isOpen: false, type: null, request: null });
            alert(`Request ${actionModal.request.id} has been ${actionModal.type === 'approve' ? 'approved' : 'rejected'} successfully.`);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="admin-h1 flex items-center gap-3">
                        Withdrawal Requests
                        <Badge variant="primary" className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">Financial Hub</Badge>
                    </h1>
                    <p className="admin-description mt-1">Review and process fund disbursement requests from sellers and delivery partners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <Download className="h-4 w-4" />
                        EXPORT ALL
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Pending', value: stats.sellers.pending + stats.delivery.pending, icon: Clock, color: 'amber', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
                    { label: 'Pending Volume', value: `₹${(stats.sellers.amount + stats.delivery.amount).toLocaleString()}`, icon: Banknote, color: 'blue', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
                    { label: 'Settled Today', value: stats.sellers.processed + stats.delivery.processed, icon: CheckCircle2, color: 'emerald', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                            </div>
                            <div>
                                <p className="admin-label mb-1">{stat.label}</p>
                                <h3 className="admin-stat-value">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Interface Tab Structure */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('sellers')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                                activeTab === 'sellers' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Building2 className="h-4 w-4" />
                            SELLER REQUESTS
                            <span className={cn(
                                "ml-1 px-2 py-0.5 rounded-full text-[10px]",
                                activeTab === 'sellers' ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                            )}>{sellerRequests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('delivery')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                                activeTab === 'delivery' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Truck className="h-4 w-4" />
                            DELIVERY PARTNERS
                            <span className={cn(
                                "ml-1 px-2 py-0.5 rounded-full text-[10px]",
                                activeTab === 'delivery' ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                            )}>{deliveryRequests.length}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/10 w-64 transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['all', 'pending', 'processed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                                        filterStatus === status ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <Card className="border-none shadow-2xl ring-1 ring-slate-100 overflow-hidden bg-white rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="admin-table-header pl-8">Requester Details</th>
                                    <th className="admin-table-header">Financial Scope</th>
                                    <th className="admin-table-header text-center">Amount Requested</th>
                                    <th className="admin-table-header">Gateway Status</th>
                                    <th className="admin-table-header text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentData.map((req, i) => (
                                    <tr key={req.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-6 py-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                                                    activeTab === 'sellers' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                                                )}>
                                                    {activeTab === 'sellers' ? <Building2 className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                                        {req.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.id}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <CreditCard className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[11px] font-bold text-slate-600">{req.bankDetails.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-60">
                                                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-semibold text-slate-500">A/C: {req.bankDetails.account}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <p className="text-sm font-black text-slate-900">₹{req.amount.toLocaleString()}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Wallet: ₹{req.walletBalance}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge
                                                variant={req.status === 'pending' ? 'warning' : req.status === 'processed' ? 'success' : req.status === 'approved' ? 'primary' : 'danger'}
                                                className="text-[9px] font-black px-3 py-1 uppercase tracking-wider"
                                            >
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction('approve', req)}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('reject', req)}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                    <FileText className="h-8 w-8 text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 font-bold text-sm">No withdrawal requests found for this category.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Request Detail Modal */}
            <Modal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Withdrawal Intel"
                size="md"
            >
                {selectedRequest && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                            <div className={cn(
                                "h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl",
                                selectedRequest.type === 'seller' ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
                            )}>
                                {selectedRequest.type === 'seller' ? <Building2 className="h-10 w-10" /> : <Truck className="h-10 w-10" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedRequest.name}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{selectedRequest.id}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Badge variant={selectedRequest.status === 'pending' ? 'warning' : 'success'}>
                                        {selectedRequest.status.toUpperCase()}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Requested on {selectedRequest.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-5 border-none bg-slate-50 ring-1 ring-slate-100 rounded-3xl">
                                <p className="admin-label mb-2">Request Amount</p>
                                <h4 className="text-2xl font-black text-slate-900">₹{selectedRequest.amount.toLocaleString()}</h4>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1">From available balance</p>
                            </Card>
                            <Card className="p-5 border-none bg-slate-50 ring-1 ring-slate-100 rounded-3xl">
                                <p className="admin-label mb-2">Wallet Balance</p>
                                <h4 className="text-2xl font-black text-slate-900">₹{selectedRequest.walletBalance.toLocaleString()}</h4>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1">Status after: ₹{(selectedRequest.walletBalance - selectedRequest.amount).toLocaleString()}</p>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-primary" />
                                Settlement Pathway
                            </h4>
                            <div className="bg-white ring-1 ring-slate-100 p-6 rounded-[24px] space-y-4 shadow-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bank Name</p>
                                        <p className="text-sm font-black text-slate-700">{selectedRequest.bankDetails.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</p>
                                        <p className="text-sm font-black text-slate-700">{selectedRequest.bankDetails.ifsc}</p>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-slate-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Account Number</p>
                                        <p className="text-sm font-mono font-black text-slate-700">{selectedRequest.bankDetails.account}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedRequest.status === 'rejected' && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Reason for Rejection</p>
                                    <p className="text-xs font-semibold text-rose-500 mt-1">{selectedRequest.rejectReason}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {selectedRequest.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => { setSelectedRequest(null); handleAction('approve', selectedRequest); }}
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
                                    >
                                        Authorize Transfer
                                    </button>
                                    <button
                                        onClick={() => { setSelectedRequest(null); handleAction('reject', selectedRequest); }}
                                        className="flex-1 py-4 bg-white ring-1 ring-slate-200 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Deny Request
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest"
                                >
                                    Close Intelligence
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Action Confirmation Modal */}
            <Modal
                isOpen={actionModal.isOpen}
                onClose={() => !isProcessing && setActionModal({ isOpen: false, type: null, request: null })}
                title="Confirm Financial Action"
                size="sm"
            >
                {actionModal.request && (
                    <div className="text-center space-y-6">
                        <div className={cn(
                            "h-16 w-16 rounded-3xl flex items-center justify-center mx-auto",
                            actionModal.type === 'approve' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {actionModal.type === 'approve' ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Are you sure?</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2 px-6">
                                You are about to {actionModal.type === 'approve' ? 'approve' : 'reject'} the withdrawal request for <b className="text-slate-900">₹{actionModal.request.amount.toLocaleString()}</b> by <b className="text-slate-900">{actionModal.request.name}</b>.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={confirmAction}
                                disabled={isProcessing}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2",
                                    actionModal.type === 'approve' ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-rose-500 text-white shadow-rose-200"
                                )}
                            >
                                {isProcessing && <RotateCw className="h-4 w-4 animate-spin" />}
                                {isProcessing ? 'PROCESSING...' : `YES, ${actionModal.type.toUpperCase()}`}
                            </button>
                            <button
                                onClick={() => setActionModal({ isOpen: false, type: null, request: null })}
                                disabled={isProcessing}
                                className="w-full py-4 bg-slate-50 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WithdrawalRequests;
