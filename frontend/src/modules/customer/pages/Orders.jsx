import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';

const Orders = () => {
    const orders = [
        { id: '#QC-1002', date: 'Oct 24, 2023', total: 15.50, status: 'DELIVERED' },
        { id: '#QC-1005', date: 'Oct 25, 2023', total: 22.00, status: 'ON THE WAY' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="p-0 overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b">
                            <div>
                                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Order</span>
                                <p className="font-semibold text-gray-900">{order.id}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Date</span>
                                <p className="font-semibold text-gray-900">{order.date}</p>
                            </div>
                        </div>
                        <div className="px-6 py-6 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold text-primary-600">${order.total.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">3 Items</p>
                            </div>
                            <Badge variant={order.status === 'DELIVERED' ? 'success' : 'warning'}>
                                {order.status}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Orders;
