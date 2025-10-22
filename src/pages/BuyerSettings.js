import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import BackButton from "../components/BackButton";
import { useToast } from "../components/Toast";
import { FiUser, FiMail, FiPhone, FiCamera, FiSave } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { BASE_URL } from "../config/api";

function BuyerSettings() {
  const [buyer, setBuyer] = useState({ name: "", email: "", contact_number: "", profile_picture: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { buyerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (buyerAuth.isAuthenticated) {
      fetchBuyer();
    }
  }, [buyerAuth.uid]);

  const fetchBuyer = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/buyers/${buyerAuth.uid}`);
      const data = await res.json();
      setBuyer({ 
        name: data.name, 
        email: data.email, 
        contact_number: data.contact_number,
        profile_picture: data.profile_picture || ""
      });
      if (data.profile_picture) {
        setImagePreview(data.profile_picture);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300; // ID card size for profile
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setImagePreview(compressedImage);
          setBuyer({...buyer, profile_picture: compressedImage});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/buyers/${buyerAuth.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyer),
      });
      if (res.ok) {
        // Update localStorage with new profile data
        localStorage.setItem('buyer_name', buyer.name);
        if (buyer.profile_picture) {
          localStorage.setItem('buyer_profile_picture', buyer.profile_picture);
        }
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userType="buyer" showSearch={false} />
        <LoadingSpinner fullScreen={false} />
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="buyer" showSearch={false} />
      <BackButton to="/buyer-dashboard" />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Account Settings</h1>
          <p style={styles.subtitle}>Manage your buyer profile information</p>
        </div>

        <form onSubmit={handleUpdate} style={styles.formCard}>
          {/* Profile Picture Section */}
          <div style={styles.profileSection}>
            <div style={styles.avatarWrapper}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {buyer.name ? buyer.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <label style={styles.changePhotoBtn}>
                <FiCamera size={18} />
                <span>Change Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FiUser size={16} />
                <span>Full Name</span>
              </label>
              <input 
                style={styles.input}
                value={buyer.name} 
                onChange={e => setBuyer({...buyer, name:e.target.value})} 
                placeholder="Juan Dela Cruz" 
                required 
                disabled={saving}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FiMail size={16} />
                <span>Email Address</span>
              </label>
              <input 
                style={styles.input}
                value={buyer.email} 
                onChange={e => setBuyer({...buyer, email:e.target.value})} 
                placeholder="your@email.com" 
                type="email"
                required 
                disabled={saving}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FiPhone size={16} />
                <span>Contact Number</span>
              </label>
              <input 
                style={styles.input}
                value={buyer.contact_number} 
                onChange={e => setBuyer({...buyer, contact_number:e.target.value})} 
                placeholder="09XX XXX XXXX" 
                required 
                disabled={saving}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={saving}
          >
            {saving ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.neutral.lightest,
    fontFamily: typography.fontFamily.primary,
  },
  container: {
    flex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    paddingTop: '6rem',
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
  },
  formCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '2.5rem',
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
  },
  profileSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: borderRadius.full,
    objectFit: 'cover',
    border: `4px solid ${colors.primary.main}`,
    boxShadow: shadows.lg,
  },
  avatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: borderRadius.full,
    background: gradients.ocean,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.neutral.white,
    fontSize: '4rem',
    fontWeight: typography.fontWeight.bold,
    boxShadow: shadows.lg,
    fontFamily: typography.fontFamily.heading,
  },
  changePhotoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: colors.neutral.lightest,
    color: colors.neutral.darkest,
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `2px solid ${colors.neutral.light}`,
  },
  fileInput: {
    display: 'none',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: typography.fontFamily.primary,
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
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
    marginTop: '2rem',
  },
};

export default BuyerSettings;
