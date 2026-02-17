import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import MiniCart from '../shared/MiniCart';
import ProductDetailSheet from '../shared/ProductDetailSheet';
import { ProductDetailProvider } from '../../context/ProductDetailContext';
import { cn } from '@/lib/utils';

const CustomerLayout = ({ children, showHeader = true, fullHeight = false, showCart = true }) => {


    return (
        <ProductDetailProvider>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                {showHeader && <Header />}
                <main className={cn("flex-1 md:pb-0", !showHeader && "pt-0", !fullHeight && "pb-16")}>
                    {children}
                </main>

                {showCart && <MiniCart />}
                <ProductDetailSheet />


                <div className="hidden md:block">
                    <Footer />
                </div>
                <BottomNav />
            </div>
        </ProductDetailProvider>
    );
};

export default CustomerLayout;
