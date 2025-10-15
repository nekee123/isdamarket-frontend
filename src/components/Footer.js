import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { colors, gradients, typography, borderRadius } from '../styles/theme';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand Column */}
          <div style={styles.column}>
            <div style={styles.brandSection}>
              <span style={styles.logoIcon}>🐟</span>
              <h3 style={styles.brandName}>IsdaMarket</h3>
            </div>
            <p style={styles.description}>
              Your trusted online seafood marketplace. Fresh catch, delivered from local fishermen directly to your door.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon} aria-label="Facebook">
                <FiFacebook size={18} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Twitter">
                <FiTwitter size={18} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Instagram">
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.column}>
            <h4 style={styles.columnHeading}>Marketplace</h4>
            <ul style={styles.linkList}>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/buyer-login" style={styles.link}>Shop Seafood</Link></li>
              <li><Link to="/seller-login" style={styles.link}>Become a Seller</Link></li>
              <li><a href="#" style={styles.link}>Featured Products</a></li>
            </ul>
          </div>

          {/* Support */}
          <div style={styles.column}>
            <h4 style={styles.columnHeading}>Support</h4>
            <ul style={styles.linkList}>
              <li><a href="#" style={styles.link}>Help Center</a></li>
              <li><a href="#" style={styles.link}>Shipping Info</a></li>
              <li><a href="#" style={styles.link}>Returns & Refunds</a></li>
              <li><a href="#" style={styles.link}>FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div style={styles.column}>
            <h4 style={styles.columnHeading}>Get in Touch</h4>
            <div style={styles.contactInfo}>
              <a href="mailto:support@isdamarket.com" style={styles.contactItem}>
                <FiMail size={18} />
                <span>support@isdamarket.com</span>
              </a>
              <a href="tel:+631234567890" style={styles.contactItem}>
                <FiPhone size={18} />
                <span>+63 123 456 7890</span>
              </a>
              <div style={styles.contactItem}>
                <FiMapPin size={18} />
                <span>Manila, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} IsdaMarket. All rights reserved.
          </p>
          <div style={styles.legalLinks}>
            <a href="#" style={styles.legalLink}>Privacy Policy</a>
            <span style={styles.separator}>•</span>
            <a href="#" style={styles.legalLink}>Terms of Service</a>
            <span style={styles.separator}>•</span>
            <a href="#" style={styles.legalLink}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: colors.neutral.darkest,
    color: colors.neutral.lighter,
    padding: '4rem 0 2rem',
    marginTop: 'auto',
    borderTop: `4px solid ${colors.primary.main}`,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(8, 145, 178, 0.5))',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
    background: gradients.oceanLight,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  description: {
    fontSize: typography.fontSize.sm,
    lineHeight: '1.6',
    color: colors.neutral.medium,
    maxWidth: '300px',
  },
  socialLinks: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  socialIcon: {
    color: colors.neutral.lighter,
    background: colors.neutral.darker,
    padding: '0.75rem',
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  columnHeading: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    color: colors.neutral.medium,
    textDecoration: 'none',
    fontSize: typography.fontSize.sm,
    transition: 'color 0.2s ease',
    display: 'inline-block',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  bottom: {
    borderTop: `1px solid ${colors.neutral.darker}`,
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    margin: 0,
  },
  legalLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legalLink: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  separator: {
    color: colors.neutral.darker,
  },
};

export default Footer;
