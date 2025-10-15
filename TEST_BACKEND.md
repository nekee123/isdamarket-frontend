# FastAPI Backend Testing Guide

## 🧪 Complete Test Suite for Your Backend

---

## 📋 Prerequisites

1. **Backend is running** at: `https://isdamarket-3.onrender.com`
2. **You have test buyer and seller accounts** (or create them first)
3. **You have test products** (or create them first)

---

## 🚀 Quick Test - PowerShell Commands

### Test 1: Submit a Review ⭐

```powershell
# Submit a review
$reviewBody = @{
    buyer_uid = "test_buyer_001"
    buyer_name = "John Doe"
    seller_uid = "test_seller_001"
    order_uid = "test_order_001"
    rating = 5
    comment = "Excellent fresh fish! Highly recommended."
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/reviews/" -Method POST -ContentType "application/json" -Body $reviewBody
```

**Expected Response:**
```json
{
  "uid": "generated-uuid",
  "buyer_uid": "test_buyer_001",
  "buyer_name": "John Doe",
  "seller_uid": "test_seller_001",
  "order_uid": "test_order_001",
  "rating": 5,
  "comment": "Excellent fresh fish! Highly recommended.",
  "created_at": "2024-01-15T10:30:00"
}
```

---

### Test 2: Get Seller Reviews 📊

```powershell
# Get all reviews for a seller
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/reviews/seller/test_seller_001" -Method GET
```

---

### Test 3: Send a Message 💬

```powershell
# Send a message
$messageBody = @{
    sender_uid = "test_buyer_001"
    sender_type = "buyer"
    recipient_uid = "test_seller_001"
    recipient_type = "seller"
    message = "Hi! Is the fish still fresh today?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/messages/" -Method POST -ContentType "application/json" -Body $messageBody
```

**Expected Response:**
```json
{
  "uid": "generated-uuid",
  "sender_uid": "test_buyer_001",
  "sender_type": "buyer",
  "recipient_uid": "test_seller_001",
  "recipient_type": "seller",
  "message": "Hi! Is the fish still fresh today?",
  "created_at": "2024-01-15T10:35:00"
}
```

---

### Test 4: Get Messages Between Users 📨

```powershell
# Get conversation between buyer and seller
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/messages/test_buyer_001/test_seller_001" -Method GET
```

---

### Test 5: Get Conversations List 📋

```powershell
# Get all conversations for a user
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/messages/conversations/test_buyer_001" -Method GET
```

**Expected Response:**
```json
[
  {
    "other_user_uid": "test_seller_001",
    "other_user_name": "Fresh Fish Market",
    "other_user_type": "seller",
    "last_message": "Hi! Is the fish still fresh today?",
    "last_message_time": "2024-01-15T10:35:00",
    "unread_count": 0
  }
]
```

---

### Test 6: Get Buyer Notifications 🔔

```powershell
# Get notifications for buyer
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/notifications/buyer/test_buyer_001" -Method GET
```

---

### Test 7: Get Seller Notifications 🔔

```powershell
# Get notifications for seller (should include review notification)
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/notifications/seller/test_seller_001" -Method GET
```

**Expected Response:**
```json
[
  {
    "uid": "generated-uuid",
    "recipient_uid": "test_seller_001",
    "recipient_type": "seller",
    "type": "new_review",
    "message": "John Doe left a 5-star review!",
    "read": false,
    "created_at": "2024-01-15T10:30:00"
  }
]
```

---

### Test 8: Mark Notification as Read ✅

```powershell
# Replace NOTIFICATION_UID with actual UID from previous test
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/notifications/NOTIFICATION_UID/read" -Method PATCH
```

---

### Test 9: Create Notification Manually 📢

```powershell
# Create a test notification
$notifBody = @{
    recipient_uid = "test_buyer_001"
    recipient_type = "buyer"
    type = "order_approved"
    message = "Your order has been approved!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/notifications/" -Method POST -ContentType "application/json" -Body $notifBody
```

---

## 🎯 Complete Test Script (PowerShell)

Save this as `test_backend.ps1`:

