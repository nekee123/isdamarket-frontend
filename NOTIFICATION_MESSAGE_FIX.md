# 🔔 Notification & Message System Fix

## 🎯 What You Want

### Notifications Should Show:

**For Sellers:**
- ✅ When someone buys from them (new order)
- ✅ When someone reviews them (new review)

**For Buyers:**
- ✅ When seller confirms their order (order approved)
- ✅ When seller rejects their order (order cancelled)
- ✅ When order is delivered (order delivered)

### Messages Should:
- ✅ Show unread count on message icon
- ✅ Notify when someone sends a message
- ✅ Display in message history dropdown

---

## 🔍 Current Status

### ✅ What's Already Working:

1. **Notification Component** - Frontend is correct
   - Polls for notifications every 30 seconds
   - Shows unread count badge
   - Mark as read functionality
   - Delete notifications

2. **Backend Endpoints** - All exist
   - `POST /notifications/` - Create notification
   - `GET /notifications/buyer/{uid}` - Get buyer notifications
   - `GET /notifications/seller/{uid}` - Get seller notifications
   - `PATCH /notifications/{uid}/read` - Mark as read

3. **Backend Triggers** - Already implemented
   - Order created → Notifies seller
   - Order status changed → Notifies buyer
   - Review submitted → Notifies seller

### ❌ What Might Be Missing:

1. **Notifications not appearing** - Backend might not be creating them
2. **Message notifications** - Need to add message notification triggers
3. **Real-time updates** - Currently polls every 30 seconds (this is normal)

---

## 🧪 Test If Notifications Are Working

### Test 1: Check if Backend Creates Notifications

**PowerShell:**
```powershell
# Create a test notification for seller
$notifBody = @{
    recipient_uid = "seller_456"
    recipient_type = "seller"
    type = "new_order"
    message = "New order received from Test Buyer!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/notifications/" -Method POST -ContentType "application/json" -Body $notifBody

# Then check if it appears
Invoke-RestMethod -Uri "http://localhost:8000/notifications/seller/seller_456" -Method GET
```

**If you see the notification** → Backend works, frontend should show it!

**If you don't see it** → Backend isn't saving to Neo4j

---

### Test 2: Check Frontend Notifications

1. Login as a seller
2. Look at the bell icon (🔔) in navbar
3. If there's a red badge with a number → Notifications are working!
4. Click the bell icon
5. You should see the notification

---

### Test 3: Test Order Notifications

**Create an order and check if seller gets notified:**

```powershell
# 1. Create an order (as buyer)
$orderBody = @{
    buyer_uid = "buyer_123"
    fish_product_uid = "product_456"
    quantity = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/orders/" -Method POST -ContentType "application/json" -Body $orderBody

# 2. Check seller notifications
Invoke-RestMethod -Uri "http://localhost:8000/notifications/seller/SELLER_UID_HERE" -Method GET
```

You should see a "new_order" notification!

---

## 🔧 Backend Verification

Your backend **already has** notification triggers in `order_controller.py`:

### ✅ New Order Notification:
```python
# When order is created (line 48-53)
OrderController._create_notification(
    recipient_uid=seller.uid,
    recipient_type="seller",
    notif_type="new_order",
    message=f"New order received from {buyer.name} for {product.name}!"
)
```

### ✅ Order Status Change Notifications:
```python
# When order is approved (line 104-109)
if new_status in ["confirmed", "accepted", "processing"]:
    OrderController._create_notification(
        recipient_uid=buyer.uid,
        recipient_type="buyer",
        notif_type="order_approved",
        message=f"Your order for {product.name} has been approved!"
    )

# When order is delivered (line 110-116)
elif new_status == "delivered":
    OrderController._create_notification(
        recipient_uid=buyer.uid,
        recipient_type="buyer",
        notif_type="order_delivered",
        message=f"Your order for {product.name} has been delivered!"
    )

# When order is cancelled (line 117-123)
elif new_status == "cancelled":
    OrderController._create_notification(
        recipient_uid=buyer.uid,
        recipient_type="buyer",
        notif_type="order_cancelled",
        message=f"Your order for {product.name} has been cancelled."
    )
```

### ✅ Review Notification:
```python
# When review is submitted (line 78-98 in review_routes.py)
notif_uid = str(uuid.uuid4())
notif_message = f"{review.buyer_name} left a {review.rating}-star review!"

session.run("""
    CREATE (n:Notification {
        uid: $uid,
        recipient_uid: $seller_uid,
        recipient_type: 'seller',
        type: 'new_review',
        message: $message,
        read: false,
        created_at: $created_at
    })
""", ...)
```

**All notification triggers are already in your backend!** ✅

---

## 💬 Message Notifications - NEEDS TO BE ADDED

Currently, when someone sends a message, **no notification is created**. Let's add this!

### Backend Fix Needed:

In your `message_routes.py`, after creating a message, add notification:

```python
# In send_message function, after creating the message (around line 90)

# Create notification for recipient
try:
    notif_uid = str(uuid.uuid4())
    notif_message = f"New message from {message.sender_type}: {message.message[:50]}..."
    
    session.run("""
        CREATE (n:Notification {
            uid: $uid,
            recipient_uid: $recipient_uid,
            recipient_type: $recipient_type,
            type: 'new_message',
            message: $message,
            read: false,
            created_at: $created_at
        })
    """, {
        "uid": notif_uid,
        "recipient_uid": message.recipient_uid,
        "recipient_type": message.recipient_type,
        "message": notif_message,
        "created_at": created_at
    })
except Exception as e:
    print(f"Error creating message notification: {e}")
```

