import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import { HiOutlineUsers, HiOutlineBadgeCheck, HiOutlineDocumentReport } from 'react-icons/hi';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '1,280', icon: HiOutlineUsers, color: 'text-indigo-600' },
        { label: 'Pending Approvals', value: '12', icon: HiOutlineBadgeCheck, color: 'text-orange-600' },
        { label: 'Platform Revenue', value: '$12,450', icon: HiOutlineDocumentReport, color: 'text-green-600' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-gray-50">
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="System Health">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">API Status</span>
                            <Badge variant="success">Operational</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Database</span>
                            <Badge variant="success">Connected</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Delivery Sync</span>
                            <Badge variant="info">Active</Badge>
                        </div>
                    </div>
                </Card>

                <Card title="Recent Activity">
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center text-sm border-b pb-2">
                                <div className="h-8 w-8 rounded-full bg-gray-100 mr-3 flex items-center justify-center text-xs">A</div>
                                <div>
                                    <p className="font-medium">Seller approved: FreshMart</p>
                                    <p className="text-gray-500 text-xs">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
