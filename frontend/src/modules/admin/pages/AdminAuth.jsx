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
    LayoutDashboard,
    Fingerprint,
    Command,
    Terminal
} from 'lucide-react';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import backendAnimation from '../../../assets/Backend Icon.json';
import { adminApi } from '../services/adminApi';

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        adminCode: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = isLogin
                ? await adminApi.login({ email: formData.email, password: formData.password })
                : await adminApi.signup({ name: formData.name, email: formData.email, password: formData.password });

            const { token, admin } = response.data.result;

            login({
                ...admin,
                token
            });

            toast.success(isLogin ? 'Welcome back, Administrator.' : 'Administrator Account Created.');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAuth = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f3f6ff] p-6 font-['Outfit',_sans-serif]">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-50 opacity-40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-white opacity-60 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="relative w-full max-w-[1050px] min-h-[650px] bg-white rounded-[50px] shadow-[0_40px_120px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row border border-white"
            >
                {/* Left Side: Form */}
                <div className="w-full md:w-[45%] p-12 md:p-20 flex flex-col justify-center relative z-10 bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 30, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-10"
                        >
                            <div className="space-y-3">
                                <motion.h1
                                    className="text-5xl font-black text-indigo-900 tracking-tight"
                                    layoutId="auth-title"
                                >
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </motion.h1>
                                <p className="text-gray-400 font-medium text-base">
                                    {isLogin
                                        ? 'Welcome to Appzeto Admin Platform'
                                        : 'Start managing your platform today'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AnimatePresence mode="popLayout">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, y: -10 }}
                                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                                            exit={{ height: 0, opacity: 0, y: -10 }}
                                            className="group relative"
                                        >
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                className="w-full pl-14 pr-5 py-5 bg-[#f8f9ff] border-2 border-transparent rounded-[24px] text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-50/50 transition-all placeholder:text-gray-300"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Username or email"
                                        className="w-full pl-14 pr-5 py-5 bg-[#f8f9ff] border-2 border-transparent rounded-[24px] text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-50/50 transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full pl-14 pr-5 py-5 bg-[#f8f9ff] border-2 border-transparent rounded-[24px] text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-50/50 transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                {isLogin && (
                                    <div className="flex justify-end pr-2">
                                        <button type="button" className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 text-white rounded-[24px] py-5 text-base font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <span>{isLogin ? 'Login Now' : 'Create Account'}</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="pt-6 text-center">
                                <p className="text-gray-400 font-bold">
                                    {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
                                    <button
                                        onClick={toggleAuth}
                                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        {isLogin ? 'Register Here' : 'Sign In'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Illustration & Curve */}
                <div className="hidden md:flex w-[55%] relative bg-[#f8f9ff] overflow-hidden items-center justify-center">
                    {/* The Smooth Curve (SVG) */}
                    <div className="absolute inset-y-0 -left-1 w-[200px] z-20">
                        <svg className="h-full w-full fill-white" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 0 0 C 40 0, 100 20, 100 50 C 100 80, 40 100, 0 100 Z"></path>
                        </svg>
                    </div>

                    {/* Lottie Animation Scene */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-20">
                        {/* Glow Effect Backdrop */}
                        <div className="absolute w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1, type: "spring" }}
                            className="w-full max-w-[400px] relative z-10"
                        >
                            <Lottie
                                animationData={backendAnimation}
                                loop={true}
                                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(79,70,229,0.15)]"
                            />
                        </motion.div>

                    </div>

                    {/* Subtle Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,70,229,0.05)_0%,transparent_100%)]"></div>
                </div>
            </motion.div>

            {/* Verification Label */}
            <div className="absolute bottom-8 text-gray-400 font-bold text-[10px] tracking-[5px] uppercase flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gray-200"></div>
                Protected by Appzeto Security
                <div className="w-8 h-[1px] bg-gray-200"></div>
            </div>
        </div>
    );
};

export default AdminAuth;
