import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiAlertCircle } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';
import { getMessages, sendMessage, formatMessageTime } from '../services/messageApi';

/**
 * Chat Component
 * Displays a chat window for conversation between two users
 * 
 * @param {string} currentUserId - Current user's UID
 * @param {string} currentUserType - 'buyer' or 'seller'
 * @param {Object} conversation - Conversation object with user_id, user_name, user_type
 * @param {Function} onMessageSent - Callback after message is sent
 * @param {boolean} isMobile - Whether to use mobile layout
 */
function Chat({ currentUserId, currentUserType, conversation, onMessageSent, isMobile = false }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
      
      // Auto-refresh messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(true); // Silent refresh
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [conversation?.user_id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (silent = false) => {
    if (!conversation) return;
    
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      const data = await getMessages(currentUserId, conversation.user_id);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (!silent) {
        setError('Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setError(null);

    // Optimistic update - add message immediately
    const optimisticMessage = {
      sender_uid: currentUserId,
      sender_type: currentUserType,
      recipient_uid: conversation.user_id,
      recipient_type: conversation.user_type,
      message: messageText,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };
    
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const messageData = {
        sender_uid: currentUserId,
        sender_type: currentUserType,
        recipient_uid: conversation.user_id,
        recipient_type: conversation.user_type,
        message: messageText,
      };

      const sentMessage = await sendMessage(messageData);
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg._optimistic ? sentMessage : msg
        )
      );
      
      // Notify parent component
      if (onMessageSent) {
        onMessageSent(sentMessage);
      }
      
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg._optimistic));
      setNewMessage(messageText); // Restore the message
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Simulate typing indicator (can be enhanced with WebSocket)
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  if (!conversation) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div style={styles.container}>
        <ChatHeader conversation={conversation} />
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Chat Header */}
      <ChatHeader conversation={conversation} />

      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <FiAlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Container */}
      <div style={styles.messagesContainer} ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div style={styles.noMessages}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isSent = msg.sender_uid === currentUserId;
              const showTimestamp = index === 0 || 
                (new Date(msg.created_at) - new Date(messages[index - 1].created_at)) > 300000; // 5 minutes

              return (
                <div key={index}>
                  {showTimestamp && (
                    <div style={styles.timestampDivider}>
                      {formatMessageTime(msg.created_at)}
                    </div>
                  )}
                  <div
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: isSent ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(isSent ? styles.messageBubbleSent : styles.messageBubbleReceived),
                        opacity: msg._optimistic ? 0.7 : 1,
                      }}
                    >
                      <p style={styles.messageText}>{msg.message}</p>
                      <span style={styles.messageTime}>
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing Indicator (optional enhancement) */}
      {/* {isTyping && (
        <div style={styles.typingIndicator}>
          <span>{conversation.user_name} is typing...</span>
        </div>
      )} */}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} style={styles.messageForm}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={styles.messageInput}
          disabled={sending}
        />
        <button 
          type="submit" 
          style={{
            ...styles.sendButton,
            opacity: (!newMessage.trim() || sending) ? 0.5 : 1,
            cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
          }}
          disabled={!newMessage.trim() || sending}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}

/**
 * Chat Header Component
 */
function ChatHeader({ conversation }) {
  return (
    <div style={styles.chatHeader}>
      <div style={styles.avatar}>
        {conversation.user_name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 style={styles.chatHeaderName}>{conversation.user_name}</h3>
        <p style={styles.chatHeaderStatus}>
          {conversation.user_type === 'seller' ? 'Seller' : 'Customer'}
        </p>
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
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
    background: colors.neutral.white,
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
  chatHeaderName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
  },
  chatHeaderStatus: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    margin: 0,
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: colors.error + '15',
    color: colors.error,
    fontSize: typography.fontSize.sm,
    borderBottom: `1px solid ${colors.error}40`,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    background: colors.neutral.lightest,
  },
  timestampDivider: {
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    padding: '0.5rem 0',
    margin: '0.5rem 0',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
    marginBottom: '0.25rem',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: borderRadius.md,
    wordWrap: 'break-word',
    boxShadow: shadows.sm,
  },
  messageBubbleSent: {
    background: gradients.ocean,
    color: colors.neutral.white,
    borderBottomRightRadius: '4px',
  },
  messageBubbleReceived: {
    background: colors.neutral.white,
    color: colors.neutral.darkest,
    border: `1px solid ${colors.neutral.light}`,
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: typography.fontSize.base,
    margin: 0,
    marginBottom: '0.25rem',
    lineHeight: '1.5',
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    opacity: 0.7,
  },
  noMessages: {
    textAlign: 'center',
    color: colors.neutral.medium,
    padding: '3rem 1rem',
    fontSize: typography.fontSize.sm,
  },
  loadingState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyState: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.medium,
    textAlign: 'center',
  },
  typingIndicator: {
    padding: '0.5rem 1.5rem',
    fontSize: typography.fontSize.sm,
    color: colors.neutral.medium,
    fontStyle: 'italic',
  },
  messageForm: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    borderTop: `1px solid ${colors.neutral.light}`,
    background: colors.neutral.white,
  },
  messageInput: {
    flex: 1,
    padding: '0.875rem 1.25rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    outline: 'none',
    fontFamily: typography.fontFamily.primary,
    transition: 'border-color 0.2s ease',
  },
  sendButton: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.full,
    border: 'none',
    background: gradients.ocean,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
};

export default Chat;
