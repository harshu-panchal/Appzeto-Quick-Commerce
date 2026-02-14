import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import { HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineTruck } from 'react-icons/hi';
import { cn } from '@/lib/utils';

const Dashboard = () => {
    const stats = [
        { label: 'Total Sales', value: '$4,250.00', icon: HiOutlineCurrencyDollar, color: 'text-green-600' },
        { label: 'Total Orders', value: '156', icon: HiOutlineTruck, color: 'text-blue-600' },
        { label: 'Available Products', value: '24', icon: HiOutlineCube, color: 'text-purple-600' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-center space-x-4">
                            <div className={cn("p-3 rounded-xl bg-gray-50", stat.color)}>
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="Recent Orders">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[1, 2, 3].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 font-medium">#ORD-00{i}</td>
                                    <td className="px-6 py-4">Customer {i}</td>
                                    <td className="px-6 py-4">$45.00</td>
                                    <td className="px-6 py-4"><Badge variant="warning">Pending</Badge></td>
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
