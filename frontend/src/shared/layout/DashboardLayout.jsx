import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { sellerApi } from '@/modules/seller/services/sellerApi';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children, navItems, title }) => {
    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [shownOrderIds, setShownOrderIds] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(60);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await sellerApi.getOrders();
                if (res.data.success) {
                    const allOrders = res.data.results || res.data.result || [];
                    const pendingOrders = allOrders.filter(o => o.status === 'pending');

                    if (isFirstLoad) {
                        // On first load, mark all existing pending orders as shown to prevent spam
                        const existingIds = new Set(pendingOrders.map(o => o.orderId));
                        setShownOrderIds(existingIds);
                        setIsFirstLoad(false);
                        console.log("Seller Alerts - First load, marked as shown:", existingIds.size);
                    } else {
                        // Find a truly new pending order
                        const newOrder = pendingOrders.find(o => !shownOrderIds.has(o.orderId));
                        if (newOrder && !newOrderAlert) {
                            setNewOrderAlert(newOrder);
                            setShownOrderIds(prev => new Set(prev).add(newOrder.orderId));

                            // Play notification sound
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                            audio.play().catch(e => console.log("Audio play blocked"));
                        }
                    }
                }
            } catch (error) {
                console.error("Polling Error:", error);
            }
        };

        // Initial fetch
        if (isFirstLoad) fetchOrders();

        const pollInterval = setInterval(fetchOrders, 10000);
        return () => clearInterval(pollInterval);
    }, [shownOrderIds, newOrderAlert, isFirstLoad]);

    // Timer logic for New Order Alert
    useEffect(() => {
        let timer;
        if (newOrderAlert) {
            setTimeLeft(60);
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setNewOrderAlert(null);
                        toast.error("Order timed out!");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [newOrderAlert]);

    const handleAcceptOrder = async (orderId) => {
        try {
            await sellerApi.updateOrderStatus(orderId, { status: 'confirmed' });
            toast.success(`Order #${orderId} Accepted!`);
            setNewOrderAlert(null);
        } catch (error) {
            toast.error("Failed to accept order");
        }
    };

    const handleDeclineOrder = async (orderId) => {
        try {
            await sellerApi.updateOrderStatus(orderId, { status: 'cancelled' });
            toast.error(`Order #${orderId} Declined`);
            setNewOrderAlert(null);
        } catch (error) {
            toast.error("Failed to update order");
        }
    };

    return (
        <div className="min-h-screen mesh-gradient-light relative">
            {/* Background Blobs for depth */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <Sidebar items={navItems} title={title} />
            <div className="pl-56">
                <Topbar />
                <main className="pt-20 p-6 min-h-screen">
                    <div className="max-w-7xl mx-auto pb-12">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Order Alert Modal */}
            <AnimatePresence>
                {newOrderAlert && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <BellRing className="h-10 w-10 text-primary" />
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-2">New Order Received!</h2>
                                <p className="text-slate-500 font-medium mb-6">
                                    You have a new order <span className="text-primary font-bold">#{newOrderAlert.orderId}</span> for <span className="text-slate-900 font-bold">₹{newOrderAlert.pricing?.total || newOrderAlert.total}</span>
                                </p>

                                {/* Timer Bar */}
                                <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{ duration: 60, ease: "linear" }}
                                        className={cn("h-full", timeLeft < 15 ? "bg-rose-500" : "bg-primary")}
                                    />
                                </div>

                                <div className="flex items-center gap-4 text-sm font-bold mb-8">
                                    <Clock className={cn("h-4 w-4", timeLeft < 15 ? "text-rose-500 animate-pulse" : "text-slate-400")} />
                                    <span className={timeLeft < 15 ? "text-rose-500" : "text-slate-600"}>
                                        Accept within {timeLeft} seconds
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={() => handleDeclineOrder(newOrderAlert.orderId)}
                                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAcceptOrder(newOrderAlert.orderId)}
                                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    >
                                        <Check className="h-5 w-5" />
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
