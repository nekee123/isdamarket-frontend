import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiPackage, FiUser } from 'react-icons/fi';
import { colors, shadows, borderRadius, typography } from '../styles/theme';

const MobileNav = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyerTabs = [
    { path: '/buyer-dashboard', icon: FiHome, label: 'Home' },
    { path: '/buyer-dashboard/browse', icon: FiShoppingBag, label: 'Browse' },
    { path: '/buyer-dashboard/orders', icon: FiPackage, label: 'Orders' },
    { path: '/buyer-dashboard/settings', icon: FiUser, label: 'Account' },
  ];

  const sellerTabs = [
    { path: '/seller-dashboard', icon: FiHome, label: 'Home' },
    { path: '/seller-dashboard/products', icon: FiShoppingBag, label: 'Products' },
    { path: '/seller-dashboard/orders', icon: FiPackage, label: 'Orders' },
    { path: '/seller-dashboard/settings', icon: FiUser, label: 'Account' },
  ];

  const tabs = userType === 'buyer' ? buyerTabs : sellerTabs;

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.mobileNav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);
        
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              ...styles.navItem,
              color: active ? colors.primary.main : colors.neutral.medium,
            }}
          >
            <Icon size={24} />
            <span style={{
              ...styles.navLabel,
              color: active ? colors.primary.main : colors.neutral.medium,
              fontWeight: active ? typography.fontWeight.semibold : typography.fontWeight.normal,
            }}>
              {tab.label}
            </span>
            {active && <div style={styles.activeIndicator} />}
          </button>
        );
      })}
    </nav>
  );
};

const styles = {
  mobileNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: colors.neutral.white,
    borderTop: `1px solid ${colors.neutral.light}`,
    padding: '0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))',
    boxShadow: shadows.lg,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  navLabel: {
    fontSize: typography.fontSize.xs,
    transition: 'all 0.2s ease',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '32px',
    height: '3px',
    background: colors.primary.main,
    borderRadius: borderRadius.full,
  },
};

export default MobileNav;
