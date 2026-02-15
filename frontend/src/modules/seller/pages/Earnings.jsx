import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import { HiOutlineTrendingUp, HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineDownload } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const Earnings = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 hidden md:block">Earnings Overview</h2>
                <div className="flex space-x-3">
                    <Button variant="outline">
                        <HiOutlineDownload className="mr-2 h-5 w-5" />
                        Export Report
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Withdraw Funds
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg">
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

                <Card className="border-none shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium">Pending Clearance</p>
                            <h3 className="text-4xl font-bold mt-2 text-gray-900">$1,240.50</h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <HiOutlineChartBar className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center text-gray-500 text-sm">
                        <span className="text-orange-500 font-medium mr-2">Processing</span>
                        <span>Will be available on Oct 28</span>
                    </div>
                </Card>
            </div>

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
        </div>
    );
};

export default Earnings;
