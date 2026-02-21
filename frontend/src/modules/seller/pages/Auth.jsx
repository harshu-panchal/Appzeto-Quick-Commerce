import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/context/AuthContext';
import { UserRole } from '@core/constants/roles';
import {
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    Store,
    ShoppingBag,
    TrendingUp,
    Rocket,
    Globe
} from 'lucide-react';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import sellerAnimation from '../../../assets/INSTANT_6.json';
import { sellerApi } from '../services/sellerApi';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        shopName: '',
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
                ? await sellerApi.login({ email: formData.email, password: formData.password })
                : await sellerApi.signup(formData);

            const { token, seller } = response.data.result;

            login({
                ...seller,
                token
            });

            toast.success(isLogin ? 'Welcome back, Partner!' : 'Account created successfully!');
            navigate('/seller');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfaff] p-6 font-['Outfit'] overflow-hidden relative">
            {/* Elegant Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-violet-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[1200px] min-h-[750px] bg-white rounded-[50px] shadow-[0_50px_120px_rgba(124,58,237,0.06)] border border-white flex flex-col md:flex-row overflow-hidden"
            >
                {/* Visual Side Panel */}
                <div className="hidden md:flex w-1/2 bg-linear-to-br from-violet-600 to-indigo-700 relative flex-col items-center justify-center p-16 overflow-hidden">
                    {/* Abstract Decorative Circles */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 w-full flex flex-col items-center"
                    >
                        {/* Lottie Animation for Seller */}
                        <div className="w-full max-w-[450px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                            <Lottie
                                animationData={sellerAnimation}
                                loop={true}
                                className="w-full h-auto"
                            />
                        </div>

                        <div className="mt-12 text-center space-y-6">
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight uppercase underline decoration-white/20 underline-offset-8">
                                Seller <span className="text-violet-200">Expansion.</span>
                            </h2>
                            <p className="text-white/70 text-lg font-medium max-w-sm mx-auto">
                                Join the network of 5000+ growing businesses across the nation.
                            </p>
                        </div>
                    </motion.div>

                    {/* Partner Badges */}
                    <div className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-2 text-white/80">
                            <Rocket size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Growth First</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <Globe size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pan India</span>
                        </div>
                    </div>
                </div>

                {/* Form Content Side */}
                <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100">
                                    {isLogin ? 'Welcome Back' : 'New Partnership'}
                                </span>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                                    Seller <span className="text-violet-600">{isLogin ? 'Login' : 'Signup'}</span>
                                </h1>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                    {isLogin
                                        ? 'Access your unified seller dashboard and manage orders.'
                                        : 'Register your store and start selling instantly.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Seller Name"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 transition-all placeholder:text-slate-300"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                                <Store size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="shopName"
                                                required
                                                placeholder="Store Name"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 transition-all placeholder:text-slate-300"
                                                value={formData.shopName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Business Email"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 transition-all placeholder:text-slate-300"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                {!isLogin && (
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="Contact Number"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 transition-all placeholder:text-slate-300"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Secure Pin"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 transition-all placeholder:text-slate-300"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-violet-600 text-white rounded-[24px] py-6 text-sm font-black tracking-[4px] shadow-[0_25px_50px_-12px_rgba(124,58,237,0.3)] hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                                >
                                    {isLoading ? 'WORKING...' : (isLogin ? 'ENTER DASHBOARD' : 'CREATE PARTNERSHIP')}
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                                </button>
                            </form>

                            <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
                                <p className="text-slate-400 font-bold text-sm">
                                    {isLogin ? "New to the platform?" : "Already part of us?"}{' '}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-violet-600 hover:text-violet-800 transition-colors px-2"
                                    >
                                        {isLogin ? 'Register Store' : 'Sign In'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Bottom Tagline */}
            <div className="absolute bottom-6 flex items-center gap-4 text-slate-300 text-[10px] font-black uppercase tracking-[6px]">
                Empowering Business Digitalization
            </div>
        </div>
    );
};

export default Auth;
