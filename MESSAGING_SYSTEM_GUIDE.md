# IsdaMarket Messaging System - Complete Guide

## Overview

A fully functional buyer ↔ seller messaging system with a beautiful coastal-themed UI. The system features real-time message updates, optimistic UI updates, and a responsive design that works on both mobile and desktop.

## 🎨 Design Features

### Coastal Theme
- **Ocean Blues**: Primary colors using cyan/teal gradients
- **Clean Whites**: Soft backgrounds with subtle shadows
- **Message Bubbles**: 
  - Buyer messages: Ocean blue gradient (right-aligned)
  - Seller messages: White with gray border (left-aligned)
- **Rounded Corners**: 12px radius for modern feel
- **Smooth Animations**: Transitions and hover effects

### Responsive Design
- **Mobile**: Stacked layout with conversation list above chat
- **Desktop**: Side-by-side layout with 350px conversation sidebar

## 📁 File Structure

```
src/
├── components/
│   ├── Chat.js              # Chat window component
│   └── Conversations.js     # Conversation list component
├── services/
│   ├── api.js              # Main API service (includes messaging)
│   └── messageApi.js       # Dedicated messaging API helpers
└── pages/
    ├── BuyerMessages.js    # Buyer messaging page
    └── SellerMessages.js   # Seller messaging page
```

## 🔧 Components

### 1. Conversations Component (`src/components/Conversations.js`)

**Purpose**: Displays a list of conversations with search and auto-refresh.

**Props**:
- `userId` (string): Current user's UID
- `userType` (string): 'buyer' or 'seller'
- `selectedConversation` (object): Currently selected conversation
- `onSelectConversation` (function): Callback when conversation is selected
- `isMobile` (boolean): Whether to use mobile layout

**Features**:
- Auto-refresh every 5 seconds
- Search functionality (shows when >3 conversations)
- Manual refresh button
- Loading and error states
- Empty state with helpful message
- Active conversation highlighting

**Example Usage**:
```jsx
<Conversations
  userId={buyerAuth.uid}
  userType="buyer"
  selectedConversation={selectedConversation}
  onSelectConversation={handleSelectConversation}
  isMobile={false}
/>
```

### 2. Chat Component (`src/components/Chat.js`)

**Purpose**: Displays the chat window for a conversation.

**Props**:
- `currentUserId` (string): Current user's UID
- `currentUserType` (string): 'buyer' or 'seller'
- `conversation` (object): Conversation object with user_id, user_name, user_type
- `onMessageSent` (function): Callback after message is sent
- `isMobile` (boolean): Whether to use mobile layout

**Features**:
- Auto-refresh messages every 3 seconds
- Optimistic UI updates (messages appear immediately)
- Auto-scroll to bottom on new messages
- Timestamp dividers (shows when >5 minutes gap)
- Loading and error states
- Send button disabled when input is empty
- Error banner for failed messages

**Example Usage**:
```jsx
<Chat
  currentUserId={buyerAuth.uid}
  currentUserType="buyer"
  conversation={selectedConversation}
  onMessageSent={handleMessageSent}
  isMobile={true}
/>
```

## 🔌 API Functions

### messageApi.js

#### `getMessages(user1_uid, user2_uid)`
Fetches all messages between two users.

```javascript
const messages = await getMessages('buyer_123', 'seller_456');
```

#### `sendMessage(messageData)`
Sends a new message.

```javascript
const messageData = {
  sender_uid: 'buyer_123',
  sender_type: 'buyer',
  recipient_uid: 'seller_456',
  recipient_type: 'seller',
  message: 'Is this product still available?'
};
const sentMessage = await sendMessage(messageData);
```

#### `getConversations(user_uid)`
Gets all conversations for a user.

```javascript
const conversations = await getConversations('buyer_123');
```

#### `formatMessageTime(timestamp)`
Formats timestamp for display.

```javascript
const formattedTime = formatMessageTime('2024-01-15T10:30:00Z');
// Returns: "10:30 AM" (if today) or "Jan 15" (if older)
```

#### `groupMessagesByConversation(messages, currentUserId)`
Groups messages by conversation partner.

```javascript
const grouped = groupMessagesByConversation(allMessages, 'buyer_123');
```

## 🚀 Usage Examples

### Basic Implementation

```jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Conversations from '../components/Conversations';
import Chat from '../components/Chat';

function MessagingPage() {
  const { buyerAuth } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Conversations
        userId={buyerAuth.uid}
        userType="buyer"
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <Chat
        currentUserId={buyerAuth.uid}
        currentUserType="buyer"
        conversation={selectedConversation}
      />
    </div>
  );
}
```

### With Custom Callbacks

```jsx
const handleMessageSent = (sentMessage) => {
  console.log('Message sent:', sentMessage);
  // Trigger notification, analytics, etc.
};

const handleConversationSelect = (conversation) => {
  setSelectedConversation(conversation);
  // Mark as read, track analytics, etc.
};
```

