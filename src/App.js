import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const BuyerLogin = lazy(() => import("./pages/BuyerLogin"));
const SellerLogin = lazy(() => import("./pages/SellerLogin"));
const BuyerDashboard = lazy(() => import("./pages/BuyerDashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const BuyerOrders = lazy(() => import("./pages/MyOrders"));
const BrowseFish = lazy(() => import("./pages/BrowseFish"));
const BuyerSettings = lazy(() => import("./pages/BuyerSettings"));
const BuyerMessages = lazy(() => import("./pages/BuyerMessages"));
const SellerProducts = lazy(() => import("./pages/SellerProducts"));
const SellerOrders = lazy(() => import("./pages/SellerOrders"));
const SellerSettings = lazy(() => import("./pages/SellerSettings"));
const SellerMessages = lazy(() => import("./pages/SellerMessages"));
const ViewProduct = lazy(() => import("./pages/ViewProduct"));
const ViewProfile = lazy(() => import("./pages/ViewProfile"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
            <Routes>
          {/* 🏠 Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />

          {/* 🛒 Buyer Dashboard & Sub-pages */}
          <Route 
            path="/buyer-dashboard" 
            element={
              <ProtectedRoute userType="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard/browse" 
            element={
              <ProtectedRoute userType="buyer">
                <BrowseFish />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard/orders" 
            element={
              <ProtectedRoute userType="buyer">
                <BuyerOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard/settings" 
            element={
              <ProtectedRoute userType="buyer">
                <BuyerSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard/messages" 
            element={
              <ProtectedRoute userType="buyer">
                <BuyerMessages />
              </ProtectedRoute>
            } 
          />

          {/* 🐟 Seller Dashboard & Sub-pages */}
          <Route 
            path="/seller-dashboard" 
            element={
              <ProtectedRoute userType="seller">
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard/products" 
            element={
              <ProtectedRoute userType="seller">
                <SellerProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard/orders" 
            element={
              <ProtectedRoute userType="seller">
                <SellerOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard/settings" 
            element={
              <ProtectedRoute userType="seller">
                <SellerSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard/messages" 
            element={
              <ProtectedRoute userType="seller">
                <SellerMessages />
              </ProtectedRoute>
            } 
          />

          {/* 👁️ View Pages */}
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
