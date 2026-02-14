import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlinePlus,
    HiOutlineEllipsisVertical,
    HiOutlinePhone,
    HiOutlineMapPin,
    HiOutlineTruck,
    HiOutlineUserCircle,
    HiOutlineStar,
    HiOutlineCurrencyDollar,
    HiOutlineCheckBadge,
    HiOutlineXCircle,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineEye
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveDeliveryBoys = () => {
    // Mock Data
    const [riders, setRiders] = useState([
        {
            id: 'r1',
            name: 'Rahul Sharma',
            phone: '+91 98765 43210',
            email: 'rahul.s@example.com',
            status: 'available', // available, busy, offline
            vehicle: 'Honda Activa (Two Wheeler)',
            vehicleNum: 'MH 12 AB 1234',
            rating: 4.8,
            totalOrders: 452,
            todayEarnings: 1250,
            location: 'Andheri West, Mumbai',
            lastSync: '2 mins ago',
            joinDate: '12 Jan 2023'
        },
        {
            id: 'r2',
            name: 'Vikram Singh',
            phone: '+91 88776 65544',
            email: 'vikram.v@example.com',
            status: 'busy',
            vehicle: 'TVS Jupiter',
            vehicleNum: 'MH 01 CD 5678',
            rating: 4.5,
            totalOrders: 230,
            todayEarnings: 850,
            location: 'Bandra East, Mumbai',
            lastSync: 'Now',
            joinDate: '05 Mar 2023'
        },
        {
            id: 'r3',
            name: 'Amit Kumar',
            phone: '+91 77665 54433',
            email: 'amit.k@example.com',
            status: 'offline',
            vehicle: 'Hero Splendor',
            vehicleNum: 'MH 04 EF 9012',
            rating: 4.9,
            totalOrders: 890,
            todayEarnings: 0,
            location: 'Powai, Mumbai',
            lastSync: '4 hours ago',
            joinDate: '10 Nov 2022'
        },
        {
            id: 'r4',
            name: 'Suresh Raina',
            phone: '+91 99887 76655',
            email: 'suresh.r@example.com',
            status: 'available',
            vehicle: 'Electric Cycle',
            vehicleNum: 'N/A',
            rating: 4.2,
            totalOrders: 120,
            todayEarnings: 450,
            location: 'Juhu, Mumbai',
            lastSync: '15 mins ago',
            joinDate: '20 Dec 2023'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRider, setSelectedRider] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
    const [viewingRider, setViewingRider] = useState(null);

    // Form states
    const [formState, setFormState] = useState({
        name: '', phone: '', email: '', vehicle: '', vehicleNum: '', location: ''
    });

    // Filtering logic
    const filteredRiders = useMemo(() => {
        return riders.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.phone.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [riders, searchTerm, statusFilter]);

    const handleAction = (type, rider) => {
        if (type === 'view') {
            setViewingRider(rider);
        } else if (type === 'edit') {
            setFormState(rider);
            setSelectedRider(rider);
            setIsEditModalOpen(true);
        } else if (type === 'delete') {
            if (window.confirm(`Are you sure you want to deactivate ${rider.name}?`)) {
                setRiders(riders.filter(r => r.id !== rider.id));
            }
        }
    };

    const handleOnboardSubmit = (e) => {
        e.preventDefault();
        const newRider = {
            ...formState,
            id: 'r' + (riders.length + 1),
            status: 'offline',
            rating: 5.0,
            totalOrders: 0,
            todayEarnings: 0,
            lastSync: 'Just now',
            joinDate: new Date().toLocaleDateString()
        };
        setRiders([newRider, ...riders]);
        setIsOnboardModalOpen(false);
        setFormState({ name: '', phone: '', email: '', vehicle: '', vehicleNum: '', location: '' });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setRiders(riders.map(r => r.id === selectedRider.id ? { ...r, ...formState } : r));
        setIsEditModalOpen(false);
        setSelectedRider(null);
    };

    const stats = [
        { label: 'Total Riders', value: riders.length, color: 'indigo' },
        { label: 'Available', value: riders.filter(r => r.status === 'available').length, color: 'emerald' },
        { label: 'Busy (On Task)', value: riders.filter(r => r.status === 'busy').length, color: 'amber' },
        { label: 'Top Earners', value: riders.filter(r => r.rating >= 4.5).length, color: 'rose' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Active Fleet
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time management of your delivery logistics partner.</p>
                </div>
                <button
                    onClick={() => setIsOnboardModalOpen(true)}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-200 active:scale-95"
                >
                    <HiOutlinePlus className="h-4 w-4" />
                    <span>ONBOARD NEW RIDER</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-6 border-none shadow-xl ring-1 ring-slate-100 hover:ring-primary/20 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl bg-opacity-10",
                                stat.color === 'indigo' ? "bg-indigo-500 text-indigo-600" :
                                    stat.color === 'emerald' ? "bg-emerald-500 text-emerald-600" :
                                        stat.color === 'amber' ? "bg-amber-500 text-amber-600" :
                                            "bg-rose-500 text-rose-600"
                            )}>
                                <HiOutlineTruck className="h-5 w-5" />
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    </Card>
                ))}
            </div>

            {/* Filters & Search Section */}
            <Card className="p-4 border-none shadow-sm ring-1 ring-slate-100 bg-white/50 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify rider by name or contact number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 border-none rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100/50 p-1 rounded-2xl flex items-center">
                            {['all', 'available', 'busy', 'offline'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                        statusFilter === status
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button className="p-3.5 bg-white ring-1 ring-slate-200 rounded-2xl text-slate-600 hover:text-primary hover:ring-primary/30 transition-all shadow-sm">
                            <HiOutlineFunnel className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Riders Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredRiders.map((rider) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={rider.id}
                        >
                            <Card className="group border-none shadow-xl ring-1 ring-slate-100 hover:ring-primary/20 transition-all overflow-hidden bg-white">
                                <div className="p-6 space-y-5">
                                    {/* Rider Top Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <div className="h-14 w-14 rounded-[22px] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                                                    <HiOutlineUserCircle className="h-8 w-8" />
                                                </div>
                                                <div className={cn(
                                                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm",
                                                    rider.status === 'available' ? 'bg-emerald-500' :
                                                        rider.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                                                )} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{rider.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                                    <HiOutlinePhone className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">{rider.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">
                                            <HiOutlineStar className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-black">{rider.rating}</span>
                                        </div>
                                    </div>

                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Today Earnings</p>
                                            <div className="flex items-center gap-1.5">
                                                <HiOutlineCurrencyDollar className="h-3.5 w-3.5 text-emerald-500" />
                                                <span className="text-xs font-black text-slate-900">₹{rider.todayEarnings}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Success</p>
                                            <div className="flex items-center gap-1.5">
                                                <HiOutlineCheckBadge className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-xs font-black text-slate-900">{rider.totalOrders} Deliv.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location & Vehicle */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0" />
                                            <span className="text-[10px] font-semibold truncate">{rider.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <HiOutlineTruck className="h-3.5 w-3.5 shrink-0" />
                                            <span className="text-[10px] font-semibold truncate">{rider.vehicle} • <span className="text-slate-900 font-bold">{rider.vehicleNum}</span></span>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-2 flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction('view', rider)}
                                            className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <HiOutlineEye className="h-3.5 w-3.5" />
                                            VIEW PROFILE
                                        </button>
                                        <button
                                            onClick={() => handleAction('edit', rider)}
                                            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                        >
                                            <HiOutlinePencilSquare className="h-4.5 w-4.5" />
                                        </button>
                                        <button
                                            onClick={() => handleAction('delete', rider)}
                                            className="p-2.5 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                        >
                                            <HiOutlineTrash className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Profile Detail Modal */}
            <AnimatePresence>
                {viewingRider && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setViewingRider(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl relative z-10 bg-white rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex gap-6">
                                        <div className="h-24 w-24 rounded-[32px] bg-slate-100 flex items-center justify-center text-slate-400">
                                            <HiOutlineUserCircle className="h-14 w-14" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">{viewingRider.name}</h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant={viewingRider.status === 'available' ? 'success' : viewingRider.status === 'busy' ? 'warning' : 'neutral'} className="uppercase font-black text-[9px] px-3">
                                                    {viewingRider.status}
                                                </Badge>
                                                <span className="text-xs font-bold text-slate-400">Rider ID: RD-00{viewingRider.id.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewingRider(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                                        <HiOutlineXCircle className="h-6 w-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Partner Since</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.joinDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Assigned</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.vehicle}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration No.</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.vehicleNum}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Synced Area</p>
                                        <p className="text-sm font-bold text-slate-900">{viewingRider.location}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-[32px]">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Lifetime Rating</p>
                                        <div className="flex justify-center items-center gap-1">
                                            <HiOutlineStar className="h-4 w-4 text-amber-500 fill-current" />
                                            <span className="text-lg font-black text-slate-900">{viewingRider.rating}</span>
                                        </div>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Fleet Rank</p>
                                        <span className="text-lg font-black text-slate-900">#42</span>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Deliveries</p>
                                        <span className="text-lg font-black text-slate-900 text-indigo-600">{viewingRider.totalOrders}</span>
                                    </div>
                                    <div className="text-center border-l border-slate-200">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Wallet Creds</p>
                                        <span className="text-lg font-black text-slate-900 text-emerald-600">₹4,250</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                        Send Notification
                                    </button>
                                    <button className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95">
                                        DEACTIVATE ACCESS
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Onboard / Edit Modal */}
            <AnimatePresence>
                {(isOnboardModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
                            onClick={() => {
                                setIsOnboardModalOpen(false);
                                setIsEditModalOpen(false);
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-lg relative z-[120] bg-white rounded-[40px] p-10 shadow-3xl"
                        >
                            <h3 className="text-2xl font-black text-slate-900 mb-2">
                                {isEditModalOpen ? 'Edit Rider Profile' : 'Onboard Fleet Partner'}
                            </h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">
                                {isEditModalOpen ? 'Update credentials and identity.' : 'Securely register a new delivery logistics expert.'}
                            </p>

                            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleOnboardSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="e.g. Rahul Sharma"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact</label>
                                            <input
                                                required
                                                type="text"
                                                value={formState.phone}
                                                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                                placeholder="+91..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Vehicle</label>
                                            <select
                                                required
                                                value={formState.vehicle}
                                                onChange={(e) => setFormState({ ...formState, vehicle: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                            >
                                                <option value="">Select Vehicle</option>
                                                <option>Two Wheeler</option>
                                                <option>Electric Scooter</option>
                                                <option>Cycle</option>
                                                <option>Three Wheeler</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Vehicle No.</label>
                                        <input
                                            required
                                            type="text"
                                            value={formState.vehicleNum}
                                            onChange={(e) => setFormState({ ...formState, vehicleNum: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="e.g. MH-12-AB-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Operational Area</label>
                                        <input
                                            required
                                            type="text"
                                            value={formState.location}
                                            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="e.g. Bandra West, Mumbai"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all transform active:scale-[0.98] mt-4">
                                    {isEditModalOpen ? 'UPDATE RIDER DATABASE' : 'FINALIZE RIDER ONBOARDING'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActiveDeliveryBoys;
