import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import MobileNav from "../components/MobileNav";
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
      <MobileHeader 
        title="Home" 
        showSearch={true} 
        onSearch={handleSearch}
        userType="buyer"
        userId={buyerAuth.uid}
      />
      
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Welcome back, {buyerAuth.name}! 👋</h1>
            <p style={styles.subtitle}>
              Discover fresh fish from local fishermen. Your next delicious meal is just a click away.
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
              <FiShoppingBag size={28} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Browse Fish</h3>
              <p style={styles.cardText}>Explore fresh catches from local fishermen</p>
            </div>
          </div>

          <div style={styles.card} onClick={() => navigate("/buyer-dashboard/orders")}>
            <div style={styles.cardIcon}>
              <FiPackage size={28} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>My Orders</h3>
              <p style={styles.cardText}>Track your orders and deliveries</p>
            </div>
          </div>

          <div style={styles.card} onClick={() => navigate("/buyer-dashboard/settings")}>
            <div style={styles.cardIcon}>
              <FiSettings size={28} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Account Settings</h3>
              <p style={styles.cardText}>Update your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <MobileNav userType="buyer" />
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
    padding: 'calc(4.5rem + env(safe-area-inset-top)) 1rem calc(5rem + env(safe-area-inset-bottom))',
    width: '100%',
    maxWidth: '100%',
  },
  hero: {
    marginBottom: '2rem',
  },
  welcomeSection: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    margin: 0,
    lineHeight: '1.5',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  statCard: {
    background: colors.neutral.white,
    padding: '1rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    border: `1px solid ${colors.neutral.light}`,
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '1.75rem',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    fontFamily: typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.dark,
  },
  sectionHeader: {
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.25rem',
    fontFamily: typography.fontFamily.heading,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    margin: 0,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: '1.25rem',
    boxShadow: shadows.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1rem',
    border: `1px solid ${colors.neutral.light}`,
  },
  cardIcon: {
    width: '56px',
    height: '56px',
    background: gradients.oceanLight,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary.dark,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    margin: 0,
    marginBottom: '0.25rem',
    fontFamily: typography.fontFamily.heading,
  },
  cardText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    lineHeight: '1.4',
    margin: 0,
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
};

export default BuyerDashboard;
