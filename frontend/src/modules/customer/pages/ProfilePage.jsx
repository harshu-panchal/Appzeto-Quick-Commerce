import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, MapPin, Package, CreditCard, Settings, ChevronRight,
    LogOut, ShieldCheck, Heart, Gift, HelpCircle, Info, Edit2, ChevronLeft,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '@core/context/AuthContext';
import axiosInstance from '@core/api/axios';
import { useEffect } from 'react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axiosInstance.get('/public/faqs', { params: { category: 'Customer', status: 'published' } });
                const data = response.data?.result ?? response.data;
                const list = Array.isArray(data?.items) ? data.items : Array.isArray(data?.results) ? data.results : [];
                setFaqs(list);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-8 font-sans">
            {/* Custom Hero Header Area */}
            <div className="bg-gradient-to-br from-[#0c831f] to-[#0a6d1a] px-5 pt-8 pb-20 relative z-10 rounded-b-[3rem] shadow-[0_10px_30px_rgba(12,131,31,0.15)] overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight">My Profile</h1>
                </div>
                <p className="text-emerald-50/80 text-sm font-medium mt-1 relative z-10">Manage your account & preferences</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-20 space-y-6">

                {/* User Identity Card */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-[#0c831f]/10 flex items-center justify-center p-1 border border-[#0c831f]/5">
                            <div className="h-full w-full rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                <User size={30} className="text-[#0c831f]" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">{user?.name || 'Customer'}</h2>
                            <p className="text-slate-400 text-sm font-bold flex items-center gap-1 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase">India</span> +91 {user?.phone}
                            </p>
                        </div>
                    </div>
                    <Link to="/profile/edit" className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-[#0c831f] hover:text-white transition-all shadow-sm">
                        <Edit2 size={18} />
                    </Link>
                </div>

                {/* Menu Sections */}
                <div className="space-y-4">
                    {/* Account Section */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white">
                        <div className="px-8 py-5 bg-slate-50/30 border-b border-slate-50/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Personal Account</p>
                        </div>
                        <div className="divide-y divide-slate-50/50">
                            <MenuItem
                                icon={Package}
                                label="Your Orders"
                                sub="Track, return or buy things again"
                                path="/orders"
                                color="#0c831f"
                                bg="rgba(16,185,129,0.10)"
                            />
                            <MenuItem
                                icon={CreditCard}
                                label="Order Transactions"
                                sub="View all payments & refunds"
                                path="/transactions"
                                color="#f97316"
                                bg="rgba(249,115,22,0.10)"
                            />
                            <MenuItem
                                icon={Heart}
                                label="Your Wishlist"
                                sub="Your saved items"
                                path="/wishlist"
                                color="#fb7185"
                                bg="rgba(248,113,113,0.08)"
                            />
                            <MenuItem
                                icon={MapPin}
                                label="Saved Addresses"
                                sub="Manage your delivery locations"
                                path="/addresses"
                                color="#0ea5e9"
                                bg="rgba(56,189,248,0.10)"
                            />
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white">
                        <div className="px-8 py-5 bg-slate-50/30 border-b border-slate-50/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Help & Settings</p>
                        </div>
                        <div className="divide-y divide-slate-50/50">
                            <MenuItem
                                icon={HelpCircle}
                                label="Help & Support"
                                path="/support"
                                color="#3b82f6"
                                bg="rgba(59,130,246,0.08)"
                            />
                            <MenuItem
                                icon={ShieldCheck}
                                label="Privacy Policy"
                                path="/privacy"
                                color="#a855f7"
                                bg="rgba(168,85,247,0.08)"
                            />
                            <MenuItem
                                icon={Info}
                                label="About Us"
                                path="/about"
                                color="#14b8a6"
                                bg="rgba(45,212,191,0.08)"
                            />
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="w-full py-5 rounded-3xl border border-red-50 text-red-500 font-black bg-red-50/30 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
                >
                    <LogOut size={20} />
                    SIGN OUT
                </button>

                <div className="text-center pb-10">
                    <p className="text-[10px] text-slate-300 font-black tracking-widest uppercase">Version 2.4.0 • Appzeto Quick</p>
                </div>

            </div>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, sub, path, color = '#0c831f', bg = 'rgba(16,185,129,0.08)' }) => (
    <Link to={path || '#'} className="px-8 py-5.5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-all group">
        <div className="flex items-center gap-4">
            <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center transition-all shadow-[0_10px_28px_rgba(15,23,42,0.06)] group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.12)]"
                style={{ backgroundColor: bg }}
            >
                <Icon
                    size={22}
                    className="transition-colors"
                    style={{ color }}
                />
            </div>
            <div>
                <h3 className="text-[15px] font-black text-slate-800 tracking-tight">{label}</h3>
                {sub && <p className="text-[11px] text-slate-400 font-bold mt-0.5">{sub}</p>}
            </div>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-[#0c831f]/10 transition-colors">
            <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0c831f] transition-all group-hover:translate-x-0.5" />
        </div>
    </Link>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">{question}</h3>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
            {isOpen && (
                <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">{answer}</p>
            )}
        </div>
    );
};

export default ProfilePage;
