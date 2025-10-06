import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BackButton from "../components/BackButton";

function BuyerDashboard() {
  const navigate = useNavigate();

  // ✅ Check token when page loads
  useEffect(() => {
    const token = localStorage.getItem("buyer_token");
    if (!token) {
      navigate("/"); // go back to homepage
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("buyer_token");
    localStorage.removeItem("buyer_name");
    navigate("/"); // back to homepage
  };

  return (
    <div
      className="dashboard-container"
      style={{
        background:
          "linear-gradient(135deg, #debbcbff 0%, #a7d6e1ff 50%, #f190c5ff 100%)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <BackButton to="/" />
      {/* 🟦 Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <h1 style={styles.logo}>IsdaMarket</h1>

          <div style={styles.searchLogoutWrapper}>
            <SearchBar defaultType="products" userType="buyer" />
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🟩 Main content */}
      <div style={styles.main}>
        <h1>🛒 Fresh Catches Await!</h1>
        <p>
          Welcome {localStorage.getItem("buyer_name")}! Browse fish or check your
          orders.
        </p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h2>🐟 Browse Fish</h2>
            <button onClick={() => navigate("/buyer-dashboard/browse")}>
              Browse
            </button>
          </div>

          <div style={styles.card}>
            <h2>📦 My Orders</h2>
            <button onClick={() => navigate("/buyer-dashboard/orders")}>
              View Orders
            </button>
          </div>

          <div style={styles.card}>
            <h2>⚙️ Settings</h2>
            <button onClick={() => navigate("/buyer-dashboard/settings")}>
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
    marginBottom: "30px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 10px",
    flexWrap: "wrap",
    gap: "10px",
  },
  logo: {
    fontSize: "clamp(24px, 5vw, 48px)",
    fontWeight: "bold",
    color: "#fcfcfcff",
    letterSpacing: "2px",
  },
  searchLogoutWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "nowrap",
  },
  logoutButton: {
    backgroundColor: "#bd8ab1ff",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  main: {
    textAlign: "center",
    padding: "0 10px",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
    padding: "0 10px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "40px 20px",
    width: "100%",
    maxWidth: "220px",
    minWidth: "150px",
  },
};

export default BuyerDashboard;
