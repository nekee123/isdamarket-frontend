import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import MessageHistoryDropdown from './MessageHistoryDropdown';
import MessageModal from './MessageModal';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const Navbar = ({ userType, showSearch = false, onSearch }) => {
  const navigate = useNavigate();
  const { buyerAuth, sellerAuth, logoutBuyer, logoutSeller } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageModal, setMessageModal] = useState({ isOpen: false, recipientId: null, recipientName: '' });

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

  const handleOpenChat = ({ recipientId, recipientName }) => {
    setMessageModal({
      isOpen: true,
      recipientId,
      recipientName,
    });
  };

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

        {/* Search Bar - Centered and Prominent */}
        {showSearch && auth.isAuthenticated && (
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchWrapper}>
              <FiSearch style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search fresh seafood, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </form>
        )}

        {/* Right Side Navigation */}
        <div style={styles.navRight}>
          {auth.isAuthenticated ? (
            <>
              <MessageHistoryDropdown
                userType={userType}
                userId={auth.uid}
                onOpenChat={handleOpenChat}
              />
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
        <button style={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Message Modal */}
      {auth.isAuthenticated && (
        <MessageModal
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal({ isOpen: false, recipientId: null, recipientName: '' })}
          userType={userType}
          userId={auth.uid}
          recipientId={messageModal.recipientId}
          recipientName={messageModal.recipientName}
        />
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    background: colors.neutral.white,
    boxShadow: shadows.md,
    position: 'sticky',
    top: 0,
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
};

export default Navbar;
