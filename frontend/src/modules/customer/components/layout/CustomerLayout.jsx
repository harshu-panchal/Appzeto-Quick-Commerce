import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import MiniCart from '../shared/MiniCart';
import { cn } from '@/lib/utils';

const CustomerLayout = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>

            <MiniCart />

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-24 right-6 md:bottom-12 md:right-12 z-[60] p-4 bg-[#0c831f] text-white rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
                )}
            >
                <ArrowUp size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
            </button>

            <Footer />
            <BottomNav />
        </div>
    );
};

export default CustomerLayout;
