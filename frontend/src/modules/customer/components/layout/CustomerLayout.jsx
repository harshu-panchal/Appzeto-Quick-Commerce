import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import MiniCart from '../shared/MiniCart';
import ProductDetailSheet from '../shared/ProductDetailSheet';
import { ProductDetailProvider } from '../../context/ProductDetailContext';
import { cn } from '@/lib/utils';

import { useLocation } from 'react-router-dom';

const CustomerLayout = ({ children, showHeader: showHeaderProp, fullHeight = false, showCart: showCartProp, showBottomNav: showBottomNavProp }) => {
    const location = useLocation();

    // Route-based visibility logic
    const path = location.pathname.replace(/\/$/, '') || '/';

    const hideHeaderRoutes = ['/', '/categories', '/orders', '/profile', '/profile/edit', '/wishlist', '/addresses', '/wallet', '/support', '/privacy', '/about', '/terms', '/checkout'];
    const hideBottomNavRoutes = ['/checkout'];
    const hideCartRoutes = ['/checkout', '/cart'];

    // If props are passed, use them. Otherwise, use route-based logic.
    const showHeader = showHeaderProp !== undefined ? showHeaderProp : (!hideHeaderRoutes.includes(path) && !path.startsWith('/category') && !path.startsWith('/orders'));
    const showBottomNav = showBottomNavProp !== undefined ? showBottomNavProp : !hideBottomNavRoutes.includes(path);
    const showCart = showCartProp !== undefined ? showCartProp : (!hideCartRoutes.includes(path) && !path.startsWith('/orders'));


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
                {showBottomNav && <BottomNav />}
            </div>
        </ProductDetailProvider>
    );
};

export default CustomerLayout;
