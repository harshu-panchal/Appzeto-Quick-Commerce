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

import { deliveryApi } from '../services/deliveryApi';

const DeliveryAuth = () => {
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
                await deliveryApi.login({ phone: formData.phone });
            } else {
                await deliveryApi.signup({ name: formData.name, phone: formData.phone });
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
            const response = await deliveryApi.verifyOtp({ phone: formData.phone, otp: formData.otp });
            const { token, delivery } = response.data.result;

            login({
                ...delivery,
                token
            });

            toast.success('Successfully Verified');
            navigate('/delivery');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6 font-['Outfit',_sans-serif] overflow-y-auto relative">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-50 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[460px] bg-white rounded-[32px] md:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.04)] border border-white overflow-hidden my-4"
            >
                {/* Animation Section */}
                <div className="bg-[#f0fdf4] relative py-4 md:py-6 px-6 overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="relative z-10 w-full max-w-[200px] md:max-w-[220px]"
                    >
                        <Lottie
                            animationData={deliveryAnimation}
                            loop={true}
                            className="w-full h-auto drop-shadow-lg"
                        />
                    </motion.div>
                </div>

                {/* Form Section */}
                <div className="p-5 md:p-8 bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={showOtp ? 'otp' : 'form'}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    <Bike className="text-emerald-600" size={10} />
                                    <span className="text-[8px] font-black text-emerald-900 uppercase tracking-widest">Fleet Partner</span>
                                </div>
                                <h1 className="text-xl font-black text-slate-900 tracking-tighter">
                                    {showOtp ? 'Verify OTP' : (isLogin ? 'Welcome Back!' : 'Join the Fleet')}
                                </h1>
                                <p className="text-slate-400 font-medium text-[10px]">
                                    {showOtp ? `Enter OTP sent to ${formData.phone}` : 'Access your delivery dashboard via mobile.'}
                                </p>
                            </div>

                            <form onSubmit={showOtp ? handleVerifyOtp : handleSendOtp} className="space-y-2.5">
                                {!showOtp ? (
                                    <>
                                        {!isLogin && (
                                            <div className="group relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    placeholder="Full Name"
                                                    className="w-full bg-slate-50 border-2 border-transparent rounded-[16px] px-14 py-3.5 text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-400"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}
                                        <div className="group relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                maxLength={10}
                                                placeholder="Mobile Number"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[16px] pl-20 pr-5 py-3.5 text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-400"
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
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="otp"
                                            required
                                            maxLength={4}
                                            placeholder="XXXX"
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[16px] px-14 py-3.5 text-center text-xl font-black tracking-[20px] text-slate-800 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-400 placeholder:tracking-normal placeholder:text-sm"
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
                                    className="w-full bg-slate-900 text-white py-4 rounded-[16px] text-base md:text-lg font-black tracking-[3px] shadow-lg shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-1"
                                >
                                    {isLoading ? 'PROCESSING...' : (showOtp ? 'VERIFY' : 'SEND OTP')}
                                    <ArrowRight size={20} />
                                </button>
                            </form>

                            <div className="pt-3 border-t border-slate-50 text-center">
                                {showOtp ? (
                                    <div className="flex flex-col items-center gap-1.5">
                                        <button
                                            onClick={() => timer === 0 && handleSendOtp({ preventDefault: () => { } })}
                                            className={`${timer === 0 ? 'text-emerald-600' : 'text-slate-300 pointer-events-none'} transition-colors uppercase font-black text-[10px] tracking-widest`}
                                        >
                                            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                        </button>
                                        <button
                                            onClick={() => setShowOtp(false)}
                                            className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                                        >
                                            Edit Number
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 font-bold text-xs tracking-tight">
                                        {isLogin ? "New here?" : "Already a partner?"}{' '}
                                        <button
                                            onClick={() => setIsLogin(!isLogin)}
                                            className="text-emerald-600 hover:text-emerald-800 transition-colors font-black uppercase ml-1"
                                        >
                                            {isLogin ? 'Create Account' : 'Login Now'}
                                        </button>
                                    </p>
                                )}
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
