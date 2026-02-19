import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import { HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineTruck, HiOutlineTrendingUp, HiOutlineDotsVertical } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import ShimmerButton from '@/components/ui/shimmer-button';
import { Link } from 'react-router-dom';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Total Revenue', value: '$12,450.00', icon: HiOutlineCurrencyDollar, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', path: '/seller/earnings' },
        { label: 'Total Orders', value: '156', icon: HiOutlineTruck, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8.2%', path: '/seller/orders' },
        { label: 'Active Products', value: '24', icon: HiOutlineCube, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+2 new', path: '/seller/products' },
    ];

    return (
        <div className="space-y-8 p-6">
            <BlurFade delay={0.1}>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <BlurFade key={stat.label} delay={0.1 + (idx * 0.1)}>
                            <div onClick={() => navigate(stat.path)} className="cursor-pointer">
                                <MagicCard
                                    className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
                                    gradientColor={stat.bg.includes('emerald') ? "#ecfdf5" : stat.bg.includes('blue') ? "#eff6ff" : "#f5f3ff"}
                                >
                                    <div className="flex items-start justify-between p-6 relative z-10">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                            <p className="text-4xl font-black text-gray-900 mt-2 tracking-tight">{stat.value}</p>
                                            <div className="flex items-center mt-3 text-sm text-green-600 font-bold bg-green-50 w-fit px-2 py-0.5 rounded-full">
                                                <HiOutlineTrendingUp className="mr-1" />
                                                <span>{stat.trend}</span>
                                                <span className="text-gray-400 ml-1 font-medium">vs last week</span>
                                            </div>
                                        </div>
                                        <div className={cn("p-4 rounded-2xl shadow-sm", stat.bg, stat.color)}>
                                            <stat.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                </MagicCard>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </BlurFade>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <BlurFade delay={0.4} className="lg:col-span-2 h-full">
                    <Card title="Revenue Overview" className="h-full border-none shadow-md bg-white rounded-3xl overflow-hidden">
                        <div className="h-[350px] w-full mt-4 -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 700 }}
                                        cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </BlurFade>

                {/* Quick Actions */}
                <BlurFade delay={0.5} className="lg:col-span-1 h-full">
                    <Card title="Quick Actions" className="h-full border-none shadow-md bg-white rounded-3xl">
                        <div className="space-y-4 mt-2">
                            <Link to="/seller/products/add">
                                <ShimmerButton className="w-full justify-center text-center font-bold text-white shadow-lg shadow-green-200">
                                    <HiOutlineCube className="mr-2 h-5 w-5" />
                                    Add New Product
                                </ShimmerButton>
                            </Link>

                            <Button
                                onClick={() => navigate('/seller/orders')}
                                className="w-full justify-start text-left h-12 rounded-xl border-dashed border-2 hover:border-blue-500 hover:text-blue-600 transition-colors"
                                variant="outline"
                            >
                                <HiOutlineTruck className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                <span className="font-medium">Process Orders</span>
                            </Button>

                            <Button
                                onClick={() => navigate('/seller/earnings')}
                                className="w-full justify-start text-left h-12 rounded-xl border-dashed border-2 hover:border-purple-500 hover:text-purple-600 transition-colors"
                                variant="outline"
                            >
                                <HiOutlineCurrencyDollar className="mr-3 h-5 w-5 text-gray-400 group-hover:text-purple-500" />
                                <span className="font-medium">Withdraw Earnings</span>
                            </Button>
                        </div>
                    </Card>
                </BlurFade>
            </div>

            {/* Recent Orders */}
            <BlurFade delay={0.6}>
                <Card title="Recent Orders" className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr
                                        key={i}
                                        onClick={() => navigate('/seller/orders')}
                                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">#ORD-00{i}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-black text-gray-500 shadow-inner">
                                                    C{i}
                                                </div>
                                                <span className="font-semibold text-gray-900">Customer {i}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm font-medium">Oct 24, 2023</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">$45.00</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={i === 1 ? 'warning' : i === 2 ? 'success' : 'default'} className="rounded-lg px-2.5 py-1 font-bold shadow-sm">
                                                {i === 1 ? 'Pending' : i === 2 ? 'Delivered' : 'Processing'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-all">
                                                <HiOutlineDotsVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </BlurFade>
        </div>
    );
};

export default Dashboard;
