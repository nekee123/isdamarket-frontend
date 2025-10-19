# Messaging System - Debug Guide

## ✅ Fixes Applied

### Fix 1: Messages Not Showing
- Added better error logging
- Added force refresh when arriving from product page
- Added `refreshKey` to force Conversations component to reload

### Fix 2: Page Redirect on Refresh
- Added 100ms delay in ProtectedRoute to wait for AuthContext to load from localStorage
- This prevents premature redirect to login page

## 🔍 How to Debug "No Messages Yet"

### Step 1: Check Browser Console
Open browser DevTools (F12) and look for these logs when you click "Message Seller":

```
✅ Good logs:
- "Sending message data: {sender_uid: ..., recipient_uid: ...}"
- "Response status: 200" or "Response status: 201"
- "Message sent successfully: {...}"
- "New message detected, forcing refresh..."

❌ Bad logs (errors):
- "Backend error: ..."
- "Failed to send message: ..."
- "Response status: 400" or "Response status: 500"
```

### Step 2: Check Backend is Running
Make sure your FastAPI backend is running:
```bash
# Should see:
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Check .env File
Verify your `.env` file has the correct backend URL:
```
REACT_APP_API_URL=http://localhost:8000
```

### Step 4: Test Backend Directly
Open a new terminal and test the messages endpoint:

```bash
# Test GET conversations
curl http://localhost:8000/messages/conversations/your_buyer_uid

# Test POST message
curl -X POST http://localhost:8000/messages/ \
  -H "Content-Type: application/json" \
  -d '{
    "sender_uid": "buyer_123",
    "sender_type": "buyer",
    "recipient_uid": "seller_456",
    "recipient_type": "seller",
    "message": "Test message"
  }'
```

### Step 5: Check Database
If backend returns 200 but messages don't show:
- Check if messages are actually saved in your database
- Check if the conversation endpoint returns data
- Verify user IDs match between frontend and backend

## 🧪 Testing Checklist

### Test 1: Send Message from Product
1. ✅ Login as buyer
2. ✅ Go to a product page
3. ✅ Open browser console (F12)
4. ✅ Click "Message Seller"
5. ✅ Check console for logs
6. ✅ Should redirect to `/buyer-dashboard/messages`
7. ✅ Wait 2-3 seconds
8. ✅ Conversation should appear

### Test 2: Page Refresh
1. ✅ Go to `/buyer-dashboard/messages`
2. ✅ Press F5 or Ctrl+R to refresh
3. ✅ Should stay on messages page (not redirect)
4. ✅ Conversations should reload

### Test 3: Manual Refresh Button
1. ✅ Go to `/buyer-dashboard/messages`
2. ✅ Click the 🔄 refresh button
3. ✅ Conversations should reload
4. ✅ Should stay on same page

## 🐛 Common Issues & Solutions

### Issue: "No Messages Yet" after sending
**Possible Causes:**
1. Backend not saving message
2. User IDs don't match
3. Conversation endpoint returning empty array
4. Frontend not refreshing properly

**Solutions:**
1. Check browser console for errors
2. Check backend logs
3. Test backend endpoint directly with curl
4. Click manual refresh button (🔄)
5. Wait 5 seconds for auto-refresh

### Issue: Page redirects on refresh
**Cause:** AuthContext not loaded yet from localStorage

**Solution:** 
- ✅ Already fixed! ProtectedRoute now waits 100ms
- If still happening, increase timeout in ProtectedRoute.js

### Issue: Backend returns 400 error
**Possible Causes:**
1. Missing required fields
2. Invalid user IDs
3. Wrong data types

**Solution:**
Check console logs for exact error message

### Issue: Backend returns 500 error
**Possible Causes:**
1. Database connection issue
2. Backend code error
3. Missing database tables

**Solution:**
Check backend terminal for error stack trace

## 📊 Expected Console Output

### When Clicking "Message Seller":
```javascript
Sending message data: {
  sender_uid: "buyer_123",
  sender_type: "buyer", 
  recipient_uid: "seller_456",
  recipient_type: "seller",
  message: "Hi! I'm interested in your product: Tuna"
}
Backend URL: http://localhost:8000/messages/
Response status: 201
Message sent successfully: {
  sender_uid: "buyer_123",
  recipient_uid: "seller_456",
  message: "Hi! I'm interested in your product: Tuna",
  created_at: "2024-01-15T10:30:00Z"
}
```

### When Arriving at Messages Page:
```javascript
New message detected, forcing refresh...
```

### When Conversations Load:
```javascript
Fetched conversations: [...]
```

## 🔧 Quick Fixes

### If messages still don't show after 5 seconds:
1. Click the manual refresh button (🔄)
2. Or refresh the page (F5)
3. Or navigate away and back to messages page

### If page still redirects on refresh:
1. Check localStorage has buyer_token and buyer_uid:
   - Open DevTools → Application → Local Storage
   - Look for `buyer_token` and `buyer_uid`
2. If missing, login again

### If backend errors persist:
1. Restart backend server
2. Check database is running
3. Verify all migrations are applied

## 📝 Summary

**What should happen:**
1. Click "Message Seller" → Message sent → Redirect to messages
2. Wait 2-3 seconds → Conversation appears
3. Click conversation → Chat opens
4. Type message → Send → Appears immediately
5. Refresh page (F5) → Stay on messages page

**If it doesn't work:**
1. Check browser console for errors
2. Check backend is running
3. Test backend endpoints directly
4. Check database has data
5. Try manual refresh button

Need more help? Check the logs and let me know what you see!
