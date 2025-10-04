import "../App.css";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🐠 Seller Dashboard</h1>
      <p className="dashboard-subtitle">Welcome Seller! Manage your products and orders here.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>📦 My Products</h3>
          <p>Add, update, or delete your fish products.</p>
          <button className="card-btn" onClick={() => navigate("/seller-dashboard/products")}>
            Manage Products
          </button>
        </div>

        <div className="card">
          <h3>🛒 Orders</h3>
          <p>View and update orders from buyers.</p>
          <button className="card-btn" onClick={() => navigate("/seller-dashboard/orders")}>
            View Orders
          </button>
        </div>

        <div className="card">
          <h3>⚙️ Settings</h3>
          <p>Update your seller profile information.</p>
          <button className="card-btn" onClick={() => navigate("/seller-dashboard/settings")}>
            Profile Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
