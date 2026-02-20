import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/context/AuthContext';
import { UserRole } from '@core/constants/roles';
import {
    Mail,
    Lock,
    User,
    ShieldCheck,
    ArrowRight,
    Navigation,
    Phone,
    MapPin,
    Zap,
    ChevronRight,
    Bike
} from 'lucide-react';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import deliveryAnimation from '../../../assets/Delivery Riding.json';

const DeliveryAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            login({
                id: 'delivery-1',
                name: isLogin ? 'Partner' : formData.name,
                role: UserRole.DELIVERY,
                token: 'demo-token'
            });
            setIsLoading(false);
            toast.success(isLogin ? 'Successfully Logged In' : 'Welcome to the Team!');
            navigate('/delivery');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-['Outfit',_sans-serif] overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-50 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[1100px] grid md:grid-cols-2 bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white overflow-hidden"
            >
                {/* Right Panel: Animation (Visible on desktop) */}
                <div className="hidden md:flex flex-col items-center justify-center bg-[#f0fdf4] relative p-12 overflow-hidden order-last">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="relative z-10 w-full max-w-[400px]"
                    >
                        <Lottie
                            animationData={deliveryAnimation}
                            loop={true}
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-12 left-12 right-12 grid grid-cols-2 gap-4">
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-[28px] shadow-sm flex items-center gap-3 border border-white/50">
                            <Zap className="text-emerald-500" size={18} />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fast Track</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-[28px] shadow-sm flex items-center gap-3 border border-white/50">
                            <ShieldCheck className="text-blue-500" size={18} />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Insured</span>
                        </div>
                    </div>
                </div>

                {/* Left Panel: Auth Form */}
                <div className="p-10 md:p-20 flex flex-col justify-center bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mb-2">
                                    <Bike className="text-emerald-600" size={14} />
                                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Appzeto Fleet</span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                    Delivery <br />
                                    <span className="text-emerald-500">{isLogin ? 'Partner' : 'Member'}</span>
                                </h1>
                                <p className="text-slate-400 font-medium text-base">
                                    {isLogin ? 'Welcome back to your workspace.' : 'Register as a delivery partner.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && (
                                    <div className="group relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Full Name"
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-14 py-5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-300"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                <div className="group relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Username or email"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-14 py-5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-300"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="group relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Access code"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-14 py-5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-300"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 text-white py-6 rounded-[24px] text-sm font-black tracking-[4px] shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? 'WORKING...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="pt-8 border-t border-slate-50 text-center">
                                <p className="text-slate-400 font-bold text-sm tracking-tight text-center">
                                    {isLogin ? "New to the fleet?" : "Already a partner?"}{' '}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                    >
                                        {isLogin ? 'Setup Account' : 'Back to Login'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Verification label */}
            <div className="absolute bottom-10 text-slate-300 font-bold text-[10px] tracking-[6px] uppercase">
                Official Appzeto Partner Portal
            </div>
        </div>
    );
};

export default DeliveryAuth;
