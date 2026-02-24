import React from 'react';
import { ChevronLeft, Truck, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-4 py-3 flex items-center gap-1 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-800">About Us</h1>
            </div>

            <div className="p-5 max-w-3xl mx-auto space-y-6">

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] rounded-3xl p-8 text-center text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                            <ShoppingBag size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Appzeto</h2>
                        <p className="text-green-50 font-medium max-w-sm mx-auto">Delivering happiness to your doorstep in minutes.</p>
                    </div>
                </div>

                {/* Mission Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Truck size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Our Mission</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        To revolutionize quick commerce by providing the fastest, most reliable delivery of daily essentials, ensuring quality and convenience for every household.
                    </p>
                </div>

                {/* Values Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                            <Heart size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Our Values</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                            <span><strong>Customer First:</strong> Your satisfaction is our top priority.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                            <span><strong>Quality Assurance:</strong> We deliver only the freshest and best products.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                            <span><strong>Speed with Safety:</strong> Fast delivery without compromising on safety standards.</span>
                        </li>
                    </ul>
                </div>

                <div className="text-center pt-4">
                    <p className="text-xs text-slate-400">© 2026 Appzeto Quick Commerce. All rights reserved.</p>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
