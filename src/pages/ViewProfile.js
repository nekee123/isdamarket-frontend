import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FiMapPin, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function ViewProfile() {
  const { id } = useParams(); // user id from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Try fetching as seller first, then buyer
    const fetchProfile = async () => {
      try {
        // Try seller endpoint
        let res = await fetch(`${BASE_URL}/sellers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserType("Seller");
          return;
        }

        // Try buyer endpoint
        res = await fetch(`${BASE_URL}/buyers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserType("Buyer");
          return;
        }

        throw new Error("User not found");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser({ error: true, message: "Failed to load profile" });
      }
    };

    fetchProfile();
  }, [id]);

  if (!user) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  if (user.error) {
    return (
      <div style={styles.container}>
        <BackButton />
        <p style={{ color: "red" }}>{user.message}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.card}>
        {/* Profile Picture / Avatar */}
        <div style={styles.avatarSection}>
          {user.profile_picture ? (
            <img 
              src={user.profile_picture} 
              alt={user.name}
              style={styles.profileImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{
            ...styles.avatar,
            display: user.profile_picture ? 'none' : 'flex'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
        </div>

        {/* User Info */}
        <div style={styles.userInfo}>
          <h2 style={styles.name}>{user.name}</h2>
          <div style={styles.badge}>
            <FiUser size={14} />
            <span>{userType}</span>
          </div>
        </div>

        {/* Contact Details */}
        <div style={styles.detailsSection}>
          {user.location && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>
                <FiMapPin size={18} />
              </div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Location</div>
                <div style={styles.detailValue}>{user.location}</div>
              </div>
            </div>
          )}

          {user.email && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>
                <FiMail size={18} />
              </div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>{user.email}</div>
              </div>
            </div>
          )}

          {user.contact_number && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>
                <FiPhone size={18} />
              </div>
              <div style={styles.detailContent}>
                <div style={styles.detailLabel}>Contact Number</div>
                <div style={styles.detailValue}>{user.contact_number}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '1rem',
    paddingTop: '70px',
    background: colors.neutral.lightest,
    fontFamily: typography.fontFamily.primary,
  },
  card: {
    background: colors.neutral.white,
    padding: '2rem',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    maxWidth: '600px',
    margin: '0 auto',
    border: `1px solid ${colors.neutral.light}`,
  },
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.full,
    background: gradients.oceanLight,
    color: colors.primary.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
    border: `4px solid ${colors.neutral.white}`,
    boxShadow: shadows.md,
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.full,
    objectFit: 'cover',
    border: `4px solid ${colors.neutral.white}`,
    boxShadow: shadows.md,
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.75rem',
    fontFamily: typography.fontFamily.heading,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: gradients.oceanLight,
    color: colors.primary.dark,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    background: colors.neutral.lightest,
    borderRadius: borderRadius.lg,
    transition: 'all 0.2s ease',
  },
  detailIcon: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.lg,
    background: gradients.oceanLight,
    color: colors.primary.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    fontWeight: typography.fontWeight.medium,
    wordBreak: 'break-word',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    container: {
      padding: '0.75rem',
      paddingTop: '60px',
    },
    card: {
      padding: '1.5rem',
    },
    avatar: {
      width: '100px',
      height: '100px',
      fontSize: '3rem',
    },
    profileImage: {
      width: '100px',
      height: '100px',
    },
    name: {
      fontSize: typography.fontSize.xl,
    },
  },
};

export default ViewProfile;