---

## 🎯 Complete Testing Guide

### Test Scenario 1: Order Notifications

**As Buyer:**
1. Login as buyer
2. Browse products
3. Click "Buy Now" on a product
4. Order is created

**As Seller:**
1. Login as seller (use different browser or incognito)
2. Look at bell icon 🔔
3. **You should see red badge with "1"**
4. Click bell icon
5. **You should see: "New order received from [Buyer Name]"**

**Update Order Status:**
1. As seller, go to "My Orders"
2. Change order status to "confirmed"
3. Save

**As Buyer:**
1. Wait 30 seconds (or refresh)
2. Look at bell icon 🔔
3. **You should see notification: "Your order has been approved!"**

---

### Test Scenario 2: Review Notifications

**As Buyer:**
1. Wait for seller to mark order as "delivered"
2. Go to "My Orders"
3. Click "Write Review"
4. Submit 5-star review

**As Seller:**
1. Wait 30 seconds (or refresh)
2. Look at bell icon 🔔
3. **You should see: "[Buyer Name] left a 5-star review!"**

---

### Test Scenario 3: Message Notifications (After Backend Fix)

**As Buyer:**
1. Go to Browse page
2. Click "Message Seller"
3. Send a message: "Is the fish fresh?"

**As Seller:**
1. Wait 30 seconds (or refresh)
2. Look at bell icon 🔔
3. **You should see: "New message from buyer: Is the fish fresh?..."**
4. Look at message icon 💬
5. **You should see red badge with unread count**

---

## 🔍 Troubleshooting

### Issue 1: No Notifications Appearing

**Check:**
```powershell
# Test if backend is accessible
Invoke-RestMethod -Uri "http://localhost:8000/docs"

# Check if notifications exist in database
# Run in Neo4j Aura Browser:
MATCH (n:Notification) RETURN n LIMIT 10
```

**If no notifications in Neo4j:**
- Backend isn't creating them
- Check backend logs for errors
- Verify Neo4j connection

**If notifications exist in Neo4j but not showing in frontend:**
- Check browser console for errors (F12)
- Verify userId is correct
- Check API endpoint URL

---

### Issue 2: Notifications Delayed

**This is normal!** The frontend polls every 30 seconds.

**To make it faster, edit `NotificationDropdown.js`:**
```javascript
// Change line 17 from:
const interval = setInterval(fetchNotifications, 30000); // 30 seconds

// To:
const interval = setInterval(fetchNotifications, 5000); // 5 seconds
```

---

### Issue 3: Message Icon Not Showing Unread Count

**Check `MessageHistoryDropdown.js`:**

The component should calculate unread messages. If it's not working, we need to add unread count logic.

---

## 📋 Quick Fix Checklist

### For Notifications:
- [ ] Backend is running (`python run.py`)
- [ ] Frontend is running (`npm start`)
- [ ] `.env` points to `http://localhost:8000`
- [ ] Test creating a notification manually
- [ ] Check if it appears in Neo4j
- [ ] Check if it appears in frontend
- [ ] Test order creation → seller gets notified
- [ ] Test order status change → buyer gets notified
- [ ] Test review submission → seller gets notified

### For Messages:
- [ ] Send a message between buyer and seller
- [ ] Check if message saves to Neo4j
- [ ] Check if message appears in message history
- [ ] Add notification trigger for new messages (backend)
- [ ] Test message notification appears

---

## 🚀 Expected Behavior

### Seller Notifications:
```
🔔 (3)  ← Red badge with count

Click bell:
┌─────────────────────────────────┐
│ 🛒 New order received from      │
│    Juan Dela Cruz               │
│    2 minutes ago                │
├─────────────────────────────────┤
│ ⭐ Maria Santos left a          │
│    5-star review!               │
│    5 minutes ago                │
├─────────────────────────────────┤
│ 💬 New message from buyer       │
│    10 minutes ago               │
└─────────────────────────────────┘
```

### Buyer Notifications:
```
🔔 (2)  ← Red badge with count

Click bell:
┌─────────────────────────────────┐
│ ✅ Your order for Bangus has    │
│    been approved!               │
│    1 minute ago                 │
├─────────────────────────────────┤
│ 🚚 Your order for Tilapia has   │
│    been delivered!              │
│    30 minutes ago               │
└─────────────────────────────────┘
```

---

## 🎯 Summary

### ✅ What's Already Working:
- Notification component (frontend)
- Notification endpoints (backend)
- Order notifications (new order, status changes)
- Review notifications

### ❌ What Needs to Be Added:
- Message notifications (backend trigger)
- Unread message count on message icon

### 🔧 What to Do:
1. Test if notifications are being created in Neo4j
2. If yes → They should appear in frontend after 30 seconds
3. If no → Check backend logs for errors
4. Add message notification trigger to backend
5. Test all notification scenarios

---

## 💡 Quick Test Command

Run this to create a test notification and see if it appears:

```powershell
# Create notification
$notif = @{
    recipient_uid = "YOUR_SELLER_UID_HERE"
    recipient_type = "seller"
    type = "test"
    message = "This is a test notification!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/notifications/" -Method POST -ContentType "application/json" -Body $notif

# Wait 30 seconds, then check frontend bell icon!
```

If you see the notification → System works!
If you don't → Check browser console (F12) for errors.

---

Your notification system is **already built correctly**! It just needs testing to make sure the backend is creating notifications properly. 🎉
