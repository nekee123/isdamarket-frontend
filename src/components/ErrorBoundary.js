import React from 'react';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ERROR CAUGHT BY BOUNDARY 🚨');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    this.setState({ hasError: true, error, errorInfo });
    
    // If it's a chunk loading error, reload the page after a short delay
    if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
      console.warn('⚠️ Chunk load error detected - will reload page in 2 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>⚠️</span>
            </div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button 
              style={styles.button}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.neutral.lightest,
    padding: '2rem',
    fontFamily: typography.fontFamily.primary,
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '3rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: shadows.xl,
    textAlign: 'center',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '4rem',
    display: 'block',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
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
  details: {
    textAlign: 'left',
    marginBottom: '2rem',
    padding: '1rem',
    background: colors.neutral.lightest,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral.light}`,
  },
  summary: {
    cursor: 'pointer',
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    overflow: 'auto',
    maxHeight: '200px',
    marginTop: '0.5rem',
  },
  button: {
    padding: '1rem 2rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    boxShadow: shadows.md,
    transition: 'all 0.2s ease',
  },
};

export default ErrorBoundary;
