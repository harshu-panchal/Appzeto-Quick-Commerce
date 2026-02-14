import React from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import { HiOutlineTrendingUp, HiOutlineChartBar } from 'react-icons/hi';

const Earnings = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Revenue This Week" className="bg-primary-600 text-white border-none">
                    <p className="text-4xl font-bold mt-2">$1,240.50</p>
                    <div className="flex items-center mt-4 text-primary-100">
                        <HiOutlineTrendingUp className="mr-2" />
                        <span>+12.5% from last week</span>
                    </div>
                </Card>
                <Card title="Lifetime Earnings">
                    <p className="text-4xl font-bold mt-2 text-gray-900">$24,850.00</p>
                    <div className="flex items-center mt-4 text-green-600">
                        <HiOutlineTrendingUp className="mr-2" />
                        <span>Consistently growing</span>
                    </div>
                </Card>
            </div>

            <Card title="Monthly Breakdown" headerAction={<Badge>2023</Badge>}>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 italic">
                    Visualization Chart Placeholder
                </div>
            </Card>
        </div>
    );
};

export default Earnings;
