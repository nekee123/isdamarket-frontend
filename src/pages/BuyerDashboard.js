import { useNavigate } from "react-router-dom";

function BuyerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>🛒 Buyer Dashboard</h1>
      <p>Welcome {localStorage.getItem("buyer_name")}! Browse fish or check your orders.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>🐟 Browse Fish</h3>
          <button onClick={() => navigate("/buyer-dashboard/browse")}>Browse</button>
        </div>

        <div className="card">
          <h3>📦 My Orders</h3>
          <button onClick={() => navigate("/buyer-dashboard/orders")}>View Orders</button>
        </div>

        <div className="card">
          <h3>⚙️ Settings</h3>
          <button onClick={() => navigate("/buyer-dashboard/settings")}>Settings</button>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
