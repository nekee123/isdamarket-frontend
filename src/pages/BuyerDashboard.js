import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import MobileNav from "../components/MobileNav";
import { FiShoppingBag, FiPackage, FiSettings, FiTrendingUp } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { getAllProducts, getOrdersByBuyer } from "../services/api";

function BuyerDashboard() {
  const navigate = useNavigate();
  const { buyerAuth } = useAuth();
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalPurchases: 0,
    productsAvailable: 0
  });
  const [loading, setLoading] = useState(true);

  // Memoize the fetch function to prevent recreation on every render
  const fetchStats = useCallback(async () => {
    if (!buyerAuth.uid) return;
    
    try {
      setLoading(true);
      
      // Fetch both orders and products in parallel using cached API calls
      const [ordersData, productsData] = await Promise.all([
        getOrdersByBuyer(buyerAuth.uid, true), // Use cache
        getAllProducts(true), // Use cache
      ]);
      
      // Calculate stats from orders
      const activeCount = ordersData.filter(order => 
        order.status !== 'delivered' && order.status !== 'cancelled'
      ).length;
      const totalCount = ordersData.filter(order => 
        order.status === 'delivered'
      ).length;
      
      // Update all stats at once
      setStats({
        activeOrders: activeCount,
        totalPurchases: totalCount,
        productsAvailable: productsData.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Keep previous stats on error
    } finally {
      setLoading(false);
    }
  }, [buyerAuth.uid]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = useCallback((query) => {
    // Navigate to browse page with search query
    navigate(`/buyer-dashboard/browse?search=${encodeURIComponent(query)}`);
  }, [navigate]);

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
                <div style={styles.statNumber}>{loading ? '...' : stats.activeOrders}</div>
                <div style={styles.statLabel}>Active Orders</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{loading ? '...' : stats.totalPurchases}</div>
                <div style={styles.statLabel}>Total Purchases</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🐟</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{loading ? '...' : stats.productsAvailable > 0 ? `${stats.productsAvailable}+` : 0}</div>
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
    paddingTop: '9rem',
    paddingBottom: '5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    width: '100%',
    maxWidth: '100%',
  },
  hero: {
    marginBottom: '1.5rem',
  },
  welcomeSection: {
    marginBottom: '1rem',
    padding: '0.5rem',
  },
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.25rem',
    fontFamily: typography.fontFamily.heading,
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: 'clamp(0.813rem, 3vw, 0.875rem)',
    color: colors.neutral.dark,
    margin: 0,
    lineHeight: '1.4',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  statCard: {
    background: colors.neutral.white,
    padding: '0.75rem 0.5rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    border: `1px solid ${colors.neutral.light}`,
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  statContent: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: '0.125rem',
  },
  statLabel: {
    fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)',
    color: colors.neutral.dark,
    fontWeight: typography.fontWeight.medium,
    lineHeight: '1.2',
  },
  sectionHeader: {
    marginBottom: '0.75rem',
    padding: '0.5rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1rem, 4vw, 1.125rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.25rem',
    fontFamily: typography.fontFamily.heading,
  },
  sectionSubtitle: {
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    color: colors.neutral.dark,
    margin: 0,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    background: colors.neutral.white,
    padding: '1rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${colors.neutral.light}`,
  },
  cardIcon: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: borderRadius.lg,
    background: gradients.oceanLight,
    color: colors.primary.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.125rem',
    fontFamily: typography.fontFamily.heading,
  },
  cardText: {
    fontSize: 'clamp(0.75rem, 3vw, 0.813rem)',
    color: colors.neutral.dark,
    margin: 0,
    lineHeight: '1.3',
  },
};

export default BuyerDashboard;
