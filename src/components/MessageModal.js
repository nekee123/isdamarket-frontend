import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiMessageCircle } from 'react-icons/fi';
import { colors, gradients, shadows, borderRadius, typography } from '../styles/theme';

const BASE_URL = process.env.REACT_APP_API_URL;

const MessageModal = ({ isOpen, onClose, userType, userId, recipientId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && recipientId) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const endpoint = `${BASE_URL}/messages/${userId}/${recipientId}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const messageData = {
        sender_uid: userId,
        sender_type: userType,
        recipient_uid: recipientId,
        recipient_type: userType === 'buyer' ? 'seller' : 'buyer',
        message: newMessage.trim(),
      };
      
      console.log('Sending message:', messageData);
      console.log('API URL:', `${BASE_URL}/messages/`);
      
      const res = await fetch(`${BASE_URL}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      console.log('Message response status:', res.status);
      const responseData = await res.json().catch(() => null);
      console.log('Message response data:', responseData);

      if (res.ok) {
        setMessages([...messages, responseData]);
        setNewMessage('');
      } else {
        const errorMsg = responseData?.message || responseData?.error || 'Failed to send message';
        console.error('Failed to send message:', errorMsg);
        alert(`Failed to send message: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert(`Error sending message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <FiMessageCircle size={24} style={{ color: colors.primary.main }} />
            <div>
              <h3 style={styles.title}>Message {recipientName}</h3>
              <p style={styles.subtitle}>Chat with the {userType === 'buyer' ? 'seller' : 'buyer'}</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <FiMessageCircle size={48} style={{ color: colors.neutral.light }} />
              <p style={styles.emptyText}>No messages yet</p>
              <p style={styles.emptySubtext}>Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.sender_uid === userId;
              return (
                <div
                  key={index}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      background: isOwn ? gradients.ocean : colors.neutral.lightest,
                      color: isOwn ? colors.neutral.white : colors.neutral.darkest,
                      borderRadius: isOwn
                        ? '20px 20px 4px 20px'
                        : '20px 20px 20px 4px',
                    }}
                  >
                    <p style={styles.messageText}>{msg.message}</p>
                    <span
                      style={{
                        ...styles.messageTime,
                        color: isOwn ? 'rgba(255,255,255,0.8)' : colors.neutral.medium,
                      }}
                    >
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form style={styles.inputContainer} onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              ...styles.sendBtn,
              opacity: loading || !newMessage.trim() ? 0.5 : 1,
            }}
            disabled={loading || !newMessage.trim()}
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modal: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: shadows.xl,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.neutral.light}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    margin: '0.25rem 0 0 0',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: colors.neutral.medium,
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: colors.neutral.lightest,
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
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '0.875rem 1.25rem',
    boxShadow: shadows.sm,
  },
  messageText: {
    margin: 0,
    fontSize: typography.fontSize.sm,
    lineHeight: '1.5',
    wordWrap: 'break-word',
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    marginTop: '0.5rem',
    display: 'block',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem',
    borderTop: `1px solid ${colors.neutral.light}`,
    background: colors.neutral.white,
  },
  input: {
    flex: 1,
    padding: '0.875rem 1.25rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  sendBtn: {
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    padding: '0.875rem 1.25rem',
    borderRadius: borderRadius.full,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.sm,
  },
};

export default MessageModal;
