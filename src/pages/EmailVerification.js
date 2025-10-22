import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import { FiCheckCircle, FiXCircle, FiMail } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { BASE_URL } from "../config/api";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { showToast, ToastContainer } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided');
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);
      
      const res = await fetch(`${BASE_URL}/auth/verify/confirm?token=${token}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Verification failed" }));
        setError(errorData.detail || "Verification failed");
        return;
      }

      setSuccess(true);
      showToast("Email verified successfully! You can now log in.", "success");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/buyer-login?verified=1");
      }, 3000);
      
    } catch (err) {
      console.error("Verification error:", err);
      setError("Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <ToastContainer />
        <div style={styles.container}>
          <div style={styles.card}>
            <LoadingSpinner size="lg" />
            <h2 style={styles.title}>Verifying your email...</h2>
            <p style={styles.subtitle}>Please wait while we confirm your email address.</p>
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
          {success ? (
            <>
              <div style={styles.successIcon}>
                <FiCheckCircle size={64} />
              </div>
              <h2 style={styles.title}>Email Verified!</h2>
              <p style={styles.subtitle}>
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <button 
                onClick={() => navigate("/buyer-login?verified=1")}
                style={styles.loginButton}
              >
                Go to Login
              </button>
            </>
          ) : (
            <>
              <div style={styles.errorIcon}>
                <FiXCircle size={64} />
              </div>
              <h2 style={styles.title}>Verification Failed</h2>
              <p style={styles.subtitle}>
                {error || "We couldn't verify your email. The link may be expired or invalid."}
              </p>
              <div style={styles.actions}>
                <button 
                  onClick={() => navigate("/buyer-login")}
                  style={styles.loginButton}
                >
                  Back to Login
                </button>
                <button 
                  onClick={() => navigate("/")}
                  style={styles.homeButton}
                >
                  Go to Home
                </button>
              </div>
            </>
          )}
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
    maxWidth: '500px',
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '3rem 2rem',
    boxShadow: shadows.lg,
    textAlign: 'center',
    border: `1px solid ${colors.neutral.light}`,
  },
  successIcon: {
    color: colors.success,
    marginBottom: '1.5rem',
  },
  errorIcon: {
    color: colors.error,
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  loginButton: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    cursor: 'pointer',
    background: gradients.ocean,
    color: colors.neutral.white,
    boxShadow: shadows.md,
    transition: 'all 0.2s ease',
  },
  homeButton: {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    background: 'transparent',
    color: colors.neutral.dark,
    transition: 'all 0.2s ease',
  },
};

export default EmailVerification;
