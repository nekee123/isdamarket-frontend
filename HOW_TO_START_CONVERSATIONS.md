# How to Start Conversations in IsdaMarket

## 🚀 Where to Start a New Conversation

You can now start conversations with sellers from **two places**:

### 1. **Product Page** 
When viewing a product:
1. Navigate to any product (e.g., `/product/123`)
2. You'll see two buttons:
   - **🛒 Buy Now** - Purchase the product
   - **💬 Message Seller** - Start a conversation with the seller

**What happens when you click "Message Seller":**
- Automatically sends an initial message: *"Hi! I'm interested in your product: [Product Name]"*
- Redirects you to `/buyer-dashboard/messages`
- Opens the conversation with that seller

### 2. **Seller Profile Page**
When viewing a seller's profile:
1. Navigate to a seller's profile (e.g., `/profile/seller_123`)
2. You'll see a button at the bottom:
   - **💬 Message [Seller Name]** - Start a conversation

**What happens when you click "Message [Seller Name]":**
- Automatically sends an initial message: *"Hi [Seller Name]! I'd like to connect with you."*
- Redirects you to `/buyer-dashboard/messages`
- Opens the conversation with that seller

## 📍 Navigation Flow

### Starting from Product Browse:
```
Browse Products → Click Product → View Product Page → Click "Message Seller" → Messages Page
```

### Starting from Seller Profile:
```
View Seller Profile → Click "Message [Name]" → Messages Page
```

### Direct Access to Messages:
```
Buyer Dashboard → Messages (in navigation) → /buyer-dashboard/messages
```

## 🔐 Requirements

To start a conversation, you must:
1. ✅ Be logged in as a **buyer**
2. ✅ Not be messaging yourself
3. ✅ Have a valid seller to message

If you're not logged in, you'll be redirected to `/buyer-login`.

## 💬 Message Page Features

Once you're on the messages page (`/buyer-dashboard/messages`):

### Conversation List (Top Section)
- Shows all your active conversations
- Auto-refreshes every 5 seconds
- Search bar (appears when you have >3 conversations)
- Manual refresh button
- Click any conversation to view messages

### Chat Window (Bottom Section)
- Shows all messages with the selected seller
- Auto-refreshes every 3 seconds
- Type and send new messages
- Auto-scrolls to newest messages
- Timestamps show when messages were sent

## 🎨 Visual Guide

### Product Page Layout:
```
┌─────────────────────────────────┐
│  Product Name                   │
│  [Product Image]                │
│  ₱ Price                        │
│  Description...                 │
│  Seller: [Name]                 │
│                                 │
│  ┌──────────┐  ┌──────────────┐│
│  │🛒 Buy Now│  │💬 Message    ││
│  │          │  │   Seller     ││
│  └──────────┘  └──────────────┘│
└─────────────────────────────────┘
```

### Seller Profile Layout:
```
┌─────────────────────────────────┐
│        [Profile Picture]        │
│         Seller Name             │
│          [Seller]               │
│                                 │
│  📍 Location: ...               │
│  📧 Email: ...                  │
│  📞 Phone: ...                  │
│                                 │
│  ┌──────────────────────────┐  │
│  │💬 Message [Seller Name]  │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

### Messages Page Layout:
```
┌─────────────────────────────────┐
│  Messages                       │
├─────────────────────────────────┤
│  Conversations:                 │
│  ┌─────────────────────────┐   │
│  │ 👤 Seller Name          │   │
│  │    Last message...      │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  Chat with Seller Name:         │
│  ┌─────────────────────────┐   │
│  │ Seller: Hello!          │   │
│  │                         │   │
│  │          You: Hi there! │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Type a message...    [→]│   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

## 🧪 Testing the Feature

### Test Scenario 1: Message from Product Page
1. Login as a buyer
2. Go to Browse Products (`/buyer-dashboard/browse`)
3. Click on any product
4. Click "Message Seller" button
5. Verify you're redirected to messages page
6. Verify conversation appears in the list
7. Verify initial message is sent

### Test Scenario 2: Message from Profile Page
1. Login as a buyer
2. Navigate to a seller's profile (`/profile/[seller_id]`)
3. Click "Message [Seller Name]" button
4. Verify you're redirected to messages page
5. Verify conversation appears in the list
6. Verify initial message is sent

### Test Scenario 3: Continue Existing Conversation
1. Login as a buyer
2. Go to Messages (`/buyer-dashboard/messages`)
3. Click on an existing conversation
4. Type and send a new message
5. Verify message appears immediately
6. Verify auto-refresh works

## ⚠️ Common Issues

### "Please log in as a buyer" Alert
**Cause**: Not logged in or logged in as seller  
**Solution**: Login as a buyer at `/buyer-login`

### "You cannot message yourself!" Alert
**Cause**: Trying to message your own profile  
**Solution**: This is expected behavior - you can't message yourself

### "Failed to send message" Alert
**Cause**: Backend API error or network issue  
**Solution**: 
- Check if backend is running
- Check browser console for errors
- Verify API endpoint is correct in `.env`

### Message button not showing
**Cause**: Viewing a buyer profile (not a seller)  
**Solution**: Message button only appears on seller profiles

## 🔄 Auto-Refresh Behavior

The messaging system automatically refreshes:
- **Conversations**: Every 5 seconds
- **Messages**: Every 3 seconds

This gives a near real-time experience without WebSocket implementation.

## 📝 Summary

**To start a conversation as a buyer:**
1. Find a product you like OR visit a seller's profile
2. Click the "Message Seller" button
3. You'll be taken to the messages page
4. The conversation will be automatically created
5. Start chatting!

**To view existing conversations:**
1. Navigate to `/buyer-dashboard/messages`
2. Select a conversation from the list
3. View and send messages

That's it! The messaging system is now fully functional and easy to use.
