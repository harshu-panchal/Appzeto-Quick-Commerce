import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import { Package, ChevronRight, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { customerApi } from '../services/customerApi';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await customerApi.getMyOrders();
                setOrders(response.data.results || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <CustomerLayout showHeader={false}>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin text-green-600" size={32} />
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout headerText="My Orders" showHeader={false}>
            <div className="min-h-screen bg-gray-50 pb-24">
                <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm px-5 py-4 border-b border-gray-200/50 mb-4">
                    <h1 className="text-2xl font-black text-gray-800">My Orders</h1>
                </div>

                <div className="space-y-4 px-4">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Package size={64} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-800">No orders yet</h3>
                            <p className="text-gray-500 text-sm mb-6">Looks like you haven't ordered anything yet.</p>
                            <Link to="/" className="bg-[#0c831f] text-white px-8 py-3 rounded-xl font-bold">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <Link to={`/orders/${order.orderId}`} key={order._id} className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-3">
                                        <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                            {order.items[0]?.image ? (
                                                <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">Order #{order.orderId.slice(-6)}</h3>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border flex items-center gap-1 ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        <CheckCircle size={10} />
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                                    <div className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                                        {order.items.map(i => i.name).join(', ')}
                                    </div>
                                    <div className="text-sm font-black text-gray-800">
                                        ₹{order.pricing.total}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default OrdersPage;
