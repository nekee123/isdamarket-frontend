import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';
import { colors, shadows, borderRadius, typography } from '../styles/theme';
import NotificationDropdown from './NotificationDropdown';

const MobileHeader = ({ title, showSearch, onSearch, userType, userId }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.topBar}>
        <div style={styles.logoSection}>
          <span style={styles.logo}>🐟</span>
          <h1 style={styles.title}>{title || 'IsdaMarket'}</h1>
        </div>
        <div style={styles.actions}>
          <NotificationDropdown userType={userType} userId={userId} />
        </div>
      </div>
      
      {showSearch && (
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchWrapper}>
            <FiSearch style={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search fresh fish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </form>
      )}
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: colors.neutral.white,
    borderBottom: `1px solid ${colors.neutral.light}`,
    boxShadow: shadows.sm,
    zIndex: 999,
    paddingTop: 'env(safe-area-inset-top)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logo: {
    fontSize: '1.75rem',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  searchForm: {
    padding: '0 1rem 1rem',
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
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    background: colors.neutral.lightest,
  },
};

export default MobileHeader;
