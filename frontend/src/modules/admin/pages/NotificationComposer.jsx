import React, { useState } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import { useToast } from '@shared/components/ui/Toast';
import {
    HiOutlinePaperAirplane,
    HiOutlineBars3BottomLeft,
    HiOutlineLink,
    HiOutlineUsers,
    HiOutlineMapPin,
    HiOutlineClock,
    HiOutlinePhoto,
    HiOutlineDevicePhoneMobile,
    HiOutlineSparkles,
    HiOutlineBolt,
    HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NotificationComposer = () => {
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('all');
    const [location, setLocation] = useState('all');
    const [lastOrder, setLastOrder] = useState('any');

    const segments = [
        { id: 'all', label: 'All Users', count: '12,504' },
        { id: 'lapsed', label: 'Lapsed Customers', count: '3,210', hint: 'No order in 30 days' },
        { id: 'power', label: 'Power Users', count: '850', hint: '10+ orders monthly' },
        { id: 'new', label: 'Recent Signups', count: '1,420', hint: 'Last 7 days' },
    ];

    const handleSend = () => {
        if (!title || !message) {
            showToast('Please complete the notification broadcast fields', 'warning');
            return;
        }
        showToast(`Broadcasting to ${segments.find(s => s.id === selectedSegment)?.count} users...`, 'info');
        setTimeout(() => {
            showToast('Campaign launched successfully!', 'success');
            setTitle('');
            setMessage('');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="admin-h1 flex items-center gap-3">
                        Growth Signal
                        <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black uppercase tracking-widest">Push Engine</div>
                    </h1>
                    <p className="admin-description mt-1">Compose and blast targeted notifications to drive conversion retention.</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-5 py-3 rounded-2xl">
                    Remaining Quota: <span className="text-slate-900 ml-1">45,000 / 50k</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Composer Section */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-8 border-none shadow-xl ring-1 ring-slate-100 bg-white rounded-[40px]">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <HiOutlinePaperAirplane className="h-5 w-5 -rotate-45" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Campaign Composer</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notification Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="E.g. Hot Deals are back! 🔥"
                                        className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Message</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter your push notification body text..."
                                        className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all placeholder:text-slate-300 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dynamic Link (Deep Link)</label>
                                        <div className="relative">
                                            <HiOutlineLink className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl text-xs font-bold border-none outline-none" placeholder="/deals/category" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Asset (Optional)</label>
                                        <div className="relative">
                                            <HiOutlinePhoto className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl text-xs font-bold border-none outline-none" placeholder="Paste URL..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSend}
                                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <HiOutlineBolt className="h-5 w-5 text-amber-400 fill-amber-400" />
                                BLAST SIGNAL
                            </button>
                        </div>
                    </Card>

                </div>

                {/* Audience & Preview Column */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Real-time Preview */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] px-2">Protocol Preview</h3>
                        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden ring-8 ring-slate-100">
                            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />

                            <div className="relative space-y-6">
                                <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                                    <span>Signal Preview</span>
                                    <span>Locked</span>
                                </div>

                                {/* iOS Style Notification */}
                                <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/5 shadow-2xl space-y-2 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 bg-primary rounded-lg flex items-center justify-center">
                                                <HiOutlineDevicePhoneMobile className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">APPZETO</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-white/40 uppercase">Just Now</span>
                                    </div>
                                    <h4 className="text-xs font-black text-white truncate">{title || 'Awaiting Signal Title...'}</h4>
                                    <p className="text-[11px] font-medium text-white/60 leading-relaxed">
                                        {message || 'Type your message to see it reflect here in real-time...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Segments Selection */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] px-2">Audience Segmentation</h3>
                        <div className="space-y-3">
                            {segments.map((seg) => (
                                <button
                                    key={seg.id}
                                    onClick={() => setSelectedSegment(seg.id)}
                                    className={cn(
                                        "w-full p-6 rounded-[2rem] text-left transition-all relative overflow-hidden group",
                                        selectedSegment === seg.id
                                            ? "bg-slate-900 text-white shadow-2xl -translate-y-1"
                                            : "bg-white text-slate-700 ring-1 ring-slate-100 hover:ring-primary/20"
                                    )}
                                >
                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <h4 className="text-sm font-black mb-1">{seg.label}</h4>
                                            <p className={cn("text-[10px] font-bold uppercase tracking-tight", selectedSegment === seg.id ? "text-white/40" : "text-slate-400")}>
                                                {seg.hint || 'Universal Reach'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-lg font-black block leading-none", selectedSegment === seg.id ? "text-primary-light" : "text-slate-900")}>
                                                {seg.count}
                                            </span>
                                            <span className="text-[8px] font-black opacity-30 uppercase tracking-widest">Active Devices</span>
                                        </div>
                                    </div>
                                    {selectedSegment === seg.id && (
                                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-primary/20 to-transparent" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationComposer;
