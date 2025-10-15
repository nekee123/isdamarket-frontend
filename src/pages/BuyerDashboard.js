import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiShoppingBag, FiPackage, FiSettings, FiTrendingUp } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

function BuyerDashboard() {
  const navigate = useNavigate();
  const { buyerAuth } = useAuth();

  const handleSearch = (query) => {
    // Navigate to browse page with search query
    navigate(`/buyer-dashboard/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar userType="buyer" showSearch={true} onSearch={handleSearch} />
      
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Welcome back, {buyerAuth.name}! 👋</h1>
            <p style={styles.subtitle}>
              Discover fresh seafood from local fishermen. Your next delicious meal is just a click away.
            </p>
          </div>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📦</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>0</div>
                <div style={styles.statLabel}>Active Orders</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>0</div>
                <div style={styles.statLabel}>Total Purchases</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🐟</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Products Available</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <p style={styles.sectionSubtitle}>What would you like to do today?</p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate("/buyer-dashboard/browse")}>
            <div style={styles.cardIcon}>
              <FiShoppingBag size={40} />
            </div>
            <h3 style={styles.cardTitle}>Browse Seafood</h3>
            <p style={styles.cardText}>Explore fresh catches from verified local fishermen across the Philippines</p>
            <button style={styles.cardBtn}>Start Shopping →</button>
          </div>

          <div style={styles.card} onClick={() => navigate("/buyer-dashboard/orders")}>
            <div style={styles.cardIcon}>
              <FiPackage size={40} />
            </div>
            <h3 style={styles.cardTitle}>My Orders</h3>
            <p style={styles.cardText}>Track your orders, view history, and manage deliveries</p>
            <button style={styles.cardBtn}>View Orders →</button>
          </div>

          <div style={styles.card} onClick={() => navigate("/buyer-dashboard/settings")}>
            <div style={styles.cardIcon}>
              <FiSettings size={40} />
            </div>
            <h3 style={styles.cardTitle}>Account Settings</h3>
            <p style={styles.cardText}>Update your profile, preferences, and delivery addresses</p>
            <button style={styles.cardBtn}>Manage Account →</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.neutral.lightest,
    fontFamily: typography.fontFamily.primary,
  },
  container: {
    flex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 2rem',
    width: '100%',
  },
  hero: {
    marginBottom: '4rem',
  },
  welcomeSection: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: colors.neutral.dark,
    margin: 0,
    maxWidth: '700px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  statCard: {
    background: colors.neutral.white,
    padding: '1.5rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: `1px solid ${colors.neutral.light}`,
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    fontFamily: typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
  },
  sectionHeader: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    margin: 0,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '2.5rem',
    boxShadow: shadows.card,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    border: `1px solid ${colors.neutral.light}`,
  },
  cardIcon: {
    width: '80px',
    height: '80px',
    background: gradients.oceanLight,
    borderRadius: borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary.dark,
  },
  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  cardText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    lineHeight: '1.6',
    margin: 0,
  },
  cardBtn: {
    marginTop: 'auto',
    padding: '0.875rem 2rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
};

export default BuyerDashboard;
