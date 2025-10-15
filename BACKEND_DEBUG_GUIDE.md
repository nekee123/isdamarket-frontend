# Backend Debugging Guide

## Current Issues

Based on your report:
1. ❌ **Review submission fails** - "Failed to submit review" error
2. ❌ **Message sending doesn't work** - Messages not being sent
3. ⚠️ **Notifications show nothing** - Empty notification list

## Backend API URL
```
https://isdamarket-3.onrender.com
```

---

## 🔍 How to Debug

### Step 1: Open Browser Console
1. Open your app in the browser
2. Press `F12` or right-click → Inspect
3. Go to the **Console** tab
4. Try the failing actions (send message, submit review)
5. Look for the console logs that now show:
   - Request data being sent
   - Response status codes
   - Response data from backend
   - Any error messages

### Step 2: Check Network Tab
1. In browser DevTools, go to **Network** tab
2. Try sending a message or submitting a review
3. Look for the API calls:
   - `POST /messages/` - for messages
   - `POST /reviews/` - for reviews
4. Click on the failed request to see:
   - **Request Headers** - Check if Content-Type is correct
   - **Request Payload** - See what data was sent
   - **Response** - See the error message from backend

---

## 🐛 Common Backend Issues & Fixes

### Issue 1: Review Endpoint Not Implemented
**Symptom:** 404 Not Found or 501 Not Implemented

**Backend Fix Needed:**
```python
# Example FastAPI implementation
@app.post("/reviews/")
async def create_review(review: ReviewCreate):
    # Insert review into database
    new_review = {
        "uid": generate_uid(),
        "buyer_uid": review.buyer_uid,
        "buyer_name": review.buyer_name,
        "seller_uid": review.seller_uid,
        "order_uid": review.order_uid,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.now()
    }
    
    # Save to database
    db.reviews.insert_one(new_review)
    
    # Create notification for seller
    create_notification(
        recipient_uid=review.seller_uid,
        recipient_type="seller",
        type="new_review",
        message=f"{review.buyer_name} left a {review.rating}-star review!"
    )
    
    return new_review
```

### Issue 2: Messages Endpoint Not Implemented
**Symptom:** 404 Not Found or 501 Not Implemented

**Backend Fix Needed:**
```python
# Example FastAPI implementation
@app.post("/messages/")
async def send_message(message: MessageCreate):
    new_message = {
        "uid": generate_uid(),
        "sender_uid": message.sender_uid,
        "sender_type": message.sender_type,
        "recipient_uid": message.recipient_uid,
        "recipient_type": message.recipient_type,
        "message": message.message,
        "created_at": datetime.now()
    }
    
    # Save to database
    db.messages.insert_one(new_message)
    
    return new_message

@app.get("/messages/{user1_uid}/{user2_uid}")
async def get_messages(user1_uid: str, user2_uid: str):
    # Get all messages between two users
    messages = db.messages.find({
        "$or": [
            {"sender_uid": user1_uid, "recipient_uid": user2_uid},
            {"sender_uid": user2_uid, "recipient_uid": user1_uid}
        ]
    }).sort("created_at", 1)
    
    return list(messages)
```

### Issue 3: CORS Issues
**Symptom:** CORS policy error in console

**Backend Fix Needed:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 4: Missing Database Tables
**Symptom:** Database/table doesn't exist errors

**Backend Fix Needed:**
Create the required tables/collections:

**Reviews Table:**
```sql
CREATE TABLE reviews (
    uid VARCHAR(255) PRIMARY KEY,
    buyer_uid VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    seller_uid VARCHAR(255) NOT NULL,
    order_uid VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_uid) REFERENCES buyers(uid),
    FOREIGN KEY (seller_uid) REFERENCES sellers(uid),
    FOREIGN KEY (order_uid) REFERENCES orders(uid)
);
```

**Messages Table:**
```sql
CREATE TABLE messages (
    uid VARCHAR(255) PRIMARY KEY,
    sender_uid VARCHAR(255) NOT NULL,
    sender_type VARCHAR(50) NOT NULL,
    recipient_uid VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sender (sender_uid),
    INDEX idx_recipient (recipient_uid),
    INDEX idx_conversation (sender_uid, recipient_uid)
);
```

**Notifications Table:**
```sql
CREATE TABLE notifications (
    uid VARCHAR(255) PRIMARY KEY,
    recipient_uid VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recipient (recipient_uid),
    INDEX idx_unread (recipient_uid, read)
);
```

