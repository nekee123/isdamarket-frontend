import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiPackage, FiTruck, FiShield, FiClock, FiAward, FiArrowRight, FiStar } from 'react-icons/fi';
import Footer from '../components/Footer';
import { colors, gradients, shadows, borderRadius, typography, spacing } from '../styles/theme';

function HomePage() {
  const navigate = useNavigate();
  const { buyerAuth, sellerAuth } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (buyerAuth.isAuthenticated) {
      navigate('/buyer-dashboard');
    } else if (sellerAuth.isAuthenticated) {
      navigate('/seller-dashboard');
    }
  }, [buyerAuth.isAuthenticated, sellerAuth.isAuthenticated, navigate]);

  return (
    <div style={styles.pageWrapper}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logoLink}>
            <span style={styles.logoIcon}>🐟</span>
            <span style={styles.logoText}>IsdaMarket</span>
          </Link>
          <div style={styles.navLinks}>
            <Link to="/buyer-login" style={styles.navLinkSecondary}>Shop Now</Link>
            <Link to="/seller-login" style={styles.navLinkPrimary}>Sell Fish</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.badge}>
              <FiStar size={16} />
              <span>Trusted by 10,000+ customers</span>
            </div>
            <h1 style={styles.heroTitle}>
              Fresh Seafood,<br />
              <span style={styles.heroTitleGradient}>Delivered Daily</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Connect directly with local fishermen and get the freshest catch delivered straight to your door. Quality guaranteed, ocean to table.
            </p>
            <div style={styles.heroButtons}>
              <Link to="/buyer-login" style={styles.heroBtnPrimary}>
                <FiShoppingCart size={20} />
                <span>Start Shopping</span>
                <FiArrowRight size={18} />
              </Link>
              <Link to="/seller-login" style={styles.heroBtnSecondary}>
                <FiPackage size={20} />
                <span>Become a Seller</span>
              </Link>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Fresh Products</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>100+</div>
                <div style={styles.statLabel}>Local Sellers</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Support</div>
              </div>
            </div>
          </div>
          <div style={styles.heroImageSection}>
            <div style={styles.heroImageCard}>
              <div style={styles.heroImageContent}>
                <span style={styles.heroEmoji}>🐠</span>
                <span style={styles.heroEmoji}>🦐</span>
                <span style={styles.heroEmoji}>🦀</span>
                <span style={styles.heroEmoji}>🐙</span>
                <span style={styles.heroEmoji}>🦞</span>
                <span style={styles.heroEmoji}>🐟</span>
              </div>
              <div style={styles.floatingCard1}>
                <div style={styles.miniCardIcon}>⭐</div>
                <div>
                  <div style={styles.miniCardTitle}>Premium Quality</div>
                  <div style={styles.miniCardText}>Fresh daily</div>
                </div>
              </div>
              <div style={styles.floatingCard2}>
                <div style={styles.miniCardIcon}>🚚</div>
                <div>
                  <div style={styles.miniCardTitle}>Fast Delivery</div>
                  <div style={styles.miniCardText}>Same day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose IsdaMarket?</h2>
            <p style={styles.sectionSubtitle}>
              The most trusted seafood marketplace in the Philippines
            </p>
          </div>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <FiShield size={28} />
              </div>
              <h3 style={styles.featureTitle}>Quality Guaranteed</h3>
              <p style={styles.featureText}>
                Every product is verified for freshness and quality. 100% satisfaction guaranteed or your money back.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <FiTruck size={28} />
              </div>
              <h3 style={styles.featureTitle}>Fast Delivery</h3>
              <p style={styles.featureText}>
                Same-day delivery available. We ensure your seafood arrives fresh and ready to cook.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <FiAward size={28} />
              </div>
              <h3 style={styles.featureTitle}>Direct from Source</h3>
              <p style={styles.featureText}>
                Connect directly with local fishermen. No middlemen, better prices, fresher catch.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <FiClock size={28} />
              </div>
              <h3 style={styles.featureTitle}>24/7 Support</h3>
              <p style={styles.featureText}>
                Our customer service team is always ready to help. Get assistance anytime you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContainer}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Experience Fresh?</h2>
            <p style={styles.ctaText}>
              Join thousands of satisfied customers enjoying the freshest seafood delivered daily.
            </p>
            <div style={styles.ctaButtons}>
              <Link to="/buyer-login" style={styles.ctaBtnPrimary}>
                Get Started Now
                <FiArrowRight size={18} />
              </Link>
              <Link to="/seller-login" style={styles.ctaBtnSecondary}>
                Sell Your Catch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.neutral.white,
    fontFamily: typography.fontFamily.primary,
  },
  
  // Navbar
  navbar: {
    background: colors.neutral.white,
    boxShadow: shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: typography.fontWeight.bold,
    background: gradients.ocean,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: typography.fontFamily.heading,
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navLinkSecondary: {
    color: colors.primary.main,
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    border: `2px solid ${colors.primary.main}`,
    transition: 'all 0.2s ease',
  },
  navLinkPrimary: {
    color: colors.neutral.white,
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    background: gradients.ocean,
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease',
  },
  
  // Hero Section
  hero: {
    background: gradients.sky,
    padding: '6rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: colors.neutral.white,
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.main,
    boxShadow: shadows.sm,
    alignSelf: 'flex-start',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: typography.fontWeight.extrabold,
    color: colors.neutral.darkest,
    lineHeight: '1.1',
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  heroTitleGradient: {
    background: gradients.ocean,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
    color: colors.neutral.dark,
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '600px',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  heroBtnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    textDecoration: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.lg,
    boxShadow: shadows.lg,
    transition: 'all 0.3s ease',
  },
  heroBtnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: colors.neutral.white,
    color: colors.primary.main,
    textDecoration: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.lg,
    border: `2px solid ${colors.primary.main}`,
    transition: 'all 0.3s ease',
  },
  heroStats: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    marginTop: '1rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    fontFamily: typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: colors.neutral.light,
  },
  
  // Hero Image
  heroImageSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageCard: {
    position: 'relative',
    background: gradients.card,
    borderRadius: borderRadius['2xl'],
    padding: '3rem',
    boxShadow: shadows.ocean,
    border: `1px solid ${colors.neutral.light}`,
  },
  heroImageContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    fontSize: '4rem',
  },
  heroEmoji: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCard1: {
    position: 'absolute',
    top: '10%',
    right: '-10%',
    background: colors.neutral.white,
    padding: '1rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    animation: 'float 3s ease-in-out infinite',
  },
  floatingCard2: {
    position: 'absolute',
    bottom: '10%',
    left: '-10%',
    background: colors.neutral.white,
    padding: '1rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    animation: 'float 3s ease-in-out infinite 1.5s',
  },
  miniCardIcon: {
    fontSize: '2rem',
  },
  miniCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  miniCardText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  
  // Features Section
  features: {
    padding: '6rem 2rem',
    background: colors.neutral.white,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral.dark,
    margin: 0,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: colors.neutral.white,
    padding: '2.5rem',
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.neutral.light}`,
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  featureIconWrapper: {
    width: '70px',
    height: '70px',
    background: gradients.oceanLight,
    borderRadius: borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    color: colors.primary.dark,
  },
  featureTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  featureText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    lineHeight: '1.6',
    margin: 0,
  },
  
  // CTA Section
  cta: {
    background: gradients.ocean,
    padding: '6rem 2rem',
  },
  ctaContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  ctaContent: {
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  ctaText: {
    fontSize: typography.fontSize.xl,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '2.5rem',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaBtnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2.5rem',
    background: colors.neutral.white,
    color: colors.primary.main,
    textDecoration: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.lg,
    boxShadow: shadows.xl,
    transition: 'all 0.3s ease',
  },
  ctaBtnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2.5rem',
    background: 'transparent',
    color: colors.neutral.white,
    textDecoration: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.lg,
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
  },
};

export default HomePage;
