import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Conversations from '../components/Conversations';
import Chat from '../components/Chat';
import { colors, typography } from '../styles/theme';

function SellerMessages() {
  const { sellerAuth } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMessageSent = () => {
    // Refresh conversations list after sending a message
    // The Conversations component will auto-refresh via its interval
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar userType="seller" showSearch={false} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Messages</h1>
          <p style={styles.subtitle}>Chat with your customers</p>
        </div>

        <div style={styles.chatContainer}>
          {/* Conversation List */}
          <Conversations
            userId={sellerAuth.uid}
            userType="seller"
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            isMobile={false}
          />

          {/* Chat Area */}
          <Chat
            currentUserId={sellerAuth.uid}
            currentUserType="seller"
            conversation={selectedConversation}
            onMessageSent={handleMessageSent}
            isMobile={false}
          />
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '6rem 2rem 3rem',
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
  chatContainer: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '1.5rem',
    height: 'calc(100vh - 250px)',
    minHeight: '500px',
  },
};

export default SellerMessages;
