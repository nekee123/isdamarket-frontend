import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewModal from "../components/ReviewModal";
import { useToast } from "../components/Toast";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiStar, FiPhone } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";
import { BASE_URL } from "../config/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { buyerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/orders/buyer/${buyerAuth.uid}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      showToast("Failed to load orders", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (buyerAuth.isAuthenticated) {
      fetchOrders();
    }
  }, [buyerAuth.uid]);

  const handleCancelOrder = async (orderUid) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Order cancelled successfully", "success");
        fetchOrders();
      }
    } catch (err) {
      showToast("Failed to cancel order", "error");
    }
  };

  const handleReviewOrder = (order) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    // Validate review data
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      showToast("Please provide a rating between 1 and 5 stars", "error");
      return;
    }

    if (!selectedOrder || !selectedOrder.seller_uid) {
      showToast("Invalid order selected", "error");
      return;
    }

    try {
      const reviewPayload = {
        seller_uid: selectedOrder.seller_uid,
        buyer_uid: buyerAuth.uid,
        buyer_name: buyerAuth.name,
        order_uid: selectedOrder.uid,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment?.trim() || "",
      };

      console.log('Submitting review:', reviewPayload);

      const res = await fetch(`${BASE_URL}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      console.log('Review response status:', res.status);
      
      let responseData = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        const text = await res.text();
        console.log('Non-JSON response:', text);
      }
      
      console.log('Review response data:', responseData);

      if (!res.ok) {
        const errorMsg = responseData?.message || responseData?.error || responseData?.detail || `Server error: ${res.status}`;
        throw new Error(errorMsg);
      }

      showToast("Review submitted successfully! Thank you for your feedback.", "success");
      setReviewModalOpen(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh to update review status
    } catch (err) {
      console.error('Review submission error:', err);
      showToast(err.message || "Failed to submit review. Please try again.", "error");
    }
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      cancelled_by_buyer: "Cancelled by You",
      cancelled_by_seller: "Cancelled by Seller",
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiPackage size={20} />;
      case 'confirmed':
      case 'processing': return <FiTruck size={20} />;
      case 'delivered': return <FiCheckCircle size={20} />;
      case 'cancelled':
      case 'cancelled_by_buyer':
      case 'cancelled_by_seller': return <FiXCircle size={20} />;
      default: return <FiPackage size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed':
      case 'processing': return colors.info;
      case 'delivered': return colors.success;
      case 'cancelled':
      case 'cancelled_by_buyer':
      case 'cancelled_by_seller': return colors.error;
      default: return colors.neutral.medium;
    }
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

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="buyer" showSearch={true} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Orders</h1>
          <p style={styles.subtitle}>Track and manage your fish orders</p>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p style={styles.emptyText}>No orders yet</p>
            <p style={styles.emptySubtext}>Start shopping for fresh fish!</p>
            <button style={styles.browseBtn} onClick={() => navigate('/buyer-dashboard/browse')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order.uid} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <h3 style={styles.productName}>{order.fish_product_name}</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <p style={styles.orderId}>Order #{order.uid.substring(0, 8)}</p>
                    <div style={{...styles.statusBadge, background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status)}}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.orderDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Seller:</span>
                    <span 
                      style={styles.detailValue}
                      onClick={() => navigate(`/seller/${order.seller_uid}`)}
                    >
                      {order.seller_name}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      <FiPhone size={14} style={{marginRight: '0.25rem'}} />
                      Contact:
                    </span>
                    <span style={styles.contactValue}>
                      {order.seller_contact || 'Not available'}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Quantity:</span>
                    <span style={styles.detailValue}>{order.quantity} pcs</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Total:</span>
                    <span style={styles.priceValue}>₱{order.total_price}</span>
                  </div>
                </div>

                <div style={styles.orderActions}>
                  {order.status === 'pending' && (
                    <button 
                      style={styles.cancelBtn}
                      onClick={() => handleCancelOrder(order.uid)}
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === 'delivered' && !order.reviewed && (
                    <button 
                      style={styles.reviewBtn}
                      onClick={() => handleReviewOrder(order)}
                    >
                      <FiStar size={16} />
                      <span>Write Review</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleSubmitReview}
          sellerName={selectedOrder.seller_name}
        />
      )}

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
    padding: '2rem',
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
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
  },
  emptyIcon: {
    fontSize: '5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.medium,
    marginBottom: '2rem',
  },
  browseBtn: {
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
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  orderCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '1.5rem',
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '280px',
  },
  orderHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  productName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.25rem',
    lineHeight: '1.3',
  },
  orderId: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    margin: 0,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    whiteSpace: 'nowrap',
  },
  orderDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
    flex: 1,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.darkest,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  contactValue: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  priceValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    fontFamily: typography.fontFamily.heading,
  },
  orderActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: 'auto',
  },
  cancelBtn: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    color: colors.error,
    border: `2px solid ${colors.error}`,
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  reviewBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
};

export default MyOrders;
