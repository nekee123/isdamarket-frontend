import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiShoppingBag, FiStar, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const NotificationDropdown = ({ userType, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, userType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const endpoint = userType === 'buyer' 
        ? `${BASE_URL}/notifications/buyer/${userId}`
        : `${BASE_URL}/notifications/seller/${userId}`;
      
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        // Filter out message notifications - they should appear in Messages dropdown instead
        const nonMessageNotifications = data.filter(n => 
          n.type !== 'new_message' && 
          n.type !== 'message_received' &&
          !n.message?.toLowerCase().includes('new message')
        );
        setNotifications(nonMessageNotifications);
        setUnreadCount(nonMessageNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications(notifications.map(n => 
          n.uid === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const endpoint = userType === 'buyer'
        ? `${BASE_URL}/notifications/buyer/${userId}/read-all`
        : `${BASE_URL}/notifications/seller/${userId}/read-all`;
      
      const res = await fetch(endpoint, { method: 'PATCH' });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const deletedNotif = notifications.find(n => n.uid === notificationId);
        setNotifications(notifications.filter(n => n.uid !== notificationId));
        if (!deletedNotif.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_placed':
      case 'new_order':
        return <FiShoppingBag size={20} style={{ color: colors.primary.main }} />;
      case 'order_approved':
      case 'order_accepted':
        return <FiCheckCircle size={20} style={{ color: colors.success }} />;
      case 'order_delivered':
        return <FiTruck size={20} style={{ color: colors.success }} />;
      case 'new_review':
      case 'review_received':
        return <FiStar size={20} style={{ color: '#FFB800' }} />;
      default:
        return <FiBell size={20} style={{ color: colors.neutral.medium }} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button 
        style={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h3 style={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={markAllAsRead}>
                <FiCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div style={styles.notificationList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <FiBell size={48} style={{ color: colors.neutral.light }} />
                <p style={styles.emptyText}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.uid}
                  style={{
                    ...styles.notificationItem,
                    background: notif.read ? colors.neutral.white : colors.neutral.lightest,
                  }}
                  onClick={() => !notif.read && markAsRead(notif.uid)}
                >
                  <div style={styles.iconWrapper}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div style={styles.content}>
                    <p style={styles.message}>{notif.message}</p>
                    <span style={styles.time}>{formatTime(notif.created_at)}</span>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.uid);
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
  bellButton: {
    position: 'relative',
    background: colors.neutral.lightest,
    border: 'none',
    padding: '0.75rem',
    borderRadius: borderRadius.full,
    cursor: 'pointer',
    color: colors.primary.main,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: colors.accent.main,
    color: colors.neutral.white,
    fontSize: '0.7rem',
    fontWeight: typography.fontWeight.bold,
    padding: '0.15rem 0.4rem',
    borderRadius: borderRadius.full,
    minWidth: '18px',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    width: '380px',
    maxHeight: '500px',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral.light}`,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  markAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'transparent',
    border: 'none',
    color: colors.primary.main,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease',
  },
  notificationList: {
    overflowY: 'auto',
    maxHeight: '420px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    gap: '1rem',
  },
  emptyText: {
    color: colors.neutral.medium,
    fontSize: typography.fontSize.sm,
    margin: 0,
  },
  notificationItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    flexShrink: 0,
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.full,
    background: colors.neutral.lightest,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.darkest,
    margin: '0 0 0.25rem 0',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  deleteBtn: {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    color: colors.neutral.medium,
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default NotificationDropdown;
