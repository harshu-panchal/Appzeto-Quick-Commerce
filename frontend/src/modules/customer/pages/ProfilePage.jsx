import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import {
    User, MapPin, Package, CreditCard, Settings, ChevronRight,
    LogOut, ShieldCheck, Heart, Gift, HelpCircle, Info, Edit2, Wallet
} from 'lucide-react';
import { useAuth } from '@core/context/AuthContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();

    return (
        <CustomerLayout showHeader={false}>
            <div className="min-h-screen bg-slate-50 pb-24 md:pb-8 font-sans">
                {/* Custom Hero Header Area */}
                <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-10 pb-20 relative z-10 rounded-b-[2.5rem] shadow-lg overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                    <h1 className="text-3xl font-black text-white tracking-tight relative z-10">My Profile</h1>
                    <p className="text-green-50 text-sm font-medium mt-1 relative z-10">Manage your account & preferences</p>
                </div>

                <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20 space-y-6">

                    {/* User Identity Card */}
                    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center p-1 border border-indigo-100">
                                <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                    <User size={30} className="text-indigo-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">{user?.name || 'Customer'}</h2>
                                <p className="text-slate-500 text-sm font-medium">+91 {user?.phone}</p>
                            </div>
                        </div>
                        <Link to="/profile/edit" className="p-3 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                            <Edit2 size={18} />
                        </Link>
                    </div>

                    {/* Menu Sections */}
                    <div className="space-y-4">
                        {/* Account Section */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Settings</p>
                            </div>
                            <div className="divide-y divide-slate-50">
                                <MenuItem icon={Package} label="Your Orders" sub="Track, return or buy things again" path="/orders" color="text-blue-600" bg="bg-blue-50" />
                                <MenuItem icon={Heart} label="Your Wishlist" sub="Your saved items" path="/wishlist" color="text-red-500" bg="bg-red-50" />
                                <MenuItem icon={MapPin} label="Saved Addresses" sub="Manage your delivery locations" path="/addresses" color="text-orange-600" bg="bg-orange-50" />
                                <MenuItem icon={Wallet} label="Payment Methods" sub="Manage cards, UPI and wallets" path="/wallet" color="text-purple-600" bg="bg-purple-50" />
                            </div>
                        </div>

                        {/* Support Section */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support & Legal</p>
                            </div>
                            <div className="divide-y divide-slate-50">
                                <MenuItem icon={HelpCircle} label="Help & Support" path="/support" color="text-cyan-600" bg="bg-cyan-50" />
                                <MenuItem icon={ShieldCheck} label="Privacy Policy" path="/privacy" color="text-green-600" bg="bg-green-50" />
                                <MenuItem icon={Info} label="About Us" path="/about" color="text-indigo-600" bg="bg-indigo-50" />
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="w-full py-4 rounded-xl border border-red-100 text-red-600 font-bold bg-white hover:bg-red-50 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>

                    <div className="text-center pb-8">
                        <p className="text-xs text-slate-400 font-medium">App Version 2.4.0</p>
                    </div>

                </div>
            </div>
        </CustomerLayout>
    );
};

const MenuItem = ({ icon: Icon, label, sub, path, color, bg }) => (
    <Link to={path || '#'} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${color || 'text-slate-500'} ${bg || 'bg-slate-100'} group-hover:bg-[#0c831f] group-hover:text-white`}>
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-800">{label}</h3>
                {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
            </div>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0c831f] transition-colors" />
    </Link>
);

export default ProfilePage;
