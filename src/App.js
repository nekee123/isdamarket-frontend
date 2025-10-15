import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerOrders from "./pages/MyOrders";
import BrowseFish from "./pages/BrowseFish";
import BuyerSettings from "./pages/BuyerSettings";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerSettings from "./pages/SellerSettings";
import ViewProduct from "./pages/ViewProduct";
import ViewProfile from "./pages/ViewProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
