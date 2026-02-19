import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import { Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';

const OrdersPage = () => {
    // Mock data for orders
    const orders = [
        {
            id: 'ORD-2024-001',
            date: 'Today, 10:30 AM',
            status: 'Delivered',
            total: 450,
            items: ['Fresh Apple', 'Milk', 'Bread'],
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 'ORD-2024-002',
            date: 'Yesterday, 8:15 PM',
            status: 'Out for Delivery',
            total: 1250,
            items: ['Vegetables Pack', 'Rice 5kg', 'Cooking Oil'],
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200'
        }
    ];

    return (
        <CustomerLayout headerText="My Orders" showHeader={false}>
            <div className="min-h-screen bg-gray-50 pb-24">
                <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm px-5 py-4 border-b border-gray-200/50 mb-4">
                    <h1 className="text-2xl font-black text-gray-800">My Orders</h1>
                </div>

                <div className="space-y-4 px-4">
                    {orders.map((order) => (
                        <Link to={`/orders/${order.id}`} key={order.id} className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-3">
                                    <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden">
                                        <img src={order.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">Order #{order.id.split('-')[2]}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{order.date}</p>
                                    </div>
                                </div>
                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-green-100 flex items-center gap-1">
                                    <CheckCircle size={10} />
                                    {order.status}
                                </span>
                            </div>

                            <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                                <div className="text-xs text-gray-500 font-medium">
                                    {order.items.join(', ')} {order.items.length > 3 && `+${order.items.length - 3} more`}
                                </div>
                                <div className="text-sm font-black text-gray-800">
                                    ₹{order.total}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default OrdersPage;
