import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Providers
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlyoutCart from './components/FlyoutCart';
import WhatsAppButton from './components/WhatsAppButton';

// Storefront Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { Login, Register } from './pages/AuthPages';
import Account from './pages/Account';
import ClientDiaries from './pages/ClientDiaries';
import { AboutUs, ContactUs, FAQs } from './pages/StaticPages';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCollections from './pages/admin/AdminCollections';
import AdminBanners from './pages/admin/AdminBanners';
import AdminInquiries from './pages/admin/AdminInquiries';

function StorefrontLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <FlyoutCart />
      <WhatsAppButton />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Storefront Layout with Luxury Header & Footer */}
              <Route path="/" element={<StorefrontLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:identifier" element={<ProductDetail />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success/:orderNumber" element={<OrderSuccess />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="account" element={<Account />} />
                <Route path="client-diaries" element={<ClientDiaries />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="faqs" element={<FAQs />} />
                {/* Fallback alias */}
                <Route path="immediate-delivery" element={<Shop />} />
                <Route path="endless-summer-26" element={<Shop />} />
                <Route path="formals" element={<Shop />} />
              </Route>

              {/* Dedicated Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="inquiries" element={<AdminInquiries />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
