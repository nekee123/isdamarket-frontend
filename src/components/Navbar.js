import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';
import './Navbar.css';

const Navbar = ({ userType, showSearch = false, onSearch }) => {
  const navigate = useNavigate();
  const { buyerAuth, sellerAuth, logoutBuyer, logoutSeller } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (userType === 'buyer') {
      logoutBuyer();
      navigate('/');
    } else if (userType === 'seller') {
      logoutSeller();
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const auth = userType === 'buyer' ? buyerAuth : sellerAuth;
  const dashboardPath = userType === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard';

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to={auth.isAuthenticated ? dashboardPath : '/'} style={styles.logoLink}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🐟</span>
            <span style={styles.logoText}>IsdaMarket</span>
          </div>
        </Link>

        {/* Search Bar - Desktop Only */}
        {showSearch && auth.isAuthenticated && (
          <form onSubmit={handleSearch} style={styles.searchForm} className="desktop-search">
            <div style={styles.searchWrapper}>
              <FiSearch style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search fresh fish, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </form>
        )}

        {/* Right Side Navigation - Desktop */}
        <div style={styles.navRight} className="desktop-nav">
          {auth.isAuthenticated ? (
            <>
              <NotificationDropdown 
                userType={userType} 
                userId={auth.uid}
              />
              <div style={styles.userMenu}>
                <FiUser size={18} />
                <span style={styles.userName}>{auth.name}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <FiLogOut size={18} />
                <span style={styles.btnText}>Logout</span>
              </button>
            </>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/buyer-login" style={styles.linkSecondary}>Shop Now</Link>
              <Link to="/seller-login" style={styles.linkPrimary}>Sell Fish</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button style={styles.mobileMenuBtn} className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu} className="mobile-menu">
          {/* Mobile Search */}
          {showSearch && auth.isAuthenticated && (
            <form onSubmit={handleSearch} style={styles.mobileSearchForm}>
              <div style={styles.searchWrapper}>
                <FiSearch style={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Search fresh fish, sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </form>
          )}

          {/* Mobile Navigation Items */}
          {auth.isAuthenticated ? (
            <div style={styles.mobileNavItems}>
              <div style={styles.mobileUserInfo}>
                <FiUser size={20} />
                <span>{auth.name}</span>
              </div>
              <div style={styles.mobileDivider}></div>
              <NotificationDropdown 
                userType={userType} 
                userId={auth.uid}
              />
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={styles.mobileLogoutBtn}>
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={styles.mobileAuthLinks}>
              <Link to="/buyer-login" style={styles.mobileLinkSecondary} onClick={() => setMobileMenuOpen(false)}>Shop Now</Link>
              <Link to="/seller-login" style={styles.mobileLinkPrimary} onClick={() => setMobileMenuOpen(false)}>Sell Fish</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    background: colors.neutral.white,
    boxShadow: shadows.md,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  logoLink: {
    textDecoration: 'none',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(8, 145, 178, 0.3))',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: typography.fontWeight.bold,
    background: gradients.ocean,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: typography.fontFamily.heading,
    letterSpacing: '-0.5px',
  },
  searchForm: {
    flex: 1,
    maxWidth: '600px',
    minWidth: '300px',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.neutral.medium,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
    background: colors.neutral.lightest,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0,
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: colors.neutral.lightest,
    borderRadius: borderRadius.full,
    color: colors.neutral.darker,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
  },
  userName: {
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.full,
    cursor: 'pointer',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  btnText: {
    display: 'inline',
  },
  authLinks: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  linkSecondary: {
    color: colors.primary.main,
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    border: `2px solid ${colors.primary.main}`,
    transition: 'all 0.2s ease',
    background: 'transparent',
  },
  linkPrimary: {
    color: colors.neutral.white,
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    background: gradients.ocean,
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: colors.primary.main,
    cursor: 'pointer',
    padding: '0.5rem',
  },
  mobileMenu: {
    display: 'none',
    background: colors.neutral.white,
    borderTop: `1px solid ${colors.neutral.light}`,
    padding: '1rem',
    boxShadow: shadows.md,
  },
  mobileSearchForm: {
    marginBottom: '1rem',
  },
  mobileNavItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: colors.neutral.lightest,
    borderRadius: borderRadius.md,
    color: colors.neutral.darker,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.base,
  },
  mobileDivider: {
    height: '1px',
    background: colors.neutral.light,
    margin: '0.5rem 0',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    padding: '1rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    boxShadow: shadows.sm,
  },
  mobileAuthLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  mobileLinkSecondary: {
    color: colors.primary.main,
    textDecoration: 'none',
    padding: '1rem',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    border: `2px solid ${colors.primary.main}`,
    textAlign: 'center',
    background: 'transparent',
  },
  mobileLinkPrimary: {
    color: colors.neutral.white,
    textDecoration: 'none',
    padding: '1rem',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    background: gradients.ocean,
    textAlign: 'center',
    boxShadow: shadows.sm,
  },
};

export default Navbar;