```powershell
# FastAPI Backend Test Script
$baseUrl = "https://isdamarket-3.onrender.com"

Write-Host "🧪 Testing IsdaMarket Backend..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Submit Review
Write-Host "Test 1: Submitting a review..." -ForegroundColor Yellow
$reviewBody = @{
    buyer_uid = "test_buyer_001"
    buyer_name = "John Doe"
    seller_uid = "test_seller_001"
    order_uid = "test_order_001"
    rating = 5
    comment = "Excellent fresh fish!"
} | ConvertTo-Json

try {
    $reviewResponse = Invoke-RestMethod -Uri "$baseUrl/reviews/" -Method POST -ContentType "application/json" -Body $reviewBody
    Write-Host "✅ Review created: $($reviewResponse.uid)" -ForegroundColor Green
    $reviewUid = $reviewResponse.uid
} catch {
    Write-Host "❌ Failed to create review: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Seller Reviews
Write-Host "Test 2: Getting seller reviews..." -ForegroundColor Yellow
try {
    $reviews = Invoke-RestMethod -Uri "$baseUrl/reviews/seller/test_seller_001" -Method GET
    Write-Host "✅ Found $($reviews.Count) review(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get reviews: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Send Message
Write-Host "Test 3: Sending a message..." -ForegroundColor Yellow
$messageBody = @{
    sender_uid = "test_buyer_001"
    sender_type = "buyer"
    recipient_uid = "test_seller_001"
    recipient_type = "seller"
    message = "Is the fish still fresh?"
} | ConvertTo-Json

try {
    $messageResponse = Invoke-RestMethod -Uri "$baseUrl/messages/" -Method POST -ContentType "application/json" -Body $messageBody
    Write-Host "✅ Message sent: $($messageResponse.uid)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send message: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get Messages
Write-Host "Test 4: Getting messages..." -ForegroundColor Yellow
try {
    $messages = Invoke-RestMethod -Uri "$baseUrl/messages/test_buyer_001/test_seller_001" -Method GET
    Write-Host "✅ Found $($messages.Count) message(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get messages: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get Conversations
Write-Host "Test 5: Getting conversations..." -ForegroundColor Yellow
try {
    $conversations = Invoke-RestMethod -Uri "$baseUrl/messages/conversations/test_buyer_001" -Method GET
    Write-Host "✅ Found $($conversations.Count) conversation(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get conversations: $_" -ForegroundColor Red
}

Write-Host ""

# Test 6: Get Buyer Notifications
Write-Host "Test 6: Getting buyer notifications..." -ForegroundColor Yellow
try {
    $buyerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/buyer/test_buyer_001" -Method GET
    Write-Host "✅ Found $($buyerNotifs.Count) notification(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get buyer notifications: $_" -ForegroundColor Red
}

Write-Host ""

# Test 7: Get Seller Notifications
Write-Host "Test 7: Getting seller notifications..." -ForegroundColor Yellow
try {
    $sellerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/seller/test_seller_001" -Method GET
    Write-Host "✅ Found $($sellerNotifs.Count) notification(s)" -ForegroundColor Green
    
    if ($sellerNotifs.Count -gt 0) {
        Write-Host "   Latest: $($sellerNotifs[0].message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get seller notifications: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check Neo4j Aura Browser"
Write-Host "2. Run: MATCH (n) RETURN labels(n), count(n)"
Write-Host "3. You should see Review, Message, and Notification nodes!"
```

**To run:**
```powershell
cd c:\Users\chuan\isdamarket-frontend
.\test_backend.ps1
```

---

## 🌐 Test Using Browser (Swagger UI)

### Option 1: Use FastAPI Docs

1. **Open:** `https://isdamarket-3.onrender.com/docs`
2. **Find the endpoint** you want to test
3. **Click "Try it out"**
4. **Enter test data**
5. **Click "Execute"**

### Example - Submit Review:

1. Go to `https://isdamarket-3.onrender.com/docs`
2. Find `POST /reviews/`
3. Click "Try it out"
4. Enter:
```json
{
  "buyer_uid": "test_buyer_001",
  "buyer_name": "John Doe",
  "seller_uid": "test_seller_001",
  "order_uid": "test_order_001",
  "rating": 5,
  "comment": "Great fish!"
}
```
5. Click "Execute"
6. Check response!

