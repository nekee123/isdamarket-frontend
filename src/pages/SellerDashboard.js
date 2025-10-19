import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiBox, FiShoppingCart, FiSettings, FiTrendingUp } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { getProductsBySeller, getOrdersBySeller } from "../services/api";

function SellerDashboard() {
  const navigate = useNavigate();
  const { sellerAuth } = useAuth();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    listedProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch seller stats
  const fetchStats = useCallback(async () => {
    if (!sellerAuth.uid) return;
    
    try {
      setLoading(true);
      
      // Fetch both products and orders in parallel using cached API calls
      const [productsData, ordersData] = await Promise.all([
        getProductsBySeller(sellerAuth.uid),
        getOrdersBySeller(sellerAuth.uid, true), // Use cache
      ]);
      
      // Calculate pending orders (orders that are not delivered or cancelled)
      const pendingCount = ordersData.filter(order => 
        order.status !== 'delivered' && order.status !== 'cancelled'
      ).length;
      
      // Calculate total revenue from delivered orders
      const revenue = ordersData
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total_price || 0), 0);
      
      // Update all stats at once
      setStats({
        pendingOrders: pendingCount,
        listedProducts: productsData.length,
        totalRevenue: revenue
      });
    } catch (err) {
      console.error('Error fetching seller stats:', err);
      // Keep previous stats on error
    } finally {
      setLoading(false);
    }
  }, [sellerAuth.uid]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div style={styles.pageWrapper}>
      <Navbar userType="seller" showSearch={true} />
      
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Welcome back, {sellerAuth.name}! 🐠</h1>
            <p style={styles.subtitle}>
              Manage your fish business with ease. Reach more customers and grow your sales today.
            </p>
          </div>
          
          <div style={styles.statsGrid}>
            {/* Shows number of orders waiting for your confirmation/processing */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📦</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{loading ? '...' : stats.pendingOrders}</div>
                <div style={styles.statLabel}>Pending Orders</div>
                <div style={styles.statHint}>Orders awaiting action</div>
              </div>
            </div>
            {/* Shows total number of fish products you have listed for sale */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🐟</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{loading ? '...' : stats.listedProducts}</div>
                <div style={styles.statLabel}>Listed Products</div>
                <div style={styles.statHint}>Active fish listings</div>
              </div>
            </div>
            {/* Shows total earnings from all completed orders */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💰</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{loading ? '...' : `₱${stats.totalRevenue.toLocaleString()}`}</div>
                <div style={styles.statLabel}>Total Revenue</div>
                <div style={styles.statHint}>From completed sales</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Manage Your Business</h2>
          <p style={styles.sectionSubtitle}>What would you like to do today?</p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate("/seller-dashboard/products")}>
            <div style={styles.cardIcon}>
              <FiBox size={40} />
            </div>
            <h3 style={styles.cardTitle}>My Products</h3>
            <p style={styles.cardText}>Add new products, update inventory, and manage your fish listings</p>
            <button style={styles.cardBtn}>Manage Products →</button>
          </div>

          <div style={styles.card} onClick={() => navigate("/seller-dashboard/orders")}>
            <div style={styles.cardIcon}>
              <FiShoppingCart size={40} />
            </div>
            <h3 style={styles.cardTitle}>Customer Orders</h3>
            <p style={styles.cardText}>View and fulfill customer orders, track deliveries and payments</p>
            <button style={styles.cardBtn}>View Orders →</button>
          </div>

          <div style={styles.card} onClick={() => navigate("/seller-dashboard/settings")}>
            <div style={styles.cardIcon}>
              <FiSettings size={40} />
            </div>
            <h3 style={styles.cardTitle}>Shop Settings</h3>
            <p style={styles.cardText}>Update your shop profile, business info, and account preferences</p>
            <button style={styles.cardBtn}>Manage Settings →</button>
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
    paddingTop: '6rem',
    paddingBottom: '3rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
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
  statHint: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    fontStyle: 'italic',
    marginTop: '0.25rem',
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

export default SellerDashboard;
