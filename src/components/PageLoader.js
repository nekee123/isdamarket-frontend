import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const PageLoader = ({ message = "Please wait for a while...", submessage = "Loading content" }) => {
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      <div style={styles.loadingOverlay}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingIcon}>🐟</div>
          <LoadingSpinner size="lg" />
          <div style={styles.loadingText}>{message}</div>
          <div style={styles.loadingSubtext}>{submessage}</div>
        </div>
      </div>
    </>
  );
};

const styles = {
  loadingOverlay: {
    position: 'fixed',
    top: '70px', // Below navbar
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradients.oceanLight,
    zIndex: 1000,
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '3rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.lg,
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 1rem',
  },
  loadingIcon: {
    fontSize: '4rem',
    animation: 'float 2s ease-in-out infinite',
  },
  loadingText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    fontFamily: typography.fontFamily.heading,
  },
  loadingSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    marginTop: '-0.5rem',
  },
};

export default PageLoader;
