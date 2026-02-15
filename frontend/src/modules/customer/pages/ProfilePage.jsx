import React from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import { User, MapPin, Package, CreditCard, Settings, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
    const sections = [
        { label: 'My Orders', icon: Package, count: '12 active' },
        { label: 'Saved Addresses', icon: MapPin, count: '3 locations' },
        { label: 'Payment Methods', icon: CreditCard, count: 'Axis Bank ...' },
        { label: 'Privacy Settings', icon: ShieldCheck },
        { label: 'General Settings', icon: Settings },
    ];

    return (
        <CustomerLayout>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-36 md:mt-24">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left: User Overview */}
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl relative overflow-hidden text-center sticky top-28">
                            {/* Profile BG Decoration */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#0c831f] to-[#4caf50]" />

                            <div className="relative pt-8">
                                <div className="h-28 w-28 rounded-full bg-white p-2 mx-auto relative z-10 shadow-lg border-2 border-slate-50">
                                    <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center">
                                        <User size={48} className="text-[#0c831f]" />
                                    </div>
                                </div>
                                <h2 className="mt-6 text-2xl font-black text-slate-800">John Doe</h2>
                                <p className="text-slate-500 font-medium">+91-9876543210</p>
                                <span className="mt-3 inline-block px-4 py-1.5 bg-green-50 text-[#0c831f] text-xs font-bold rounded-full border border-green-100 uppercase tracking-wider">
                                    Verified User
                                </span>
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Loyalty Points</p>
                                    <p className="text-xl font-black text-[#0c831f]">2,450</p>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
                                    <p className="text-xl font-black text-[#0c831f]">₹4,200</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Menu Sections */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-3xl font-black text-slate-800 mb-2 md:hidden">My Profile</h1>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl p-2 px-4 md:p-6 md:px-8">
                            {sections.map((section, idx) => (
                                <div
                                    key={section.label}
                                    className={`flex items-center justify-between py-5 cursor-pointer group hover:bg-slate-50 px-4 rounded-2xl transition-all duration-300 ${idx !== sections.length - 1 ? 'border-b border-slate-100 md:border-none' : ''}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-[#0c831f] group-hover:text-white transition-all">
                                            <section.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{section.label}</h3>
                                            {section.count && <p className="text-slate-400 text-xs font-medium">{section.count}</p>}
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-[#0c831f] group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>

                        <button className="w-full h-16 bg-red-50 hover:bg-red-100 text-red-600 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all group scale-100 active:scale-95">
                            <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                            Log Out from all devices
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ProfilePage;
