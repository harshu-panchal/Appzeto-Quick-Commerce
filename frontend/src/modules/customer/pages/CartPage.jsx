import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@shared/components/ui/Toast';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();

    const handleRemove = (id, name) => {
        removeFromCart(id);
        showToast(`${name} removed from cart`, 'info');
    };

    return (
        <CustomerLayout showHeader={false}>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-4 md:mt-8">
                <div className="mb-8 text-left">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0c831f] mb-2">Shopping Cart</h1>
                    <p className="text-gray-600 text-lg">Review your items and go to checkout.</p>
                </div>

                {cart.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4 group">
                                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#0c831f] bg-[#0c831f]/10 px-2 py-0.5 rounded-md mb-1 inline-block uppercase">
                                                    {item.category}
                                                </span>
                                                <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{item.name}</h3>
                                                <p className="text-sm text-slate-500 font-medium">1 kg</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="text-slate-900 font-black text-xl">
                                                ₹{item.price * item.quantity}
                                            </div>

                                            <div className="flex items-center gap-3 bg-slate-50 rounded-full px-3 py-1 border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-slate-600 disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} strokeWidth={3} />
                                                </button>
                                                <span className="font-bold text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-slate-600"
                                                >
                                                    <Plus size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-4">
                                <Link to="/categories" className="text-[#0c831f] font-bold hover:underline flex items-center gap-2">
                                    ← Continue Shopping
                                </Link>
                                <button onClick={clearCart} className="text-slate-400 hover:text-red-500 text-sm font-medium">
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl sticky top-28">
                                <h2 className="text-xl font-black text-slate-800 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold">₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Delivery Fee</span>
                                        <span className="text-[#0c831f] font-bold">FREE</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-800">Total Amount</span>
                                        <span className="text-2xl font-black text-[#0c831f]">₹{cartTotal}</span>
                                    </div>
                                </div>

                                <Link to="/checkout">
                                    <Button className="w-full h-14 rounded-2xl bg-[#0c831f] hover:bg-[#0b721b] text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all">
                                        Place Order <ArrowRight size={20} />
                                    </Button>
                                </Link>

                                <p className="text-center text-slate-400 text-xs mt-4 font-medium uppercase tracking-wider">
                                    Secure Checkout Guaranteed
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-[#0c831f]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-3">Your cart is empty</h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our best products!</p>
                        <Link
                            to="/categories"
                            className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-[#0c831f] text-white text-lg font-bold hover:bg-[#0b721b] transition-all shadow-xl shadow-green-100 hover:-translate-y-1"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default CartPage;
