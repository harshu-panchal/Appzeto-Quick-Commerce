import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerApi } from '../services/customerApi';
import { useAuth } from '../../../core/context/AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
            return [];
        }
    });

    const [loading, setLoading] = useState(false);

    // Clear cart locally when user logs out is handled by the useEffect dependency on isAuthenticated
    // Fetch cart from backend on mount or authentication change
    useEffect(() => {
        const fetchCart = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const response = await customerApi.getCart();
                    const backendCart = response.data.result.items.map(item => ({
                        ...item.productId,
                        id: item.productId._id, // Normalize ID
                        quantity: item.quantity,
                        image: item.productId.mainImage // Handle mapping for frontend
                    }));
                    setCart(backendCart);
                } catch (error) {
                    console.error("Failed to fetch cart from backend", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear cart state and load from local storage for guests
                try {
                    const savedCart = localStorage.getItem('cart');
                    setCart(savedCart ? JSON.parse(savedCart) : []);
                } catch (error) {
                    setCart([]);
                }
            }
        };

        fetchCart();
    }, [isAuthenticated]);

    // Save local cart to localStorage (fallback/guest mode)
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const addToCart = async (product) => {
        if (isAuthenticated) {
            try {
                const response = await customerApi.addToCart({ productId: product.id || product._id, quantity: 1 });
                const backendCart = response.data.result.items.map(item => ({
                    ...item.productId,
                    id: item.productId._id,
                    quantity: item.quantity,
                    image: item.productId.mainImage
                }));
                setCart(backendCart);
            } catch (error) {
                console.error("Error adding to cart on backend", error);
            }
        } else {
            setCart((prev) => {
                const id = product.id || product._id;
                const existingItem = prev.find((item) => (item.id || item._id) === id);
                if (existingItem) {
                    return prev.map((item) =>
                        (item.id || item._id) === id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, id, quantity: 1 }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                const response = await customerApi.removeFromCart(productId);
                const backendCart = response.data.result.items.map(item => ({
                    ...item.productId,
                    id: item.productId._id,
                    quantity: item.quantity,
                    image: item.productId.mainImage
                }));
                setCart(backendCart);
            } catch (error) {
                console.error("Error removing from cart on backend", error);
            }
        } else {
            setCart((prev) => prev.filter((item) => (item.id || item._id) !== productId));
        }
    };

    const updateQuantity = async (productId, delta) => {
        const currentItem = cart.find(item => (item.id || item._id) === productId);
        if (!currentItem) return;

        const newQty = Math.max(0, currentItem.quantity + delta);

        if (newQty === 0) {
            removeFromCart(productId);
            return;
        }

        if (isAuthenticated) {
            try {
                const response = await customerApi.updateCartQuantity({ productId, quantity: newQty });
                const backendCart = response.data.result.items.map(item => ({
                    ...item.productId,
                    id: item.productId._id,
                    quantity: item.quantity,
                    image: item.productId.mainImage
                }));
                setCart(backendCart);
            } catch (error) {
                console.error("Error updating quantity on backend", error);
            }
        } else {
            setCart((prev) =>
                prev.map((item) => {
                    if ((item.id || item._id) === productId) {
                        return { ...item, quantity: newQty };
                    }
                    return item;
                })
            );
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await customerApi.clearCart();
                setCart([]);
            } catch (error) {
                console.error("Error clearing cart on backend", error);
            }
        } else {
            setCart([]);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};
