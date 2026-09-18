import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProductModal from './components/ProductModal';
import BookingModal from './components/BookingModal';
import ReviewModal from './components/ReviewModal';
import SpinnerModal from './components/SpinnerModal';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Storefront Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import RepairsPage from './pages/RepairsPage';
import OwnerPage from './pages/OwnerPage';
import LocationPage from './pages/LocationPage';
import ReviewsPage from './pages/ReviewsPage';

// Admin CMS Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminStockPage from './pages/admin/AdminStockPage';
import AdminRepairsPage from './pages/admin/AdminRepairsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminSpinnerPage from './pages/admin/AdminSpinnerPage';

// Storefront Shell Layout
function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white pb-16 sm:pb-0">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />

      {/* Global Modals */}
      <ProductModal />
      <BookingModal />
      <ReviewModal />
      <SpinnerModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/repairs" element={<RepairsPage />} />
            <Route path="/owner" element={<OwnerPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Route>

          {/* Admin Authentication Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/setup" element={<AdminSetupPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

          {/* Protected Admin CMS Management Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="spinner" element={<AdminSpinnerPage />} />
            <Route path="stock" element={<AdminStockPage />} />
            <Route path="repairs" element={<AdminRepairsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
