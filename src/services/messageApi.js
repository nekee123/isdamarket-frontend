import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Fetch all messages between two users
 * @param {string} user1_uid - First user's UID
 * @param {string} user2_uid - Second user's UID
 * @returns {Promise<Array>} Array of messages
 */
export const getMessages = async (user1_uid, user2_uid) => {
  try {
    const response = await axios.get(`${BASE_URL}/messages/${user1_uid}/${user2_uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a new message
 * @param {Object} messageData - Message data
 * @param {string} messageData.sender_uid - Sender's UID
 * @param {string} messageData.sender_type - Sender type ('buyer' or 'seller')
 * @param {string} messageData.recipient_uid - Recipient's UID
 * @param {string} messageData.recipient_type - Recipient type ('buyer' or 'seller')
 * @param {string} messageData.message - Message text
 * @returns {Promise<Object>} Created message object
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${BASE_URL}/messages/`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user
 * @param {string} user_uid - User's UID
 * @returns {Promise<Array>} Array of conversations
 */
export const getConversations = async (user_uid) => {
  try {
    console.log('🔍 Fetching conversations for user:', user_uid);
    console.log('🔍 API URL:', `${BASE_URL}/messages/conversations/${user_uid}`);
    const response = await axios.get(`${BASE_URL}/messages/conversations/${user_uid}`);
    console.log('✅ Conversations response:', response.data);
    console.log('✅ Number of messages:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    console.error('❌ Error details:', error.response?.data);
    throw error;
  }
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // Less than a week
    return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

/**
 * Group messages by conversation partner
 * @param {Array} messages - Array of all messages
 * @param {string} currentUserId - Current user's UID
 * @returns {Array} Array of conversation objects
 */
export const groupMessagesByConversation = (messages, currentUserId) => {
  console.log('📊 Grouping messages:', messages);
  console.log('📊 Current user ID:', currentUserId);
  
  const conversationMap = {};
  
  messages.forEach(msg => {
    const otherUserId = msg.sender_uid === currentUserId ? msg.recipient_uid : msg.sender_uid;
    const otherUserType = msg.sender_uid === currentUserId ? msg.recipient_type : msg.sender_type;
    
    console.log('📨 Processing message:', {
      from: msg.sender_uid,
      to: msg.recipient_uid,
      otherUser: otherUserId,
      message: msg.message
    });
    
    if (!conversationMap[otherUserId]) {
      conversationMap[otherUserId] = {
        user_id: otherUserId,
        user_type: otherUserType,
        user_name: msg.sender_uid === currentUserId 
          ? (msg.recipient_name || 'User') 
          : (msg.sender_name || 'User'),
        last_message: msg.message,
        last_message_time: msg.created_at,
        unread_count: 0, // Can be enhanced with backend support
      };
    } else {
      // Update if this message is newer
      if (new Date(msg.created_at) > new Date(conversationMap[otherUserId].last_message_time)) {
        conversationMap[otherUserId].last_message = msg.message;
        conversationMap[otherUserId].last_message_time = msg.created_at;
      }
    }
  });
  
  const grouped = Object.values(conversationMap).sort((a, b) => 
    new Date(b.last_message_time) - new Date(a.last_message_time)
  );
  
  console.log('✅ Grouped conversations:', grouped);
  console.log('✅ Number of conversations:', grouped.length);
  
  return grouped;
};
