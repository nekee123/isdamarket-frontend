import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      <Routes>
        {/* 🏠 Main Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        {/* 🛒 Buyer Dashboard & Sub-pages */}
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer-dashboard/browse" element={<BrowseFish />} />
        <Route path="/buyer-dashboard/orders" element={<BuyerOrders />} />
        <Route path="/buyer-dashboard/settings" element={<BuyerSettings />} />

        {/* 🐟 Seller Dashboard & Sub-pages */}
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-dashboard/products" element={<SellerProducts />} />
        <Route path="/seller-dashboard/orders" element={<SellerOrders />} />
        <Route path="/seller-dashboard/settings" element={<SellerSettings />} />

        {/* 👁️ View Pages */}
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
