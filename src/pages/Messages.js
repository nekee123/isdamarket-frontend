import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageModal from '../components/MessageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMessageCircle, FiUser } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const BASE_URL = process.env.REACT_APP_API_URL;

function Messages({ userType }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const { buyerAuth, sellerAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const auth = userType === 'buyer' ? buyerAuth : sellerAuth;

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchConversations();
      
      // Check if there's a recipient in URL params (from direct message click)
      const recipientId = searchParams.get('recipient');
      const recipientName = searchParams.get('name');
      if (recipientId && recipientName) {
        setSelectedChat({ recipientId, recipientName });
      }
    }
  }, [auth.uid, searchParams]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch both conversations and message notifications
      const conversationsEndpoint = `${BASE_URL}/messages/conversations/${auth.uid}`;
      const notificationsEndpoint = userType === 'buyer' 
        ? `${BASE_URL}/notifications/buyer/${auth.uid}`
        : `${BASE_URL}/notifications/seller/${auth.uid}`;
      
      const [conversationsRes, notificationsRes] = await Promise.all([
        fetch(conversationsEndpoint),
        fetch(notificationsEndpoint)
      ]);

      let allConversations = [];
      
      // Get existing conversations
      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json();
        allConversations = conversationsData;
      }

      // Get message notifications and merge them
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        // Filter for message notifications only
        const messageNotifications = notificationsData.filter(n => 
          n.type === 'new_message' || 
          n.type === 'message_received' ||
          n.message?.toLowerCase().includes('message from')
        );

        // Convert message notifications to conversation format
        messageNotifications.forEach(notif => {
          // Extract sender name from message (e.g., "New message from Juan Cruz")
          let senderName = 'Unknown';
          const messageText = notif.message || '';
          
          // Try to extract name from different message formats
          if (messageText.includes('from ')) {
            const parts = messageText.split('from ');
            if (parts.length > 1) {
              senderName = parts[1].trim();
            }
          }

          // Check if conversation already exists
          const existingConv = allConversations.find(c => 
            c.other_user_name === senderName || 
            (notif.sender_uid && c.other_user_uid === notif.sender_uid)
          );

          if (!existingConv) {
            // Add as new conversation
            allConversations.push({
              other_user_uid: notif.sender_uid || `notif_${notif.uid}`,
              other_user_name: senderName,
              last_message: notif.message || 'New message',
              last_message_time: notif.created_at,
              unread_count: 1,
              from_notification: true
            });
          }
        });
      }

      setConversations(allConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedChat({
      recipientId: conversation.other_user_uid,
      recipientName: conversation.other_user_name,
    });
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

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userType={userType} showSearch={false} />
        <LoadingSpinner fullScreen={false} />
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <Navbar userType={userType} showSearch={false} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FiMessageCircle style={{ marginRight: '0.5rem' }} />
            Messages
          </h1>
          <p style={styles.subtitle}>Chat with {userType === 'buyer' ? 'sellers' : 'buyers'} about your orders</p>
        </div>

        {conversations.length === 0 ? (
          <div style={styles.emptyState}>
            <FiMessageCircle size={80} style={{ color: colors.neutral.light }} />
            <p style={styles.emptyText}>No conversations yet</p>
            <p style={styles.emptySubtext}>
              Start chatting with {userType === 'buyer' ? 'sellers' : 'buyers'} to see your message history here
            </p>
            <button 
              style={styles.browseBtn} 
              onClick={() => navigate(userType === 'buyer' ? '/buyer-dashboard/browse' : '/seller-dashboard/products')}
            >
              {userType === 'buyer' ? 'Browse Products' : 'View Products'}
            </button>
          </div>
        ) : (
          <div style={styles.conversationsGrid}>
            {conversations.map((conversation) => (
              <div
                key={conversation.other_user_uid}
                style={{
                  ...styles.conversationCard,
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
                    <span style={styles.unreadBadge}>{conversation.unread_count}</span>
                  )}
                </div>
                <div style={styles.conversationContent}>
                  <div style={styles.conversationHeader}>
                    <h3 style={styles.userName}>{conversation.other_user_name}</h3>
                    <span style={styles.time}>{formatTime(conversation.last_message_time)}</span>
                  </div>
                  <p style={styles.lastMessage}>{conversation.last_message}</p>
                  <button style={styles.openChatBtn}>
                    Open Chat →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedChat && (
        <MessageModal
          isOpen={!!selectedChat}
          onClose={() => {
            setSelectedChat(null);
            // Clear URL params
            navigate(`/${userType}-dashboard/messages`, { replace: true });
            // Refresh conversations
            fetchConversations();
          }}
          userType={userType}
          userId={auth.uid}
          recipientId={selectedChat.recipientId}
          recipientName={selectedChat.recipientName}
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
    display: 'flex',
    alignItems: 'center',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    margin: 0,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.medium,
    margin: 0,
    maxWidth: '500px',
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
    marginTop: '1rem',
  },
  conversationsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  conversationCard: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: borderRadius.full,
    background: gradients.ocean,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  unreadBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: colors.accent.main,
    color: colors.neutral.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    padding: '0.25rem 0.5rem',
    borderRadius: borderRadius.full,
    minWidth: '24px',
    textAlign: 'center',
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    margin: 0,
  },
  time: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
  },
  lastMessage: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
    margin: '0 0 1rem 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  openChatBtn: {
    padding: '0.5rem 1.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default Messages;
