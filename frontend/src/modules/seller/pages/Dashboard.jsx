import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import { HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineTruck, HiOutlineTrendingUp, HiOutlineDotsVertical } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

const Dashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '$12,450.00', icon: HiOutlineCurrencyDollar, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
        { label: 'Total Orders', value: '156', icon: HiOutlineTruck, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8.2%' },
        { label: 'Active Products', value: '24', icon: HiOutlineCube, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+2 new' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
                                    <HiOutlineTrendingUp className="mr-1" />
                                    <span>{stat.trend}</span>
                                    <span className="text-gray-400 ml-1 font-normal">vs last week</span>
                                </div>
                            </div>
                            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2">
                    <Card title="Revenue Overview" className="h-full border-none shadow-md">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Popular Products or Quick Actions */}
                <div className="lg:col-span-1">
                    <Card title="Quick Actions" className="h-full border-none shadow-md">
                        <div className="space-y-4">
                            <Button className="w-full justify-start text-left" variant="outline">
                                <HiOutlineCube className="mr-3 h-5 w-5 text-gray-500" />
                                Add New Product
                            </Button>
                            <Button className="w-full justify-start text-left" variant="outline">
                                <HiOutlineTruck className="mr-3 h-5 w-5 text-gray-500" />
                                Process Orders
                            </Button>
                            <Button className="w-full justify-start text-left" variant="outline">
                                <HiOutlineCurrencyDollar className="mr-3 h-5 w-5 text-gray-500" />
                                Withdraw Earnings
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Orders */}
            <Card title="Recent Orders" className="border-none shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">#ORD-00{i}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                C{i}
                                            </div>
                                            <span className="font-medium text-gray-900">Customer {i}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">Oct 24, 2023</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">$45.00</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={i === 1 ? 'warning' : i === 2 ? 'success' : 'default'} className="rounded-full px-3">
                                            {i === 1 ? 'Pending' : i === 2 ? 'Delivered' : 'Processing'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                            <HiOutlineDotsVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
