import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiPhone, FiMail, FiShoppingCart, FiPackage, FiStar, FiHeart, FiFlag, FiMessageCircle } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

import { BASE_URL } from "../config/api";

function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { buyerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();
  
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(null);

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // Fetch seller info
      const sellerRes = await fetch(`${BASE_URL}/sellers/${sellerId}`);
      const sellerData = await sellerRes.json();
      setSeller(sellerData);
      
      // Fetch seller's products
      const productsRes = await fetch(`${BASE_URL}/products/?seller_uid=${sellerId}`);
      const productsData = await productsRes.json();
      setProducts(productsData);
      
      // Fetch seller's reviews
      const reviewsRes = await fetch(`${BASE_URL}/reviews/seller/${sellerId}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
      
    } catch (error) {
      console.error('Error fetching seller data:', error);
      showToast('Failed to load seller information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!buyerAuth.isAuthenticated) {
      showToast('Please log in to message the seller', 'warning');
      navigate('/buyer-login');
      return;
    }

    try {
      const messageData = {
        sender_uid: buyerAuth.uid,
        sender_type: 'buyer',
        recipient_uid: sellerId,
        recipient_type: 'seller',
        message: `Hi ${seller.name}! I'm interested in your products.`,
      };
      
      const res = await fetch(`${BASE_URL}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Backend error:', errorData);
        showToast('Failed to send message', 'error');
        return;
      }

      showToast('Message sent! Opening chat...', 'success');
      setTimeout(() => {
        navigate('/buyer-dashboard/messages');
      }, 500);
    } catch (err) {
      console.error('Error starting conversation:', err);
      showToast('Failed to send message', 'error');
    }
  };

  const handleBuyNow = async (product) => {
    if (!buyerAuth.isAuthenticated) {
      showToast('Please log in to make a purchase', 'warning');
      navigate('/buyer-login');
      return;
    }

    if (product.quantity <= 0) {
      showToast('This product is out of stock', 'error');
      return;
    }

    try {
      setPurchaseLoading(product.uid);
      
      const res = await fetch(`${BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_uid: buyerAuth.uid,
          buyer_name: buyerAuth.name,
          seller_uid: product.seller_uid,
          seller_name: product.seller_name,
          fish_product_uid: product.uid,
          fish_product_name: product.name,
          quantity: 1,
          total_price: product.price,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await res.json();
      showToast(`Order placed for ${data.fish_product_name}!`, 'success');
      
      // Refresh seller data to update stock
      fetchSellerData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleReport = () => {
    showToast('Report submitted. We will review it shortly.', 'info');
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userType="buyer" showSearch={true} />
        <LoadingSpinner fullScreen={false} />
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userType="buyer" showSearch={true} />
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🐟</span>
            <p style={styles.emptyText}>Seller not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="buyer" showSearch={true} />
      
      <div style={styles.container}>
        {/* Seller Header Card */}
        <div style={styles.sellerCard}>
          <div style={styles.sellerHeader}>
            {seller.profile_picture ? (
              <img 
                src={seller.profile_picture} 
                alt={seller.name}
                style={styles.sellerAvatarImage}
              />
            ) : (
              <div style={styles.sellerAvatar}>
                <span style={styles.avatarText}>
                  {seller.name?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
            )}
            <div style={styles.sellerInfo}>
              <h1 style={styles.sellerName}>{seller.name}</h1>
              <div style={styles.ratingSection}>
                <StarRating rating={averageRating} size={20} />
                <span style={styles.reviewCount}>({reviews.length} reviews)</span>
              </div>
              {seller.location && (
                <div style={styles.infoItem}>
                  <FiMapPin size={16} />
                  <span>{seller.location}</span>
                </div>
              )}
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.messageBtn} onClick={handleMessageSeller}>
                <FiMessageCircle size={20} />
                <span>Message Seller</span>
              </button>
              <button 
                style={{...styles.iconBtn, background: isFavorite ? colors.accent.light : colors.neutral.lightest}}
                onClick={handleFavorite}
              >
                <FiHeart size={20} fill={isFavorite ? colors.accent.main : 'none'} />
              </button>
              <button style={styles.iconBtn} onClick={handleReport}>
                <FiFlag size={20} />
              </button>
            </div>
          </div>
          
          {seller.description && (
            <p style={styles.description}>{seller.description}</p>
          )}
          
          <div style={styles.contactInfo}>
            {seller.phone && (
              <div style={styles.contactItem}>
                <FiPhone size={18} />
                <span>{seller.phone}</span>
              </div>
            )}
            {seller.email && (
              <div style={styles.contactItem}>
                <FiMail size={18} />
                <span>{seller.email}</span>
              </div>
            )}
          </div>
          
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <FiPackage size={24} color={colors.primary.main} />
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{products.length}</div>
                <div style={styles.statLabel}>Products</div>
              </div>
            </div>
            <div style={styles.statBox}>
              <FiStar size={24} color={colors.warning} />
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{averageRating.toFixed(1)}</div>
                <div style={styles.statLabel}>Rating</div>
              </div>
            </div>
            <div style={styles.statBox}>
              <FiShoppingCart size={24} color={colors.success} />
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{reviews.length}</div>
                <div style={styles.statLabel}>Sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Products ({products.length})</h2>
          {products.length === 0 ? (
            <div style={styles.emptySection}>
              <p style={styles.emptyText}>No products listed yet</p>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product.uid} style={styles.productCard}>
                  <div style={styles.imageContainer}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={styles.productImage} />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <span style={styles.placeholderIcon}>🐟</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productDesc}>{product.description}</p>
                    <div style={styles.productFooter}>
                      <div>
                        <div style={styles.price}>₱{product.price}</div>
                        <div style={styles.stock}>Stock: {product.quantity}</div>
                      </div>
                      <button 
                        style={{
                          ...styles.buyBtn,
                          opacity: purchaseLoading === product.uid || product.quantity <= 0 ? 0.6 : 1,
                          cursor: purchaseLoading === product.uid || product.quantity <= 0 ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => handleBuyNow(product)}
                        disabled={purchaseLoading === product.uid || product.quantity <= 0}
                      >
                        <FiShoppingCart size={16} />
                        <span>{purchaseLoading === product.uid ? 'Buying...' : product.quantity <= 0 ? 'Out of Stock' : 'Buy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Customer Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div style={styles.emptySection}>
              <div style={styles.emptyReviewIcon}>⭐</div>
              <p style={styles.emptyText}>No reviews yet — be the first to leave feedback!</p>
              <p style={styles.emptySubtext}>
                Purchase from this seller and share your experience with the community.
              </p>
            </div>
          ) : (
            <div style={styles.reviewsGrid}>
              {reviews.map((review) => (
                <ReviewCard key={review.uid} review={review} />
              ))}
            </div>
          )}
        </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '6rem 2rem 2rem 2rem',
    width: '100%',
  },
  sellerCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '2rem',
    boxShadow: shadows.card,
    marginBottom: '2rem',
    border: `1px solid ${colors.neutral.light}`,
  },
  sellerHeader: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    alignItems: 'flex-start',
  },
  sellerAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: borderRadius.full,
    background: gradients.oceanLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sellerAvatarImage: {
    width: '100px',
    height: '100px',
    borderRadius: borderRadius.full,
    objectFit: 'cover',
    flexShrink: 0,
    border: `3px solid ${colors.primary.main}`,
  },
  avatarText: {
    fontSize: '3rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.dark,
    fontFamily: typography.fontFamily.heading,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  reviewCount: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.neutral.dark,
    fontSize: typography.fontSize.sm,
  },
  actionButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  messageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: borderRadius.full,
    border: `2px solid ${colors.primary.main}`,
    background: colors.neutral.white,
    color: colors.primary.main,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  iconBtn: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.full,
    border: 'none',
    background: colors.neutral.lightest,
    color: colors.neutral.dark,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  contactInfo: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.primary.main,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: colors.neutral.lightest,
    borderRadius: borderRadius.lg,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    fontFamily: typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  productCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.sm,
    border: `1px solid ${colors.neutral.light}`,
    transition: 'all 0.2s ease',
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    background: gradients.oceanLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: '4rem',
  },
  productInfo: {
    padding: '1rem',
  },
  productName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
  },
  productDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.dark,
    lineHeight: '1.4',
    marginBottom: '0.75rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '0.75rem',
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    fontFamily: typography.fontFamily.heading,
  },
  stock: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  buyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.xs,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  reviewsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptySection: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral.light}`,
  },
  emptyIcon: {
    fontSize: '5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    fontWeight: typography.fontWeight.medium,
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    lineHeight: '1.5',
  },
  emptyReviewIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
};

export default SellerProfile;
