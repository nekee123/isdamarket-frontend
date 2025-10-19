import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiArrowLeft } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

import { BASE_URL } from "../config/api";

function SellerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sellerAuth, loginSeller } = useAuth();
  const { showToast, ToastContainer } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (sellerAuth.isAuthenticated) {
      navigate("/seller-dashboard");
    }
  }, [sellerAuth.isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(`${BASE_URL}/sellers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Login failed" }));
        showToast(errorData.detail || "Check your credentials", "error");
        return;
      }

      const data = await res.json();
      loginSeller(data.token, data.uid, data.name, data.profile_picture);
      showToast("Login successful!", "success");
      navigate("/seller-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === 'AbortError') {
        showToast("Request timeout. Please check your connection and try again.", "error");
      } else if (err.message.includes('Failed to fetch')) {
        showToast("Cannot connect to server. Make sure the backend is running.", "error");
      } else {
        showToast("Connection error: " + err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const contact_number = form.contact.value;
    const location = form.location.value;
    const password = form.password.value;

    // Validate inputs
    if (!name.trim() || !email.trim() || !contact_number.trim() || !location.trim() || !password.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(`${BASE_URL}/sellers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact_number, location, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Sign up failed" }));
        showToast(errorData.detail || "Unknown error", "error");
        return;
      }

      const data = await res.json();
      loginSeller(data.token, data.uid, data.name, data.profile_picture);
      showToast("Account created successfully!", "success");
      navigate("/seller-dashboard");
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.name === 'AbortError') {
        showToast("Request timeout. Server might be slow. Please try again.", "error");
      } else if (err.message.includes('Failed to fetch')) {
        showToast("Cannot connect to server. Make sure the backend is running at " + BASE_URL, "error");
      } else {
        showToast("Connection error: " + err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      
      {/* Background decorations */}
      <div style={styles.bgDecoration1}></div>
      <div style={styles.bgDecoration2}></div>
      
      <div style={styles.container}>
        <Link to="/" style={styles.backButton}>
          <FiArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div style={styles.formCard}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>🐟</span>
            </div>
            <h1 style={styles.title}>
              {isLogin ? "Seller Portal" : "Start Selling Fish"}
            </h1>
            <p style={styles.subtitle}>
              {isLogin ? "Manage your fish market business" : "Create your seller account"}
            </p>
          </div>

          <div style={styles.tabContainer}>
            <button 
              onClick={() => setIsLogin(true)}
              style={{...styles.tab, ...(isLogin ? styles.tabActive : {})}}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              style={{...styles.tab, ...(!isLogin ? styles.tabActive : {})}}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <FiMail size={18} style={styles.inputIcon} />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <FiLock size={18} style={styles.inputIcon} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Business Name</label>
                <div style={styles.inputWrapper}>
                  <FiUser size={18} style={styles.inputIcon} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Fish Market Name" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <FiMail size={18} style={styles.inputIcon} />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Contact Number</label>
                <div style={styles.inputWrapper}>
                  <FiPhone size={18} style={styles.inputIcon} />
                  <input 
                    type="text" 
                    name="contact" 
                    placeholder="09XX XXX XXXX" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Location</label>
                <div style={styles.inputWrapper}>
                  <FiMapPin size={18} style={styles.inputIcon} />
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="e.g., Manila, Cebu" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <FiLock size={18} style={styles.inputIcon} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : "Create Seller Account"}
              </button>
            </form>
          )}

          <div style={styles.footer}>
            <p style={styles.footerText}>
              {isLogin ? "Looking to buy fish?" : "Want to buy instead?"}{" "}
              <Link to="/buyer-login" style={styles.footerLink}>
                Buyer Login
              </Link>
            </p>
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
    position: 'relative',
    overflow: 'hidden',
    fontFamily: typography.fontFamily.primary,
  },
  bgDecoration1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '400px',
    height: '400px',
    background: `${colors.primary.light}30`,
    borderRadius: borderRadius.full,
    filter: 'blur(80px)',
  },
  bgDecoration2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '350px',
    height: '350px',
    background: `${colors.accent.light}30`,
    borderRadius: borderRadius.full,
    filter: 'blur(80px)',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    position: 'relative',
    zIndex: 1,
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    padding: '0.5rem 1rem',
    background: colors.neutral.white,
    color: colors.neutral.darkest,
    textDecoration: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease',
  },
  formCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '2.5rem',
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral.light}`,
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconWrapper: {
    marginBottom: '1rem',
  },
  icon: {
    fontSize: '4rem',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    background: colors.neutral.lightest,
    padding: '0.25rem',
    borderRadius: borderRadius.full,
  },
  tab: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'transparent',
    color: colors.neutral.dark,
  },
  tabActive: {
    background: gradients.ocean,
    color: colors.neutral.white,
    boxShadow: shadows.sm,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.neutral.medium,
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: typography.fontFamily.primary,
  },
  submitButton: {
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
    marginTop: '0.5rem',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
  },
  footerLink: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
    textDecoration: 'none',
  },
};

export default SellerLogin;
