import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileHeader from '../components/MobileHeader';
import MobileNav from '../components/MobileNav';
import Conversations from '../components/Conversations';
import Chat from '../components/Chat';
import { colors, typography } from '../styles/theme';

function BuyerMessages() {
  const { buyerAuth } = useAuth();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh when arriving from product/profile page
  useEffect(() => {
    if (location.state?.newMessage) {
      console.log('New message detected, forcing refresh...');
      setRefreshKey(prev => prev + 1);
    }
  }, [location]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMessageSent = () => {
    // Refresh conversations list after sending a message
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={styles.pageWrapper}>
      <MobileHeader title="Messages" userType="buyer" userId={buyerAuth.uid} />
      
      <div style={styles.container}>
        {/* Conversation List */}
        <Conversations
          key={refreshKey}
          userId={buyerAuth.uid}
          userType="buyer"
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          isMobile={true}
        />

        {/* Chat Area */}
        {selectedConversation && (
          <Chat
            currentUserId={buyerAuth.uid}
            currentUserType="buyer"
            conversation={selectedConversation}
            onMessageSent={handleMessageSent}
            isMobile={true}
          />
        )}
      </div>

      <MobileNav userType="buyer" />
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
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '4.5rem',
    paddingBottom: '4rem',
    maxHeight: '100vh',
    overflow: 'hidden',
  },
};

export default BuyerMessages;
