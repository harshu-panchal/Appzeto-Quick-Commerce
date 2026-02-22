import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerApi } from '../services/customerApi';
import { useAuth } from '../../../core/context/AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        } catch (error) {
            console.error("Failed to load wishlist from localStorage", error);
            return [];
        }
    });

    const [loading, setLoading] = useState(false);

    // Fetch wishlist from backend on mount or authentication change
    useEffect(() => {
        const fetchWishlist = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const response = await customerApi.getWishlist();
                    const backendWishlist = response.data.result.products.map(product => ({
                        ...product,
                        id: product._id,
                        image: product.mainImage
                    }));
                    setWishlist(backendWishlist);
                } catch (error) {
                    console.error("Failed to fetch wishlist from backend", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear state or load from local storage
                try {
                    const savedWishlist = localStorage.getItem('wishlist');
                    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
                } catch (error) {
                    setWishlist([]);
                }
            }
        };

        fetchWishlist();
    }, [isAuthenticated]);

    // Save local wishlist to localStorage (fallback/guest mode)
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isAuthenticated]);

    const addToWishlist = async (product) => {
        if (isAuthenticated) {
            try {
                const response = await customerApi.addToWishlist({ productId: product.id || product._id });
                const backendWishlist = response.data.result.products.map(p => ({
                    ...p,
                    id: p._id,
                    image: p.mainImage
                }));
                setWishlist(backendWishlist);
            } catch (error) {
                console.error("Error adding to wishlist on backend", error);
            }
        } else {
            setWishlist((prev) => {
                const id = product.id || product._id;
                if (prev.some((item) => (item.id || item._id) === id)) return prev;
                return [...prev, { ...product, id }];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (isAuthenticated) {
            try {
                const response = await customerApi.removeFromWishlist(productId);
                const backendWishlist = response.data.result.products.map(p => ({
                    ...p,
                    id: p._id,
                    image: p.mainImage
                }));
                setWishlist(backendWishlist);
            } catch (error) {
                console.error("Error removing from wishlist on backend", error);
            }
        } else {
            setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== productId));
        }
    };

    const toggleWishlist = async (product) => {
        const id = product.id || product._id;
        if (isAuthenticated) {
            try {
                const response = await customerApi.toggleWishlist({ productId: id });
                const backendWishlist = response.data.result.products.map(p => ({
                    ...p,
                    id: p._id,
                    image: p.mainImage
                }));
                setWishlist(backendWishlist);
            } catch (error) {
                console.error("Error toggling wishlist on backend", error);
            }
        } else {
            if (isInWishlist(id)) {
                removeFromWishlist(id);
            } else {
                addToWishlist(product);
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => (item.id || item._id) === productId);
    };

    const clearWishlist = async () => {
        // Clearing wishlist might not have a dedicated API, usually it's individual removes
        // or a clear endpoint. If no clear endpoint, we can't easily sync but let's assume local clearing first.
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
            count: wishlist.length,
            loading
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
