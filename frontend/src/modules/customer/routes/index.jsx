import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CategoriesPage from '../pages/CategoriesPage';
import ProductsPage from '../pages/ProductsPage';
import CategoryProductsPage from '../pages/CategoryProductsPage';
import WishlistPage from '../pages/WishlistPage';
import CartPage from '../pages/CartPage';
import OffersPage from '../pages/OffersPage';
import ProfilePage from '../pages/ProfilePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ScrollToTop from '../components/shared/ScrollToTop';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';

const CustomerRoutes = () => {
    return (
        <WishlistProvider>
            <CartProvider>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/category/:categoryName" element={<CategoryProductsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>
            </CartProvider>
        </WishlistProvider>
    );
};

export default CustomerRoutes;
