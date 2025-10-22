import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { lazyWithRetry } from "./utils/lazyRetry";

console.log('🎯 App.js loaded - file executed');

// Lazy load pages with automatic retry logic to prevent white screen on refresh
const HomePage = lazyWithRetry(() => import("./pages/HomePage"));
const BuyerLogin = lazyWithRetry(() => import("./pages/BuyerLogin"));
const SellerLogin = lazyWithRetry(() => import("./pages/SellerLogin"));
const BuyerDashboard = lazyWithRetry(() => import("./pages/BuyerDashboard"));
const SellerDashboard = lazyWithRetry(() => import("./pages/SellerDashboard"));
const BuyerOrders = lazyWithRetry(() => import("./pages/MyOrders"));
const BrowseFish = lazyWithRetry(() => import("./pages/BrowseFish"));
const BuyerSettings = lazyWithRetry(() => import("./pages/BuyerSettings"));
const SellerProducts = lazyWithRetry(() => import("./pages/SellerProducts"));
const SellerOrders = lazyWithRetry(() => import("./pages/SellerOrders"));
const SellerSettings = lazyWithRetry(() => import("./pages/SellerSettings"));
const ViewProduct = lazyWithRetry(() => import("./pages/ViewProduct"));
const ViewProfile = lazyWithRetry(() => import("./pages/ViewProfile"));
const SellerProfile = lazyWithRetry(() => import("./pages/SellerProfile"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

console.log('✅ All lazy components defined');

// Debug component to log route changes
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('📍 Route changed to:', location.pathname);
  }, [location]);
  
  return null;
}

function App() {
  console.log('🚀 App component rendering');
  
  useEffect(() => {
    console.log('✅ App mounted successfully');
    console.log('📍 Current location:', window.location.pathname);
    
    // Clear any stale session storage on app mount
    const chunkReloadFlag = sessionStorage.getItem('chunk-reload-attempted');
    if (chunkReloadFlag) {
      console.log('🧹 Clearing chunk reload flag');
      sessionStorage.removeItem('chunk-reload-attempted');
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <Router>
        <RouteDebugger />
        <AuthProvider>
          <Suspense fallback={
            <>
              {console.log('⏳ Suspense fallback showing - loading component...')}
              <LoadingSpinner fullScreen={true} />
            </>
          }>
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

          {/* 👁️ View Pages */}
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          
          {/* 🚫 Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
