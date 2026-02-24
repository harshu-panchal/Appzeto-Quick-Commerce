import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, FileText, ChevronLeft } from 'lucide-react';

const SupportPage = () => {
    const navigate = useNavigate();
    const faqs = [
        { q: 'How do I check my order status?', a: 'You can check your order status in the "My Orders" section of your profile.' },
        { q: 'What is the refund policy?', a: 'We offer a no-questions-asked refund policy for damaged or incorrect items within 24 hours of delivery.' },
        { q: 'How do I change my delivery address?', a: 'You can manage your delivery addresses in the "Saved Addresses" section under your profile.' },
        { q: 'Do you deliver to my location?', a: 'We currently serve select areas in Delhi NCR. You can check availability by entering your pincode on the home page.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-8 pb-20 relative z-10 rounded-b-[2.5rem] shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight">Help & Support</h1>
                </div>
                <p className="text-green-50 text-sm font-medium mt-1 relative z-10">We are here to help you</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20 space-y-8">

                {/* Contact Channels */}
                <div className="grid grid-cols-3 gap-3">
                    <ContactCard icon={MessageCircle} label="Chat Us" sub="Instant Support" to="/chat" />
                    <ContactCard icon={Phone} label="Call Us" sub="+91 98765..." />
                    <ContactCard icon={Mail} label="Email Us" sub="support@app..." />
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-xl font-black text-slate-800 mb-4 px-2">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>

                {/* Legal Links */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Legal</h3>
                    <div className="space-y-4">
                        <Link to="/terms" className="flex items-center gap-3 text-slate-600 hover:text-[#0c831f] font-bold">
                            <FileText size={18} /> Terms & Conditions
                        </Link>
                        <Link to="/privacy" className="flex items-center gap-3 text-slate-600 hover:text-[#0c831f] font-bold">
                            <FileText size={18} /> Privacy Policy
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ContactCard = ({ icon: Icon, label, sub, to }) => {
    const CardContent = (
        <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center gap-2 hover:bg-green-50 transition-colors cursor-pointer group h-full">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:text-[#0c831f] transition-colors shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm">{label}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
            </div>
        </div>
    );

    return to ? <Link to={to} className="block h-full">{CardContent}</Link> : CardContent;
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
                <span className="font-bold text-slate-800 text-sm">{question}</span>
                {isOpen ? <ChevronUp size={18} className="text-[#0c831f]" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="px-5 pb-4 text-sm text-slate-500 font-medium leading-relaxed bg-slate-50/50">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default SupportPage;
