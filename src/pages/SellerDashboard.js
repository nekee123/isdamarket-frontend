import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function SellerDashboard() {
  const navigate = useNavigate();

  // ✅ Redirect if no token (prevents going back after logout)
  useEffect(() => {
    const token = localStorage.getItem("seller_token");
    if (!token) {
      navigate("/"); // redirect to homepage
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("seller_token");
    localStorage.removeItem("seller_name");
    navigate("/"); // go to homepage after logout
  };

  return (
    <div
      className="dashboard-container"
      style={{
        background:
          "linear-gradient(135deg, #debbcbff 0%, #a7d6e1ff 50%, #f190c5ff 100%)",
        minHeight: "100vh",
      }}
    >
      {/* 🟦 Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>IsdaMarket</h1>

        <div style={styles.rightHeader}>
          <SearchBar defaultType="products" userType="seller" />
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      {/* 🟩 Main content */}
      <div style={styles.main}>
        <h1>🐠 Seller Dashboard</h1>
        <p>
          Welcome {localStorage.getItem("seller_name")}! Manage your products
          and check your orders.
        </p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>📦 My Products</h3>
            <button onClick={() => navigate("/seller-dashboard/products")}>
              View Products
            </button>
          </div>

          <div style={styles.card}>
            <h3>🧾 My Orders</h3>
            <button onClick={() => navigate("/seller-dashboard/orders")}>
              View Orders
            </button>
          </div>

          <div style={styles.card}>
            <h3>⚙️ Settings</h3>
            <button onClick={() => navigate("/seller-dashboard/settings")}>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#c07b94ff", // 🌸 darkish pink header only
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#fcfcfcff", // 🌸 pinkish accent
  },
  rightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  logoutButton: {
    backgroundColor: "#d18492ff",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  main: {
    textAlign: "center",
    padding: "40px",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "70px",
    width: "220px",
  },
};

export default SellerDashboard;
