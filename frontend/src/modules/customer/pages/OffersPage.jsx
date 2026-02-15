import React from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import { Tag, Sparkles, Clock, ArrowRight } from 'lucide-react';

const OffersPage = () => {
    const offers = [
        {
            id: 1,
            title: "60% OFF On First Order",
            description: "Use code WELCOME60 and get instant discount on your first grocery haul.",
            code: "WELCOME60",
            bg: "bg-blue-600",
            icon: <Sparkles className="text-white" size={32} />
        },
        {
            id: 2,
            title: "FREE Delivery above ₹199",
            description: "No code required. Shop more and save on delivery charges!",
            code: "AUTO-APPLIED",
            bg: "bg-[#0c831f]",
            icon: <Clock className="text-white" size={32} />
        },
        {
            id: 3,
            title: "Flat ₹100 Cashback",
            description: "Pay using Appzeto Wallet and get ₹100 flat cashback on orders above ₹1000.",
            code: "WALLETSAVE",
            bg: "bg-orange-500",
            icon: <Tag className="text-white" size={32} />
        }
    ];

    return (
        <CustomerLayout>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-36 md:mt-24">
                <div className="mb-10 text-left">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#0c831f] mb-3">Best Offers for You</h1>
                    <p className="text-gray-500 text-lg font-medium">Grab these exclusive deals before they expire!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className={`${offer.bg} p-8 h-full flex flex-col justify-between text-white relative z-10`}>
                                <div>
                                    <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6 backdrop-blur-md">
                                        {offer.icon}
                                    </div>
                                    <h2 className="text-3xl font-black mb-3 leading-tight">{offer.title}</h2>
                                    <p className="text-white/80 font-medium mb-8 leading-relaxed">
                                        {offer.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="bg-black/20 px-4 py-2 rounded-xl font-mono font-bold tracking-widest text-lg">
                                        {offer.code}
                                    </div>
                                    <button className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-[#0c831f] transform transition-transform group-hover:rotate-[-45deg]">
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                            {/* Decorative bubbles in background */}
                            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                            <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-black/10 rounded-full blur-2xl group-hover:bg-black/20 transition-all duration-700" />
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-slate-100 rounded-[2.5rem] border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Want more personalized deals?</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Complete your profile to unlock custom rewards and loyalty points on every purchase.</p>
                    <a href="/profile" className="inline-flex items-center px-8 py-3 bg-[#0c831f] text-white font-bold rounded-2xl hover:bg-[#0b721b] transition-all shadow-xl shadow-green-100">
                        Visit My Profile
                    </a>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default OffersPage;