### Issue 5: Wrong Response Format
**Symptom:** Frontend receives data but can't parse it

**Backend Fix:** Ensure responses match the expected format:

**Review Response:**
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

**Message Response:**
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

---

## 🧪 Testing the Backend Directly

### Test Review Endpoint
```bash
curl -X POST https://isdamarket-3.onrender.com/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_uid": "test_buyer_123",
    "buyer_name": "Test Buyer",
    "seller_uid": "test_seller_456",
    "order_uid": "test_order_789",
    "rating": 5,
    "comment": "Test review"
  }'
```

### Test Message Endpoint
```bash
curl -X POST https://isdamarket-3.onrender.com/messages/ \
  -H "Content-Type: application/json" \
  -d '{
    "sender_uid": "buyer_123",
    "sender_type": "buyer",
    "recipient_uid": "seller_456",
    "recipient_type": "seller",
    "message": "Test message"
  }'
```

### Test Get Messages
```bash
curl https://isdamarket-3.onrender.com/messages/buyer_123/seller_456
```

### Test Conversations List
```bash
curl https://isdamarket-3.onrender.com/messages/conversations/buyer_123
```

### Test Notifications
```bash
curl https://isdamarket-3.onrender.com/notifications/buyer/buyer_123
```

---

## 📋 Backend Implementation Checklist

Use this checklist to verify your backend has all required endpoints:

### Reviews API
- [ ] `POST /reviews/` - Create review
- [ ] `GET /reviews/seller/{seller_uid}` - Get seller reviews
- [ ] Review creation triggers notification for seller

### Messages API
- [ ] `POST /messages/` - Send message
- [ ] `GET /messages/{user1_uid}/{user2_uid}` - Get conversation
- [ ] `GET /messages/conversations/{user_uid}` - Get conversation list (NEW)
- [ ] Messages are stored with correct timestamps
- [ ] Conversation list shows most recent message first

### Notifications API
- [ ] `GET /notifications/buyer/{buyer_uid}` - Get buyer notifications
- [ ] `GET /notifications/seller/{seller_uid}` - Get seller notifications
- [ ] `PATCH /notifications/{notification_uid}/read` - Mark as read
- [ ] `PATCH /notifications/buyer/{buyer_uid}/read-all` - Mark all as read
- [ ] `PATCH /notifications/seller/{seller_uid}/read-all` - Mark all as read
- [ ] `DELETE /notifications/{notification_uid}` - Delete notification
- [ ] `POST /notifications/` - Create notification (internal)

### Database Tables
- [ ] `reviews` table exists with correct schema
- [ ] `messages` table exists with correct schema
- [ ] `notifications` table exists with correct schema
- [ ] Proper indexes are created for performance

### CORS Configuration
- [ ] CORS is enabled for frontend domain
- [ ] All HTTP methods are allowed (GET, POST, PATCH, DELETE)
- [ ] Content-Type header is allowed

---

## 🔧 Quick Fixes You Can Try

### If Reviews Fail:
1. Check if the `reviewed` field exists in the orders table
2. Verify the order status is "delivered" before allowing review
3. Check if buyer_uid and seller_uid are valid

### If Messages Fail:
1. Verify userId is not null/undefined
2. Check if recipientId is valid
3. Ensure message text is not empty

### If Notifications Are Empty:
1. This is normal if no events have occurred yet
2. Create a test order to trigger notifications
3. Check if notification creation is triggered on order events

---

## 📞 What to Report to Backend Developer

After checking the console and network tab, report:

1. **Exact error message** from console
2. **HTTP status code** (404, 500, etc.)
3. **Request payload** that was sent
4. **Response body** from the backend
5. **Which endpoint** is failing

Example report:
```
Endpoint: POST /reviews/
Status: 500 Internal Server Error
Request: {
  "buyer_uid": "abc123",
  "seller_uid": "def456",
  "rating": 5,
  "comment": "Great!"
}
Response: {
  "error": "Column 'buyer_name' cannot be null"
}
```

This tells the backend developer exactly what's wrong!

---

## ✅ Next Steps

1. **Run the app** and try to submit a review or send a message
2. **Check the browser console** for the detailed logs
3. **Take a screenshot** of any errors
4. **Share the error details** with your backend developer
5. **Use the curl commands** above to test the backend directly

The frontend is now properly configured with detailed error logging. The issue is definitely in the backend implementation.
