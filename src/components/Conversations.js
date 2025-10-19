import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiRefreshCw } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';
import { getConversations, groupMessagesByConversation, formatMessageTime } from '../services/messageApi';

/**
 * Conversations Component
 * Displays a list of conversations with search and refresh functionality
 * 
 * @param {string} userId - Current user's UID
 * @param {string} userType - 'buyer' or 'seller'
 * @param {Object} selectedConversation - Currently selected conversation
 * @param {Function} onSelectConversation - Callback when conversation is selected
 * @param {boolean} isMobile - Whether to use mobile layout
 */
function Conversations({ userId, userType, selectedConversation, onSelectConversation, isMobile = false }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchConversations(true); // Silent refresh
    }, 5000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      const allMessages = await getConversations(userId);
      const groupedConversations = groupMessagesByConversation(allMessages, userId);
      setConversations(groupedConversations);
      
      // Auto-select first conversation if none selected
      if (groupedConversations.length > 0 && !selectedConversation) {
        onSelectConversation(groupedConversations[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && conversations.length === 0) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={styles.errorState}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleRefresh} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={styles.emptyState}>
          <FiMessageCircle size={48} color={colors.neutral.medium} />
          <h3 style={styles.emptyTitle}>No Messages Yet</h3>
          <p style={styles.emptyText}>
            {userType === 'buyer' 
              ? 'Start a conversation with a seller'
              : 'Buyers will message you about your products'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={isMobile ? styles.mobileContainer : styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          {isMobile ? 'Messages' : 'Conversations'}
        </h3>
        <button 
          onClick={handleRefresh} 
          style={styles.refreshButton}
          disabled={refreshing}
        >
          <FiRefreshCw 
            size={18} 
            style={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </button>
      </div>

      {/* Search Bar */}
      {conversations.length > 3 && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      )}

      {/* Conversation List */}
      <div style={styles.conversationList}>
        {filteredConversations.length === 0 ? (
          <div style={styles.noResults}>
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.user_id}
              style={{
                ...styles.conversationItem,
                ...(selectedConversation?.user_id === conv.user_id ? styles.conversationItemActive : {}),
              }}
              onClick={() => onSelectConversation(conv)}
            >
              {/* Avatar */}
              <div style={styles.avatar}>
                {conv.user_name.charAt(0).toUpperCase()}
              </div>

              {/* Conversation Info */}
              <div style={styles.conversationInfo}>
                <div style={styles.conversationHeader}>
                  <span style={styles.conversationName}>{conv.user_name}</span>
                  <span style={styles.conversationTime}>
                    {formatMessageTime(conv.last_message_time)}
                  </span>
                </div>
                <p style={styles.lastMessage}>
                  {conv.last_message}
                </p>
              </div>

              {/* Unread Badge (optional) */}
              {conv.unread_count > 0 && (
                <div style={styles.unreadBadge}>
                  {conv.unread_count}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mobileContainer: {
    background: colors.neutral.white,
    borderBottom: `1px solid ${colors.neutral.light}`,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '40vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
  },
  refreshButton: {
    background: 'transparent',
    border: 'none',
    color: colors.primary.main,
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: borderRadius.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  searchContainer: {
    padding: '0.75rem 1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  searchInput: {
    width: '100%',
    padding: '0.625rem 1rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    fontFamily: typography.fontFamily.primary,
    transition: 'border-color 0.2s ease',
  },
  conversationList: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    position: 'relative',
  },
  conversationItemActive: {
    background: gradients.oceanLight,
    borderLeft: `4px solid ${colors.primary.main}`,
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
    fontSize: '1.25rem',
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  conversationName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  conversationTime: {
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
  unreadBadge: {
    minWidth: '20px',
    height: '20px',
    borderRadius: borderRadius.full,
    background: colors.accent.main,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    padding: '0 0.375rem',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    gap: '1rem',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: `3px solid ${colors.neutral.light}`,
    borderTop: `3px solid ${colors.primary.main}`,
    borderRadius: borderRadius.full,
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    gap: '1rem',
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
  },
  retryButton: {
    padding: '0.5rem 1.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    gap: '1rem',
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    maxWidth: '300px',
  },
  noResults: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: colors.neutral.medium,
    fontSize: typography.fontSize.sm,
  },
};

// Add keyframe animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animation already exists
}

export default Conversations;
