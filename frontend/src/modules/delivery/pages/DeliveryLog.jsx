import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineTruck,
    HiOutlineMapPin,
    HiOutlineBuildingStorefront,
    HiOutlineUser,
    HiOutlineCalendarDays,
    HiOutlineArrowLongRight,
    HiOutlinePhone,
    HiOutlineCurrencyRupee
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';

// Mock Data for Delivery Partner Log
const MOCK_LOGS = [
    {
        id: 'ORD-2023-901',
        date: '20 Oct 2023',
        time: '11:30 AM',
        status: 'Delivered',
        earnings: 45.00,
        seller: {
            name: 'Fresh Mart Supermarket',
            address: 'Sector 42, Gurgaon, HR',
            phone: '+91 99887 76655'
        },
        customer: {
            name: 'Amit Sharma',
            address: 'H-204, Rosewood Apt, Gurgaon',
            phone: '+91 88776 65544'
        },
        items: 4
    },
    {
        id: 'ORD-2023-902',
        date: '20 Oct 2023',
        time: '01:15 PM',
        status: 'Processing',
        earnings: 38.50,
        seller: {
            name: 'The Organic Store',
            address: 'DLF Phase 3, Gurgaon, HR',
            phone: '+91 77665 54433'
        },
        customer: {
            name: 'Priya Verma',
            address: 'Villa 12, Heritage City, Gurgaon',
            phone: '+91 66554 43322'
        },
        items: 2
    },
    {
        id: 'ORD-2023-895',
        date: '19 Oct 2023',
        time: '04:45 PM',
        status: 'Delivered',
        earnings: 52.00,
        seller: {
            name: 'Daily Needs Grocery',
            address: 'Sushant Lok 1, Gurgaon, HR',
            phone: '+91 55443 32211'
        },
        customer: {
            name: 'Rahul Kapoor',
            address: 'Flat 901, Skyview Manor, Gurgaon',
            phone: '+91 44332 21100'
        },
        items: 7
    }
];

const DeliveryLog = () => {
    const [logs] = useState(MOCK_LOGS);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Delivered', 'Active'];

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === 'Delivered') return matchesSearch && log.status === 'Delivered';
            if (activeTab === 'Active') return matchesSearch && log.status !== 'Delivered';
            return matchesSearch;
        });
    }, [logs, searchTerm, activeTab]);

    const stats = useMemo(() => [
        {
            label: 'Total Deliveries',
            value: logs.length,
            icon: HiOutlineTruck,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            label: 'Total Earnings',
            value: `₹${logs.reduce((acc, curr) => acc + curr.earnings, 0).toFixed(0)}`,
            icon: HiOutlineCurrencyRupee,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Avg per Trip',
            value: `₹${(logs.reduce((acc, curr) => acc + curr.earnings, 0) / logs.length).toFixed(0)}`,
            icon: HiOutlineCalendarDays,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        }
    ], [logs]);

    return (
        <div className="space-y-6 pb-16">
            <BlurFade delay={0.1}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Delivery Tracking
                            <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase bg-blue-100 text-blue-700">Earnings Log</Badge>
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-medium">Track your pickup points and delivery destinations.</p>
                    </div>
                </div>
            </BlurFade>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <BlurFade key={i} delay={0.1 + (i * 0.05)}>
                        <MagicCard className="border-none shadow-sm ring-1 ring-slate-100 p-0 overflow-hidden group bg-white">
                            <div className="flex items-center gap-4 p-5 relative z-10">
                                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm", stat.bg, stat.color)}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">{stat.value}</h4>
                                </div>
                            </div>
                        </MagicCard>
                    </BlurFade>
                ))}
            </div>

            <BlurFade delay={0.3}>
                <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden rounded-[2.5rem] bg-white">
                    {/* Filter Bar */}
                    <div className="border-b border-slate-100 bg-slate-50/30 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <div className="relative group">
                                <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-all" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, Seller or Customer..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full lg:w-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex-1 lg:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === tab
                                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200/50"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Log Items */}
                    <div className="p-6 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredLogs.map((log, idx) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative bg-white rounded-[2rem] border border-slate-100 p-0 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden group"
                                >
                                    {/* Header Row */}
                                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                                                ID
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">#{log.id}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date} • {log.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Your Share</p>
                                                <p className="text-base font-black text-emerald-600 leading-none mt-1">₹{log.earnings.toFixed(2)}</p>
                                            </div>
                                            <Badge variant={log.status === 'Delivered' ? 'success' : 'warning'} className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                                {log.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Route Content */}
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                                        {/* Seller (Pickup) */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                                    <HiOutlineBuildingStorefront className="h-4.5 w-4.5" />
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pickup Link</span>
                                            </div>
                                            <div className="pl-1">
                                                <h5 className="text-sm font-black text-slate-900">{log.seller.name}</h5>
                                                <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed flex items-start gap-1.5">
                                                    <HiOutlineMapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-300" />
                                                    {log.seller.address}
                                                </p>
                                                <div className="mt-3">
                                                    <a href={`tel:${log.seller.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-[10px] font-black transition-all border border-transparent hover:border-indigo-100">
                                                        <HiOutlinePhone className="h-3.5 w-3.5" />
                                                        {log.seller.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow Separator */}
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                                                <HiOutlineArrowLongRight className="h-6 w-6" />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2 group-hover:text-primary transition-colors">{log.items} Items</span>
                                        </div>

                                        {/* Customer (Drop-off) */}
                                        <div className="space-y-3 md:text-right">
                                            <div className="flex items-center md:flex-row-reverse gap-2">
                                                <div className="h-8 w-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center shadow-sm">
                                                    <HiOutlineUser className="h-4.5 w-4.5" />
                                                </div>
                                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Drop Location</span>
                                            </div>
                                            <div className="pr-1">
                                                <h5 className="text-sm font-black text-slate-900">{log.customer.name}</h5>
                                                <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed flex items-start md:flex-row-reverse gap-1.5">
                                                    <HiOutlineMapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-300" />
                                                    {log.customer.address}
                                                </p>
                                                <div className="mt-3 flex md:justify-end">
                                                    <a href={`tel:${log.customer.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-[10px] font-black transition-all border border-transparent hover:border-rose-100">
                                                        <HiOutlinePhone className="h-3.5 w-3.5" />
                                                        {log.customer.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredLogs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                                    <HiOutlineTruck className="h-10 w-10 text-slate-200" />
                                </div>
                                <h3 className="text-base font-black text-slate-900">No delivery logs found</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Adjust search or filters</p>
                            </div>
                        )}
                    </div>
                </Card>
            </BlurFade>
        </div>
    );
};

export default DeliveryLog;
