import React from 'react';
import Card from '@shared/components/ui/Card';
import { HiOutlineCurrencyDollar, HiOutlineTruck, HiOutlineClock } from 'react-icons/hi2';

const DeliveryDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-primary-600 text-white border-none py-4">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-80">Today's Earnings</p>
                    <p className="text-3xl font-bold mt-1">$45.20</p>
                </Card>
                <Card className="bg-green-600 text-white border-none py-4">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-80">Completed</p>
                    <p className="text-3xl font-bold mt-1">12</p>
                </Card>
                <Card className="bg-blue-600 text-white border-none py-4">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-80">Rating</p>
                    <p className="text-3xl font-bold mt-1">4.9</p>
                </Card>
                <Card className="bg-gray-100 text-gray-900 border-none py-4">
                    <p className="text-xs uppercase font-bold tracking-wider text-gray-500">Online Time</p>
                    <p className="text-3xl font-bold mt-1">6h 12m</p>
                </Card>
            </div>

            <Card title="New Task Available" className="border-primary-200 bg-primary-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-900">Grocery Delivery #4021</h4>
                        <p className="text-gray-600 text-sm mt-1 flex items-center">
                            <HiOutlineClock className="mr-1" /> 2.5km away • Store: FreshMart
                        </p>
                    </div>
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary-200">
                        Accept Task
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default DeliveryDashboard;
