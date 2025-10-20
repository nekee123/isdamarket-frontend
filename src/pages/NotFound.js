import React from "react";
import { useNavigate } from "react-router-dom";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.errorCode}>404</h1>
          <h2 style={styles.title}>Page Not Found</h2>
          <p style={styles.message}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.primaryButton}
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </button>
            <button 
              style={styles.secondaryButton}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradients.oceanLight,
    fontFamily: typography.fontFamily.primary,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    width: '100%',
  },
  content: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '3rem 2rem',
    boxShadow: shadows.card,
    textAlign: 'center',
  },
  errorCode: {
    fontSize: '6rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    margin: 0,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '0.875rem 2rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  secondaryButton: {
    padding: '0.875rem 2rem',
    background: colors.neutral.lightest,
    color: colors.primary.main,
    border: `2px solid ${colors.primary.main}`,
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default NotFound;
