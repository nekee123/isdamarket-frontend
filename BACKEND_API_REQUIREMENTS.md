# Backend API Requirements for IsdaMarket

This document outlines the required backend API endpoints that need to be implemented for the new features.

## 🔔 Notifications API

### Get Buyer Notifications
```
GET /notifications/buyer/{buyer_uid}
```
**Response:**
```json
[
  {
    "uid": "notif_123",
    "type": "order_approved",
    "message": "Your order for Bangus has been approved!",
    "read": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Get Seller Notifications
```
GET /notifications/seller/{seller_uid}
```
**Response:**
```json
[
  {
    "uid": "notif_456",
    "type": "new_order",
    "message": "New order received for Tilapia!",
    "read": false,
    "created_at": "2024-01-15T11:00:00Z"
  },
  {
    "uid": "notif_789",
    "type": "new_review",
    "message": "Juan Dela Cruz left a 5-star review!",
    "read": false,
    "created_at": "2024-01-15T09:45:00Z"
  }
]
```

### Mark Notification as Read
```
PATCH /notifications/{notification_uid}/read
```
**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark All Notifications as Read (Buyer)
```
PATCH /notifications/buyer/{buyer_uid}/read-all
```

### Mark All Notifications as Read (Seller)
```
PATCH /notifications/seller/{seller_uid}/read-all
```

### Delete Notification
```
DELETE /notifications/{notification_uid}
```

### Create Notification (Internal - triggered by events)
```
POST /notifications/
```
**Request Body:**
```json
{
  "recipient_uid": "buyer_123",
  "recipient_type": "buyer",
  "type": "order_approved",
  "message": "Your order for Bangus has been approved!"
}
```

**Notification Types:**
- **Buyer notifications:**
  - `order_approved` - When seller accepts order
  - `order_delivered` - When order status changes to delivered
  - `order_cancelled` - When seller cancels order

- **Seller notifications:**
  - `new_order` - When buyer places an order
  - `new_review` - When buyer leaves a review
  - `order_inquiry` - When buyer messages about an order

---

## 💬 Messaging API

### Get Messages Between Two Users
```
GET /messages/{user1_uid}/{user2_uid}
```
**Response:**
```json
[
  {
    "uid": "msg_123",
    "sender_uid": "buyer_123",
    "sender_type": "buyer",
    "recipient_uid": "seller_456",
    "recipient_type": "seller",
    "message": "Is the fish still fresh?",
    "created_at": "2024-01-15T10:00:00Z"
  },
  {
    "uid": "msg_124",
    "sender_uid": "seller_456",
    "sender_type": "seller",
    "recipient_uid": "buyer_123",
    "recipient_type": "buyer",
    "message": "Yes, caught this morning!",
    "created_at": "2024-01-15T10:05:00Z"
  }
]
```

### Send Message
```
POST /messages/
```
**Request Body:**
```json
{
  "sender_uid": "buyer_123",
  "sender_type": "buyer",
  "recipient_uid": "seller_456",
  "recipient_type": "seller",
  "message": "Is the fish still fresh?"
}
```
**Response:**
```json
{
  "uid": "msg_123",
  "sender_uid": "buyer_123",
  "sender_type": "buyer",
  "recipient_uid": "seller_456",
  "recipient_type": "seller",
  "message": "Is the fish still fresh?",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Get Conversation List ⭐ NOW REQUIRED
```
GET /messages/conversations/{user_uid}
```
**Response:**
```json
[
  {
    "other_user_uid": "seller_456",
    "other_user_name": "Fresh Catch Market",
    "other_user_type": "seller",
    "last_message": "Yes, caught this morning!",
    "last_message_time": "2024-01-15T10:05:00Z",
    "unread_count": 0
  }
]
```

**Note:** This endpoint is now used by the MessageHistoryDropdown in the Navbar. It should return all conversations for a user, sorted by most recent message first.

---

## ⭐ Reviews API (Enhancement)

### Submit Review
```
POST /reviews/
```
**Request Body:**
```json
{
  "buyer_uid": "buyer_123",
  "buyer_name": "Juan Dela Cruz",
  "seller_uid": "seller_456",
  "order_uid": "order_789",
  "rating": 5,
  "comment": "Fresh fish, great service!"
}
```
**Response:**
```json
{
  "uid": "review_123",
  "buyer_uid": "buyer_123",
  "buyer_name": "Juan Dela Cruz",
  "seller_uid": "seller_456",
  "order_uid": "order_789",
  "rating": 5,
  "comment": "Fresh fish, great service!",
  "created_at": "2024-01-15T12:00:00Z"
}
```

**Note:** After creating a review, the backend should:
1. Create a notification for the seller: `new_review` type
2. Update the seller's average rating

---

## 📦 Order Status Updates (Enhancement)

When order status changes, create appropriate notifications:

### Accept Order
```
PATCH /orders/{order_uid}/accept
```
**Backend should:**
1. Update order status to "accepted"
2. Create notification for buyer: `order_approved` type

### Update Order Status to Delivered
```
PATCH /orders/{order_uid}/status
```
**Request Body:**
```json
{
  "status": "delivered"
}
```
**Backend should:**
1. Update order status
2. Create notification for buyer: `order_delivered` type

### Cancel Order
```
PATCH /orders/{order_uid}/cancel
```
**Backend should:**
1. Update order status to "cancelled"
2. Create notification for buyer: `order_cancelled` type

---

## 🔍 Search Enhancement (Optional)

The frontend now handles search client-side, but you can optionally add server-side search:

```
GET /products/search?q={query}
GET /sellers/search?q={query}
```

---

## 📊 Database Schema Suggestions

### Notifications Table
```
- uid (primary key)
- recipient_uid (indexed)
- recipient_type (buyer/seller)
- type (order_approved, new_order, new_review, etc.)
- message (text)
- read (boolean, default false)
- created_at (timestamp)
```

### Messages Table
```
- uid (primary key)
- sender_uid (indexed)
- sender_type (buyer/seller)
- recipient_uid (indexed)
- recipient_type (buyer/seller)
- message (text)
- created_at (timestamp)
```

**Indexes needed:**
- `(sender_uid, recipient_uid)` for fast message retrieval
- `(recipient_uid, created_at)` for notification queries
- `(recipient_uid, read)` for unread count queries

---

## 🎯 Implementation Priority

1. **High Priority:**
   - Notifications API (all endpoints)
   - Review submission endpoint fix
   - Order status notification triggers

2. **Medium Priority:**
   - Messaging API (basic send/receive)
   - Conversation list endpoint (GET /messages/conversations/{user_uid})
   - Seller average rating calculation

3. **Low Priority:**
   - Server-side search
   - Message read receipts
   - Message editing/deletion

---

## 🧪 Testing Checklist

- [ ] Buyer receives notification when order is approved
- [ ] Buyer receives notification when order is delivered
- [ ] Seller receives notification when new order is placed
- [ ] Seller receives notification when review is submitted
- [ ] Messages are sent and received correctly
- [ ] Notifications can be marked as read
- [ ] Notifications can be deleted
- [ ] Unread count updates correctly
- [ ] Review submission creates notification for seller
- [ ] Search works for products, sellers, and locations