---

## 🔍 Verify in Neo4j Aura

After running tests, check Neo4j Aura Browser:

### Check Reviews
```cypher
MATCH (r:Review) RETURN r LIMIT 10
```

### Check Messages
```cypher
MATCH (m:Message) RETURN m LIMIT 10
```

### Check Notifications
```cypher
MATCH (n:Notification) RETURN n LIMIT 10
```

### Check All Data
```cypher
MATCH (n) RETURN labels(n) as Type, count(n) as Count
```

### Check Specific Test Data
```cypher
// Find test review
MATCH (r:Review {buyer_uid: "test_buyer_001"}) RETURN r

// Find test messages
MATCH (m:Message {sender_uid: "test_buyer_001"}) RETURN m

// Find test notifications
MATCH (n:Notification {recipient_uid: "test_seller_001"}) RETURN n
```

---

## 📱 Test Using Your Frontend

### Step 1: Login to Your App
1. Open: `http://localhost:3000` (or your frontend URL)
2. Login as a buyer

### Step 2: Create Test Data
1. **Place an order** for a product
2. **Wait for seller to mark as delivered**
3. **Submit a review** for the order
4. **Send a message** to the seller

### Step 3: Check Results
1. **Check notifications** - Click bell icon
2. **Check messages** - Click message icon
3. **Check Neo4j** - Run queries above

---

## 🐛 Troubleshooting

### Issue: "404 Not Found"
**Solution:** Check if backend is running at the correct URL

### Issue: "500 Internal Server Error"
**Solution:** Check backend logs for Neo4j connection errors

### Issue: "CORS Error"
**Solution:** Backend CORS is configured, but check if frontend URL is correct

### Issue: Data Not in Neo4j
**Solution:** 
1. Check `.env` file has correct Neo4j credentials
2. Verify Neo4j Aura instance is running
3. Check backend logs for database errors

---

## ✅ Success Criteria

After running all tests, you should see:

### In PowerShell:
- ✅ All tests show green checkmarks
- ✅ No red error messages
- ✅ Response data looks correct

### In Neo4j Aura:
- ✅ Review nodes exist
- ✅ Message nodes exist
- ✅ Notification nodes exist
- ✅ Data matches what you submitted

### In Your Frontend:
- ✅ Notifications appear in bell icon
- ✅ Messages appear in message icon
- ✅ Reviews show on seller profile
- ✅ No console errors

---

## 🎯 Quick Copy-Paste Tests

### Test Review (One Command):
```powershell
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/reviews/" -Method POST -ContentType "application/json" -Body '{"buyer_uid":"TEST001","buyer_name":"Test User","seller_uid":"SELLER001","order_uid":"ORDER001","rating":5,"comment":"Great!"}'
```

### Test Message (One Command):
```powershell
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/messages/" -Method POST -ContentType "application/json" -Body '{"sender_uid":"TEST001","sender_type":"buyer","recipient_uid":"SELLER001","recipient_type":"seller","message":"Hello!"}'
```

### Test Notification (One Command):
```powershell
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/notifications/" -Method POST -ContentType "application/json" -Body '{"recipient_uid":"TEST001","recipient_type":"buyer","type":"test","message":"Test notification"}'
```

---

## 📊 Expected Results Summary

| Test | Endpoint | Expected Result |
|------|----------|----------------|
| Submit Review | POST /reviews/ | Returns review with UID, creates notification |
| Get Reviews | GET /reviews/seller/{id} | Returns array of reviews |
| Send Message | POST /messages/ | Returns message with UID |
| Get Messages | GET /messages/{id1}/{id2} | Returns array of messages |
| Get Conversations | GET /messages/conversations/{id} | Returns conversation list |
| Get Notifications | GET /notifications/buyer/{id} | Returns array of notifications |
| Mark as Read | PATCH /notifications/{id}/read | Returns success message |

---

## 🚀 Ready to Test!

**Choose your method:**
1. **PowerShell Script** - Automated testing
2. **Swagger UI** - Visual testing
3. **Frontend App** - Real-world testing

**All methods will create data in Neo4j!** ✅
