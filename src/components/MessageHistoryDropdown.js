import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const BASE_URL = process.env.REACT_APP_API_URL;

const MessageHistoryDropdown = ({ userType, userId, onOpenChat }) => {
  const [conversations, setConversations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchConversations();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchConversations, 30000);
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

  const fetchConversations = async () => {
    try {
      const endpoint = `${BASE_URL}/messages/conversations/${userId}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        setUnreadCount(data.filter(c => c.unread_count > 0).length);
      } else {
        // If endpoint doesn't exist, fallback to empty
        console.log('Conversations endpoint not available yet');
        setConversations([]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    }
  };

  const handleConversationClick = (conversation) => {
    setIsOpen(false);
    if (onOpenChat) {
      onOpenChat({
        recipientId: conversation.other_user_uid,
        recipientName: conversation.other_user_name,
      });
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
        style={styles.messageButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMessageCircle size={20} />
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h3 style={styles.title}>Messages</h3>
          </div>

          <div style={styles.conversationList}>
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <FiMessageCircle size={48} style={{ color: colors.neutral.light }} />
                <p style={styles.emptyText}>No messages yet</p>
                <p style={styles.emptySubtext}>Start a conversation with a {userType === 'buyer' ? 'seller' : 'buyer'}!</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.other_user_uid}
                  style={{
                    ...styles.conversationItem,
                    background: conversation.unread_count > 0 
                      ? colors.neutral.lightest 
                      : colors.neutral.white,
                  }}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div style={styles.avatarWrapper}>
                    <div style={styles.avatar}>
                      {conversation.other_user_name.charAt(0).toUpperCase()}
                    </div>
                    {conversation.unread_count > 0 && (
                      <span style={styles.unreadDot}></span>
                    )}
                  </div>
                  <div style={styles.conversationContent}>
                    <div style={styles.conversationHeader}>
                      <span style={styles.userName}>{conversation.other_user_name}</span>
                      <span style={styles.time}>{formatTime(conversation.last_message_time)}</span>
                    </div>
                    <p style={styles.lastMessage}>
                      {conversation.last_message}
                    </p>
                  </div>
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
  messageButton: {
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
  conversationList: {
    overflowY: 'auto',
    maxHeight: '420px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    gap: '0.5rem',
  },
  emptyText: {
    color: colors.neutral.dark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    margin: 0,
  },
  emptySubtext: {
    color: colors.neutral.medium,
    fontSize: typography.fontSize.sm,
    margin: 0,
    textAlign: 'center',
  },
  conversationItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.full,
    background: gradients.ocean,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '12px',
    height: '12px',
    background: colors.accent.main,
    borderRadius: borderRadius.full,
    border: `2px solid ${colors.neutral.white}`,
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  userName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  lastMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export default MessageHistoryDropdown;
