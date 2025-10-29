import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import BackButton from "../components/BackButton";
import { useToast } from "../components/Toast";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiUser, FiPhone } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

import { BASE_URL } from "../config/api";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sellerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/orders/seller/${sellerAuth.uid}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
      showToast("Failed to load orders", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerAuth.isAuthenticated) {
      fetchOrders();
    }
  }, [sellerAuth.uid]);

  const handleAcceptOrder = async (orderUid) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (res.ok) {
        showToast("Order confirmed successfully!", "success");
        fetchOrders();
      } else {
        showToast("Failed to confirm order", "error");
      }
    } catch (err) {
      showToast("Error confirming order", "error");
    }
  };

  const handleCancelOrder = async (orderUid) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Order cancelled successfully", "success");
        fetchOrders();
      }
    } catch (err) {
      showToast("Error cancelling order", "error");
    }
  };

  const handleUpdateStatus = async (orderUid, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order marked as ${newStatus}!`, "success");
        fetchOrders();
      } else {
        showToast("Failed to update order status", "error");
      }
    } catch (err) {
      showToast("Error updating order", "error");
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
      cancelled_by_buyer: "Cancelled by Buyer",
      cancelled_by_seller: "Cancelled by You",
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
      <>
        <Navbar userType="seller" showSearch={false} />
        <PageLoader message="Please wait for a while..." submessage="Loading orders" />
      </>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="seller" showSearch={false} />
      <BackButton to="/seller-dashboard" />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Customer Orders</h1>
          <p style={styles.subtitle}>Manage and fulfill customer orders</p>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p style={styles.emptyText}>No orders yet</p>
            <p style={styles.emptySubtext}>Orders from customers will appear here</p>
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
                    <div style={styles.detailWithIcon}>
                      <FiUser size={16} />
                      <span style={styles.detailLabel}>Buyer:</span>
                    </div>
                    <span style={styles.detailValue}>{order.buyer_name}</span>
                  </div>
                  {order.buyer_contact && (
                    <div style={styles.detailRow}>
                      <div style={styles.detailWithIcon}>
                        <FiPhone size={16} />
                        <span style={styles.detailLabel}>Contact:</span>
                      </div>
                      <span style={styles.detailValue}>{order.buyer_contact}</span>
                    </div>
                  )}
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
                    <>
                      <button 
                        style={styles.confirmBtn}
                        onClick={() => handleAcceptOrder(order.uid)}
                      >
                        <FiCheckCircle size={16} />
                        <span>Confirm</span>
                      </button>
                      <button 
                        style={styles.cancelBtn}
                        onClick={() => handleCancelOrder(order.uid)}
                      >
                        <FiXCircle size={16} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button 
                      style={styles.updateBtn}
                      onClick={() => handleUpdateStatus(order.uid, 'delivered')}
                    >
                      <FiTruck size={16} />
                      <span>Mark as Delivered</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
    maxWidth: '1200px',
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
    minHeight: '300px',
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
  detailWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.neutral.medium,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.darkest,
    fontWeight: typography.fontWeight.medium,
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
  confirmBtn: {
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
  cancelBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
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
  updateBtn: {
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

export default SellerOrders;
