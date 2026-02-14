import React from 'react';
import Card from '@shared/components/ui/Card';
import { HiOutlineLightningBolt, HiOutlineClock, HiOutlineShieldCheck } from 'react-icons/hi';

const Home = () => {
    return (
        <div className="space-y-8">
            <section className="bg-primary-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-4">Groceries delivered in 10 minutes</h2>
                    <p className="text-primary-100 text-lg mb-6">Experience the magic of quick commerce with our lightning fast delivery service.</p>
                    <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors">
                        Order Now
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20">
                    <HiOutlineLightningBolt className="h-64 w-64" />
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Quick Delivery" className="flex flex-col items-center text-center">
                    <HiOutlineLightningBolt className="h-12 w-12 text-yellow-500 mb-4" />
                    <p className="text-gray-600">Average delivery time of just 10-15 minutes.</p>
                </Card>
                <Card title="Best Prices" className="flex flex-col items-center text-center">
                    <HiOutlineClock className="h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-gray-600">Affordable prices and great daily deals.</p>
                </Card>
                <Card title="Quality Assured" className="flex flex-col items-center text-center">
                    <HiOutlineShieldCheck className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-gray-600">Fresh items sourced directly from local vendors.</p>
                </Card>
            </div>
        </div>
    );
};

export default Home;