## 🎯 Backend API Requirements

The messaging system expects these FastAPI endpoints:

### 1. GET `/messages/{user1_uid}/{user2_uid}`
Fetch all messages between two users.

**Response**:
```json
[
  {
    "sender_uid": "buyer_123",
    "sender_type": "buyer",
    "recipient_uid": "seller_456",
    "recipient_type": "seller",
    "message": "Hello!",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2. POST `/messages/`
Send a new message.

**Request Body**:
```json
{
  "sender_uid": "buyer_123",
  "sender_type": "buyer",
  "recipient_uid": "seller_456",
  "recipient_type": "seller",
  "message": "Is this available?"
}
```

**Response**:
```json
{
  "sender_uid": "buyer_123",
  "sender_type": "buyer",
  "recipient_uid": "seller_456",
  "recipient_type": "seller",
  "message": "Is this available?",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 3. GET `/messages/conversations/{user_uid}`
Get all conversations for a user.

**Response**:
```json
[
  {
    "sender_uid": "buyer_123",
    "sender_type": "buyer",
    "recipient_uid": "seller_456",
    "recipient_type": "seller",
    "message": "Last message text",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

## 🎨 Styling Customization

All styles use the theme system from `src/styles/theme.js`. To customize:

### Change Message Bubble Colors

```javascript
// In Chat.js or Conversations.js
messageBubbleSent: {
  background: gradients.sunset, // Change to any gradient
  color: colors.neutral.white,
}
```

### Adjust Auto-Refresh Intervals

```javascript
// In Conversations.js (line ~28)
const interval = setInterval(() => {
  fetchConversations(true);
}, 5000); // Change to desired milliseconds

// In Chat.js (line ~32)
const interval = setInterval(() => {
  fetchMessages(true);
}, 3000); // Change to desired milliseconds
```

### Modify Layout Dimensions

```javascript
// In SellerMessages.js
chatContainer: {
  gridTemplateColumns: '400px 1fr', // Change sidebar width
  height: 'calc(100vh - 250px)',    // Adjust height
}
```

## 🐛 Troubleshooting

### Messages not loading
1. Check browser console for API errors
2. Verify backend is running on correct port
3. Check `.env` file has correct `REACT_APP_API_URL`

### Auto-refresh not working
1. Check browser console for errors
2. Verify intervals are not being cleared prematurely
3. Check network tab to see if requests are being made

### Styling issues
1. Verify theme.js is properly imported
2. Check for CSS conflicts with global styles
3. Inspect element to see computed styles

## 🔄 Future Enhancements

### Recommended Improvements
1. **WebSocket Integration**: Real-time updates instead of polling
2. **Typing Indicators**: Show when other user is typing
3. **Read Receipts**: Mark messages as read/unread
4. **Message Reactions**: Emoji reactions to messages
5. **File Attachments**: Send images and files
6. **Message Search**: Search within conversations
7. **Notifications**: Browser notifications for new messages
8. **Message Deletion**: Delete or edit sent messages
9. **Conversation Archiving**: Archive old conversations
10. **User Presence**: Online/offline status indicators

### WebSocket Example (Future)
```javascript
// Example WebSocket integration
const ws = new WebSocket('ws://localhost:8000/ws/messages');

ws.onmessage = (event) => {
  const newMessage = JSON.parse(event.data);
  setMessages(prev => [...prev, newMessage]);
};
```

## 📊 Performance Considerations

### Current Implementation
- **Polling**: Auto-refresh every 3-5 seconds
- **Optimistic Updates**: Messages appear immediately
- **Lazy Loading**: Only loads selected conversation messages

### Optimization Tips
1. Implement pagination for large message histories
2. Use WebSocket for production (reduces server load)
3. Cache conversations in localStorage
4. Debounce search input
5. Implement virtual scrolling for long message lists

## 🧪 Testing

### Manual Testing Checklist
- [ ] Send message as buyer
- [ ] Receive message as seller
- [ ] Auto-refresh updates conversation list
- [ ] Auto-refresh updates messages
- [ ] Search filters conversations
- [ ] Manual refresh button works
- [ ] Error states display correctly
- [ ] Empty states display correctly
- [ ] Mobile layout works
- [ ] Desktop layout works

### Test Data
```javascript
// Example test users
const testBuyer = {
  uid: 'buyer_test_123',
  name: 'Test Buyer',
  type: 'buyer'
};

const testSeller = {
  uid: 'seller_test_456',
  name: 'Test Seller',
  type: 'seller'
};
```

## 📝 Summary

The IsdaMarket messaging system provides a complete, production-ready solution for buyer-seller communication with:

✅ Beautiful coastal-themed UI  
✅ Auto-refresh functionality  
✅ Optimistic UI updates  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Search functionality  
✅ Reusable components  
✅ Clean API structure  
✅ Comprehensive documentation  

The system is ready to use and can be easily extended with additional features as needed.
