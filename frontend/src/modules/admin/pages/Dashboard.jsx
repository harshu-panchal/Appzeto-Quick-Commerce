import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    HiOutlineUsers,
    HiOutlineBadgeCheck,
    HiOutlineDocumentReport,
    HiOutlineStatusOnline,
    HiOutlineDatabase,
    HiOutlineRefresh,
    HiOutlineClock,
    HiOutlineTrendingUp,
    HiOutlineShoppingBag,
    HiOutlineTruck
} from 'react-icons/hi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const chartData = [
    { name: 'Mon', revenue: 4000, users: 2400 },
    { name: 'Tue', revenue: 3000, users: 1398 },
    { name: 'Wed', revenue: 2000, users: 9800 },
    { name: 'Thu', revenue: 2780, users: 3908 },
    { name: 'Fri', revenue: 1890, users: 4800 },
    { name: 'Sat', revenue: 2390, users: 3800 },
    { name: 'Sun', revenue: 3490, users: 4300 },
];

const categoryData = [
    { name: 'Grocery', value: 400, color: '#4f46e5' },
    { name: 'Electronics', value: 300, color: '#10b981' },
    { name: 'Fashion', value: 300, color: '#f59e0b' },
    { name: 'Home', value: 200, color: '#ef4444' },
];

const AdminDashboard = () => {
    const stats = [
        {
            label: 'Total Users',
            value: '1,280',
            icon: HiOutlineUsers,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            trend: '+12.5%',
            trendColor: 'text-green-600',
            description: 'Active this month'
        },
        {
            label: 'Active Sellers',
            value: '84',
            icon: HiOutlineShoppingBag,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            trend: '+5.2%',
            trendColor: 'text-green-600',
            description: 'Verified stores'
        },
        {
            label: 'Total Orders',
            value: '2,456',
            icon: HiOutlineTruck,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            trend: '+18.4%',
            trendColor: 'text-green-600',
            description: 'Last 30 days'
        },
        {
            label: 'Revenue',
            value: '$42,450',
            icon: HiOutlineDocumentReport,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            trend: '+8.2%',
            trendColor: 'text-green-600',
            description: 'Net earnings'
        },
    ];

    const healthMetrics = [
        { label: 'API Gateway', status: 'Operational', variant: 'success', icon: HiOutlineStatusOnline },
        { label: 'Database Cluster', status: 'Connected', variant: 'success', icon: HiOutlineDatabase },
        { label: 'Cloud Storage', status: 'Stable', variant: 'success', icon: HiOutlineRefresh },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium text-sm">Platform Performance & Statistics Overview</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="px-3 py-1 bg-white border-gray-200 text-gray-600">
                        Last Update: Today, 12:45 PM
                    </Badge>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className={cn("relative transition-all hover:shadow-xl border-none ring-1 ring-gray-100 group", stat.bg + "/30")}>
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                                <div className={cn("flex items-center text-[10px] font-semibold px-2 py-1 rounded-full", stat.trendColor, "bg-white/50")}>
                                    <HiOutlineTrendingUp className="h-3 w-3 mr-1" />
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                <div className="flex items-baseline space-x-2">
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">{stat.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Analytics */}
                <div className="lg:col-span-2">
                    <Card
                        title="Revenue Growth"
                        subtitle="Monthly platform revenue trends"
                        className="h-full border-none shadow-sm ring-1 ring-gray-100"
                    >
                        <div className="h-[350px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#4f46e5"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Categories Distribution */}
                <div className="lg:col-span-1">
                    <Card
                        title="Sales by Category"
                        subtitle="Percentage distribution"
                        className="h-full border-none shadow-sm ring-1 ring-gray-100"
                    >
                        <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}

                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-gray-900">72%</span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">Growth</span>
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            {categoryData.map((cat) => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-sm font-semibold text-gray-600">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{cat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <Card
                        title="Recent Orders"
                        subtitle="Manage and track latest customer purchases"
                        className="border-none shadow-sm ring-1 ring-gray-100 h-full"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-100">
                                        <th className="pb-4 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="pb-4 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="pb-4 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="pb-4 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="pb-4 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { id: '#ORD-7721', customer: 'John Doe', status: 'success', statusText: 'Delivered', amount: '$120.50', time: '2 mins ago' },
                                        { id: '#ORD-7720', customer: 'Sarah Wilson', status: 'warning', statusText: 'Processing', amount: '$45.00', time: '12 mins ago' },
                                        { id: '#ORD-7719', customer: 'Mike Ross', status: 'info', statusText: 'Shipped', amount: '$89.20', time: '1 hr ago' },
                                        { id: '#ORD-7718', customer: 'Emma Watson', status: 'success', statusText: 'Delivered', amount: '$210.00', time: '3 hrs ago' },
                                        { id: '#ORD-7717', customer: 'David King', status: 'error', statusText: 'Cancelled', amount: '$15.00', time: '5 hrs ago' },
                                    ].map((order) => (
                                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-all">
                                            <td className="py-4 text-sm font-semibold text-primary">{order.id}</td>
                                            <td className="py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500 ring-2 ring-white shadow-sm">
                                                        {order.customer[0]}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700">{order.customer}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant={order.status} className="rounded-full px-3 py-0.5 text-[10px] font-bold tracking-tight uppercase">
                                                    {order.statusText}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                                            <td className="py-4 text-xs font-semibold text-gray-400">{order.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 text-xs font-bold text-gray-500 hover:bg-primary hover:text-white transition-all">
                            VIEW FULL ORDER HISTORY
                        </button>
                    </Card>
                </div>

                {/* Top Products */}
                <div className="lg:col-span-1">
                    <Card
                        title="Top Selling Products"
                        subtitle="Best performers this week"
                        className="border-none shadow-sm ring-1 ring-gray-100 h-full"
                    >
                        <div className="space-y-4">
                            {[
                                { name: 'Organic Bananas', cat: 'Grocery', sales: 450, rev: '$1,200', icon: '🍌', trend: '+12%', color: 'bg-yellow-50 text-yellow-600' },
                                { name: 'Wireless Earbuds', cat: 'Electronics', sales: 320, rev: '$15.4k', icon: '🎧', trend: '+8%', color: 'bg-blue-50 text-blue-600' },
                                { name: 'Cotton T-Shirt', cat: 'Fashion', sales: 280, rev: '$5.6k', icon: '👕', trend: '+15%', color: 'bg-rose-50 text-rose-600' },
                                { name: 'Smart Watch Pro', cat: 'Electronics', sales: 150, rev: '$22.5k', icon: '⌚', trend: '+5%', color: 'bg-indigo-50 text-indigo-600' },
                                { name: 'Fresh Avocado', cat: 'Grocery', sales: 120, rev: '$800', icon: '🥑', trend: '+20%', color: 'bg-emerald-50 text-emerald-600' },
                            ].map((product, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                    <div className="flex items-center space-x-3">
                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform", product.color)}>
                                            {product.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none">{product.name}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1.5">{product.cat}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{product.rev}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold">{product.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all">
                            SEE PRODUCT ANALYTICS
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

