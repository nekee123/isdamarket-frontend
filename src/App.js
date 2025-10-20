import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { lazyRetry } from "./utils/lazyRetry";

// Lazy load pages with retry logic to prevent white screen on refresh
const HomePage = lazy(() => lazyRetry(() => import("./pages/HomePage")));
const BuyerLogin = lazy(() => lazyRetry(() => import("./pages/BuyerLogin")));
const SellerLogin = lazy(() => lazyRetry(() => import("./pages/SellerLogin")));
const BuyerDashboard = lazy(() => lazyRetry(() => import("./pages/BuyerDashboard")));
const SellerDashboard = lazy(() => lazyRetry(() => import("./pages/SellerDashboard")));
const BuyerOrders = lazy(() => lazyRetry(() => import("./pages/MyOrders")));
const BrowseFish = lazy(() => lazyRetry(() => import("./pages/BrowseFish")));
const BuyerSettings = lazy(() => lazyRetry(() => import("./pages/BuyerSettings")));
const SellerProducts = lazy(() => lazyRetry(() => import("./pages/SellerProducts")));
const SellerOrders = lazy(() => lazyRetry(() => import("./pages/SellerOrders")));
const SellerSettings = lazy(() => lazyRetry(() => import("./pages/SellerSettings")));
const ViewProduct = lazy(() => lazyRetry(() => import("./pages/ViewProduct")));
const ViewProfile = lazy(() => lazyRetry(() => import("./pages/ViewProfile")));
const SellerProfile = lazy(() => lazyRetry(() => import("./pages/SellerProfile")));
const NotFound = lazy(() => lazyRetry(() => import("./pages/NotFound")));

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
