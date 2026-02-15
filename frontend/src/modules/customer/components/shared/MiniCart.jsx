import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '@/lib/utils';

const MiniCart = () => {
    const { cart, cartTotal } = useCart();

    if (cart.length === 0) return null;

    return (
        <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-[55] w-[92%] max-w-lg md:w-auto animate-in slide-in-from-bottom-10 duration-500">
            <Link
                to="/cart"
                className="flex items-center justify-between gap-8 bg-[#0c831f] text-white p-4 rounded-2xl shadow-2xl shadow-green-900/30 hover:bg-[#0b721b] transition-all hover:scale-[1.02] active:scale-95 group"
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <ShoppingBag size={24} className="animate-bounce" />
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase opacity-80 tracking-widest">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
                        <p className="text-xl font-black">₹{cartTotal}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 font-black text-lg">
                    VIEW CART <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>
    );
};

export default MiniCart;
