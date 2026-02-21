import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/context/AuthContext';
import { UserRole } from '@core/constants/roles';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Phone,
    ChevronRight,
    ShoppingBag,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import backgroundVideo from '../../../assets/video.mp4';

import { customerApi } from '../services/customerApi';

const CustomerAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startTimer = () => {
        setTimer(30);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (formData.phone.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        setIsLoading(true);
        try {
            if (isLogin) {
                await customerApi.login({ phone: formData.phone });
            } else {
                await customerApi.signup({ name: formData.name, phone: formData.phone });
            }
            setShowOtp(true);
            startTimer();
            toast.success('OTP sent successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (formData.otp.length !== 4) {
            toast.error('Please enter a valid 4-digit OTP');
            return;
        }
        setIsLoading(true);
        try {
            const response = await customerApi.verifyOtp({ phone: formData.phone, otp: formData.otp });
            const { token, customer } = response.data.result;

            login({
                ...customer,
                token,
                role: 'customer'
            });

            toast.success('Authentication Successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center font-['Outfit',_sans-serif] overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Mobile Optimized Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-[92%] max-w-[420px]"
            >
                {/* Logo / Brand Header */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl mb-4"
                    >
                        <ShoppingBag className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tighter filter drop-shadow-lg">
                        APPZETO
                    </h1>
                    <p className="text-white/70 font-medium text-sm mt-1 tracking-wide uppercase">
                        Quick Commerce Reimagined
                    </p>
                </div>

                {/* Glassmorphic Form Card */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={showOtp ? 'otp' : 'form'}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-black text-white">
                                    {showOtp ? 'Verify OTP' : (isLogin ? 'Welcome Back!' : 'Join the Fleet')}
                                </h2>
                                <p className="text-white/60 text-xs font-medium">
                                    {showOtp
                                        ? `Enter the 4-digit code sent to ${formData.phone}`
                                        : (isLogin ? 'Login using your mobile number' : 'Create an account to start shopping')}
                                </p>
                            </div>

                            <form onSubmit={showOtp ? handleVerifyOtp : handleSendOtp} className="space-y-4 pt-2">
                                {!showOtp ? (
                                    <>
                                        {!isLogin && (
                                            <div className="group relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    placeholder="Full Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-white/30"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}
                                        <div className="group relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white/60 font-bold text-sm">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                maxLength={10}
                                                placeholder="Mobile Number"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-20 pr-5 py-4 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-white/30"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, phone: val });
                                                }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="group relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="otp"
                                            required
                                            maxLength={4}
                                            placeholder="Enter 4-digit OTP"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-center text-lg font-black tracking-[15px] text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-white/30 placeholder:tracking-normal placeholder:text-sm"
                                            value={formData.otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setFormData({ ...formData, otp: val });
                                            }}
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-4 rounded-2xl text-sm font-black tracking-[4px] shadow-xl shadow-black/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isLoading ? 'PROCESSING...' : (showOtp ? 'VERIFY & PROCEED' : 'SEND OTP')}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="pt-4 border-t border-white/10 text-center">
                                {showOtp ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-white/40 font-bold text-[11px] tracking-tight">
                                            DIDN'T RECEIVE THE CODE?
                                        </p>
                                        <button
                                            onClick={() => timer === 0 && handleSendOtp({ preventDefault: () => { } })}
                                            className={`${timer === 0 ? 'text-white hover:text-emerald-400' : 'text-white/20 pointer-events-none'} transition-colors uppercase font-black text-xs`}
                                        >
                                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend Now'}
                                        </button>
                                        <button
                                            onClick={() => setShowOtp(false)}
                                            className="text-white/40 hover:text-white text-[10px] font-bold mt-2"
                                        >
                                            Change Mobile Number
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-white/40 font-bold text-[11px] tracking-tight">
                                        {isLogin ? "NEW TO APPZETO?" : "ALREADY A MEMBER?"}{' '}
                                        <button
                                            onClick={() => setIsLogin(!isLogin)}
                                            className="text-white hover:text-emerald-400 transition-colors uppercase ml-1 font-black"
                                        >
                                            {isLogin ? 'Create Account' : 'Login Now'}
                                        </button>
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Badges */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-1.5 opacity-50">
                        <ShieldCheck className="text-white" size={14} />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Safe & Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-50">
                        <Sparkles className="text-emerald-400" size={14} />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Fast Delivery</span>
                    </div>
                </div>
            </motion.div>

            {/* Floating verification badge for extra trust */}
            <div className="absolute bottom-6 text-white/20 font-bold text-[10px] tracking-[6px] uppercase px-4 text-center">
                Official Appzeto Consumer Portal • 2026
            </div>
        </div>
    );
};

export default CustomerAuth;
