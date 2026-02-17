
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CategoriesPage from '../pages/CategoriesPage';

import CategoryProductsPage from '../pages/CategoryProductsPage';
import WishlistPage from '../pages/WishlistPage';
import CartPage from '../pages/CartPage';
import OffersPage from '../pages/OffersPage';
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import AddressesPage from '../pages/AddressesPage';
import WalletPage from '../pages/WalletPage';
import SettingsPage from '../pages/SettingsPage';
import SupportPage from '../pages/SupportPage';
import ChatPage from '../pages/ChatPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import AboutPage from '../pages/AboutPage';
import EditProfilePage from '../pages/EditProfilePage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CheckoutPage from '../pages/CheckoutPage';
import ScrollToTop from '../components/shared/ScrollToTop';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
import { CartAnimationProvider } from '../context/CartAnimationContext';

const CustomerRoutes = () => {
    return (
        <WishlistProvider>
            <CartProvider>
                <CartAnimationProvider>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/categories" element={<CategoriesPage />} />

                        <Route path="/category/:categoryName" element={<CategoryProductsPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                        <Route path="/addresses" element={<AddressesPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        {/* <Route path="/cart" element={<CartPage />} /> */}
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/offers" element={<OffersPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/edit" element={<EditProfilePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Routes>
                </CartAnimationProvider>
            </CartProvider>
        </WishlistProvider>
    );
};

export default CustomerRoutes;
