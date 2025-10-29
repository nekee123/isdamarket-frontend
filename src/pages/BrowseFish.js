import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import PageLoader from "../components/PageLoader";
import BackButton from "../components/BackButton";
import { useToast } from "../components/Toast";
import { FiShoppingCart, FiMapPin, FiPackage, FiStar, FiUser, FiMessageCircle } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { getAllProducts, createOrder } from "../services/api";

function BrowseFish() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sellerGroups, setSellerGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const { buyerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();

  // Fetch products from backend with caching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use cached API call for better performance
        const data = await getAllProducts(true);
        console.log("Fetched products:", data);
        setProducts(data);
        setFilteredProducts(data);
        groupProductsBySeller(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        showToast("Failed to load products. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [showToast]);

  const groupProductsBySeller = useCallback((productList) => {
    const grouped = productList.reduce((acc, product) => {
      const sellerKey = product.seller_uid;
      if (!acc[sellerKey]) {
        acc[sellerKey] = {
          seller_name: product.seller_name,
          seller_uid: product.seller_uid,
          seller_location: product.seller_location,
          products: []
        };
      }
      acc[sellerKey].products.push(product);
      return acc;
    }, {});
    setSellerGroups(grouped);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.seller_name.toLowerCase().includes(lowerQuery) ||
      (product.seller_location && product.seller_location.toLowerCase().includes(lowerQuery))
    );
    
    setFilteredProducts(filtered);
    groupProductsBySeller(filtered);
    
    if (filtered.length === 0) {
      showToast(`No results found for "${query}"`, "info");
    }
  }, [products, groupProductsBySeller, showToast]);

  // Message function removed - buyers can contact sellers via phone number

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredProducts(products);
    groupProductsBySeller(products);
  }, [products, groupProductsBySeller]);

  const handleBuyNow = useCallback(async (product) => {
    if (!buyerAuth.isAuthenticated) {
      showToast("Please log in as a buyer first.", "warning");
      navigate('/buyer-login');
      return;
    }

    if (product.quantity <= 0) {
      showToast('This product is out of stock', 'error');
      return;
    }

    try {
      setPurchaseLoading(product.uid);
      
      const orderData = {
        buyer_uid: buyerAuth.uid,
        buyer_name: buyerAuth.name,
        seller_uid: product.seller_uid,
        seller_name: product.seller_name,
        fish_product_uid: product.uid,
        fish_product_name: product.name,
        quantity: 1,
        total_price: product.price,
      };

      const data = await createOrder(orderData);
      showToast(`Order placed for ${data.fish_product_name}!`, "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to place order. Please try again.", "error");
    } finally {
      setPurchaseLoading(null);
    }
  }, [buyerAuth, navigate, showToast]);

  if (loading) {
    return (
      <>
        <Navbar userType="buyer" showSearch={true} />
        <PageLoader message="Please wait for a while..." submessage="Loading fresh fish products" />
      </>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="buyer" showSearch={true} onSearch={handleSearch} />
      <BackButton to="/buyer-dashboard" />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Fresh Fish Marketplace</h1>
          <p style={styles.subtitle}>Discover the finest catches from local fishermen across the Philippines</p>
          {searchQuery && (
            <p style={styles.searchInfo}>
              Showing results for: <strong>"{searchQuery}"</strong>
              <button 
                style={styles.clearSearchBtn}
                onClick={handleClearSearch}
              >
                Clear search
              </button>
            </p>
          )}
        </div>
        
        {Object.keys(sellerGroups).length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🐠</span>
            <p style={styles.emptyText}>No products available at the moment</p>
            <p style={styles.emptySubtext}>Check back soon for fresh catches!</p>
          </div>
        ) : (
          <>
            {Object.values(sellerGroups).map((seller) => (
              <div key={seller.seller_uid} style={styles.sellerSection}>
                <div style={styles.sellerHeader}>
                  <div>
                    <h2 
                      style={{...styles.sellerName, cursor: 'pointer'}}
                      onClick={() => navigate(`/seller/${seller.seller_uid}`)}
                    >
                      🏪 {seller.seller_name}'s Shop
                    </h2>
                    <div style={styles.sellerInfo}>
                      <span style={styles.infoItem}>
                        <FiMapPin size={16} />
                        {seller.seller_location || 'Location not specified'}
                      </span>
                      <span style={styles.infoItem}>
                        <FiPackage size={16} />
                        {seller.products.length} product(s) available
                      </span>
                    </div>
                  </div>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.profileBtn}
                      onClick={() => navigate(`/seller/${seller.seller_uid}`)}
                    >
                      <FiUser size={18} />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
                
                <div style={styles.productGrid}>
                  {seller.products.map((p) => (
                    <div key={p.uid} style={styles.productCard}>
                      <div style={styles.imageContainer}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={styles.productImage} />
                        ) : (
                          <div style={styles.placeholderImage}>
                            <span style={styles.placeholderIcon}>🐟</span>
                          </div>
                        )}
                      </div>
                      <div style={styles.productInfo}>
                        <h3 style={styles.productName}>{p.name}</h3>
                        <p style={styles.productDesc}>{p.description}</p>
                        <div style={styles.productFooter}>
                          <div>
                            <p style={styles.price}>₱{p.price}</p>
                            <p style={styles.stock}>Stock: {p.quantity}</p>
                          </div>
                          <button 
                            onClick={() => handleBuyNow(p)}
                            style={{
                              ...styles.buyBtn,
                              opacity: purchaseLoading === p.uid || p.quantity <= 0 ? 0.6 : 1,
                              cursor: purchaseLoading === p.uid || p.quantity <= 0 ? 'not-allowed' : 'pointer',
                            }}
                            disabled={purchaseLoading === p.uid || p.quantity <= 0}
                          >
                            <FiShoppingCart size={18} />
                            <span>{purchaseLoading === p.uid ? 'Buying...' : p.quantity <= 0 ? 'Out of Stock' : 'Buy Now'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 2rem',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    color: colors.neutral.dark,
    margin: 0,
  },
  searchInfo: {
    marginTop: '1.5rem',
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  clearSearchBtn: {
    background: 'transparent',
    border: `2px solid ${colors.primary.main}`,
    color: colors.primary.main,
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '6rem 2rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
  },
  emptyIcon: {
    fontSize: '6rem',
    display: 'block',
    marginBottom: '1.5rem',
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    color: colors.neutral.darkest,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.medium,
    margin: 0,
  },
  sellerSection: {
    marginBottom: '4rem',
  },
  sellerHeader: {
    marginBottom: '2rem',
    padding: '2rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  sellerName: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1rem',
    fontFamily: typography.fontFamily.heading,
  },
  sellerInfo: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: shadows.card,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: `1px solid ${colors.neutral.light}`,
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
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
    fontSize: '5rem',
  },
  productInfo: {
    padding: '1.5rem',
  },
  productName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.75rem',
    fontFamily: typography.fontFamily.heading,
  },
  productDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    lineHeight: '1.6',
    marginBottom: '1rem',
    minHeight: '2.5rem',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '1rem',
  },
  price: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  stock: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    margin: '0.3rem 0 0 0',
  },
  buyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow: shadows.sm,
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow: shadows.sm,
  },
  messageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: colors.neutral.lightest,
    color: colors.primary.main,
    border: `2px solid ${colors.primary.main}`,
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
};

export default BrowseFish;
