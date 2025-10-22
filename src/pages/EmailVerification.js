import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import { FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { BASE_URL } from "../config/api";

function EmailVerification() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No verification token provided');
      setLoading(false);
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      
      const res = await fetch(`${BASE_URL}/auth/verify/confirm?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Verification failed' }));
        throw new Error(errorData.detail || 'Verification failed');
      }

      setVerified(true);
      showToast('Email verified successfully!', 'success');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/buyer-login?verified=1');
      }, 2000);
      
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/buyer-login');
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <ToastContainer />
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <LoadingSpinner size="lg" />
            <p style={styles.loadingText}>Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            {verified ? (
              <FiCheckCircle size={64} style={styles.successIcon} />
            ) : (
              <FiXCircle size={64} style={styles.errorIcon} />
            )}
          </div>
          
          <h1 style={styles.title}>
            {verified ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          
          <p style={styles.message}>
            {verified 
              ? 'Your email has been successfully verified. You can now log in to your account.'
              : error || 'There was a problem verifying your email. The link may have expired or been used already.'
            }
          </p>
          
          <div style={styles.actions}>
            <button 
              onClick={handleBackToLogin}
              style={styles.primaryButton}
            >
              {verified ? 'Go to Login' : 'Back to Login'}
            </button>
            
            {!verified && (
              <button 
                onClick={() => navigate('/buyer-login')}
                style={styles.secondaryButton}
              >
                <FiArrowLeft size={16} />
                Try Again
              </button>
            )}
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
    padding: '2rem',
    fontFamily: typography.fontFamily.primary,
  },
  container: {
    width: '100%',
    maxWidth: '480px',
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '3rem 2rem',
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral.light}`,
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    margin: 0,
  },
  iconContainer: {
    marginBottom: '2rem',
  },
  successIcon: {
    color: colors.success,
  },
  errorIcon: {
    color: colors.error,
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
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    color: colors.neutral.dark,
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default EmailVerification;
