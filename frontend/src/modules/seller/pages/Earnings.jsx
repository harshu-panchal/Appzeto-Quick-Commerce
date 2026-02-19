import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import { HiOutlineTrendingUp, HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineDownload } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const monthlyData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 4000 },
    { name: 'Sep', revenue: 3000 },
    { name: 'Oct', revenue: 2000 },
    { name: 'Nov', revenue: 2780 },
    { name: 'Dec', revenue: 1890 },
];

import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import ShimmerButton from '@/components/ui/shimmer-button';

// ... (keep monthlyData constant)

const Earnings = () => {
    const totalBalance = 24850.00;
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
    const [isWithdrawing, setIsWithdrawing] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState(totalBalance.toString());

    const handleWithdraw = () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0 || amount > totalBalance) {
            alert('Please enter a valid amount between $0.01 and $' + totalBalance.toLocaleString());
            return;
        }

        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            setIsWithdrawModalOpen(false);
            alert(`Withdrawal request of $${amount.toLocaleString()} submitted successfully!`);
        }, 1500);
    };

    const exportReport = () => {
        console.log('Exporting earnings report...');
        alert('Exporting monthly earnings report as PDF (Simulation)');
    };
    return (
        <div className="space-y-8 pb-16">
            <BlurFade delay={0.1}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 hidden md:block">Earnings Overview</h2>
                    <div className="flex space-x-3">
                        <Button onClick={exportReport} variant="outline" className="border-gray-200">
                            <HiOutlineDownload className="mr-2 h-5 w-5" />
                            Export Report
                        </Button>
                        <ShimmerButton
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg"
                        >
                            <span className="text-white">Withdraw Funds</span>
                        </ShimmerButton>
                    </div>
                </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BlurFade delay={0.2}>
                    <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-100 font-medium">Total Revenue</p>
                                <h3 className="text-4xl font-bold mt-2">$24,850.00</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <HiOutlineCurrencyDollar className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="mt-8 flex items-center text-emerald-100 bg-white/10 w-fit px-3 py-1 rounded-full text-sm">
                            <HiOutlineTrendingUp className="mr-2" />
                            <span>+12.5% increase from last month</span>
                        </div>
                    </Card>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <MagicCard className="border-none shadow-md h-full bg-white" gradientColor="#fff7ed">
                        <div className="flex justify-between items-start p-6">
                            <div>
                                <p className="text-gray-500 font-medium">Pending Clearance</p>
                                <h3 className="text-4xl font-bold mt-2 text-gray-900">$1,240.50</h3>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <HiOutlineChartBar className="h-8 w-8 text-orange-500" />
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-2 flex items-center text-gray-500 text-sm">
                            <span className="text-orange-500 font-medium mr-2">Processing</span>
                            <span>Will be available on Oct 28</span>
                        </div>
                    </MagicCard>
                </BlurFade>
            </div>

            <BlurFade delay={0.4}>
                <Card title="Monthly Breakdown" headerAction={<Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">2023</Badge>} className="border-none shadow-md">
                    <div className="h-[400px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#059669', fontWeight: 600 }}
                                />
                                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </BlurFade>

            {/* Withdrawal Confirmation Modal */}
            <AnimatePresence>
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsWithdrawModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
                        >
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                <HiOutlineCurrencyDollar className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Withdrawal</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">
                                Specify the amount you wish to withdraw to your linked bank account.
                            </p>

                            <div className="mb-8 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</span>
                                    <span className="text-2xl font-black text-slate-900">${totalBalance.toLocaleString()}</span>
                                </div>

                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</div>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-2xl text-xl font-black text-slate-900 transition-all outline-none text-center"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > totalBalance}
                                    className="w-full py-4 text-sm font-bold shadow-xl shadow-emerald-100 bg-emerald-600 hover:bg-emerald-700 text-white border-none disabled:bg-slate-200 disabled:shadow-none"
                                >
                                    {isWithdrawing ? "PROCESSING..." : "CONFIRM WITHDRAWAL"}
                                </Button>
                                <button
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Earnings;
