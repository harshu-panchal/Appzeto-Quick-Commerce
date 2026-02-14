import React from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import EmptyState from '@shared/components/EmptyState';
import { HiOutlineShoppingCart } from 'react-icons/hi';

const Cart = () => {
    const cartItems = [
        { id: 1, name: 'Fresh Milk', price: 2.5, quantity: 2 },
        { id: 2, name: 'Organic Bananas', price: 1.2, quantity: 5 },
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <EmptyState
                icon={<HiOutlineShoppingCart className="h-16 w-16" />}
                title="Your cart is empty"
                description="Looks like you haven't added anything to your cart yet."
                action={<Button>Start Shopping</Button>}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">Img</div>
                                <div>
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">${item.price} each</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center">-</button>
                                <span className="font-medium">{item.quantity}</span>
                                <button className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center">+</button>
                            </div>
                        </Card>
                    ))}
                </div>
                <div>
                    <Card title="Summary">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>$2.00</span>
                            </div>
                            <div className="pt-3 border-t flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary-600">${(subtotal + 2).toFixed(2)}</span>
                            </div>
                            <Button className="w-full mt-4">Checkout</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;
