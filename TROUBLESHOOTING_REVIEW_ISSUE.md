# Troubleshooting "Failed to Submit Review"

## 🔍 Possible Issues

### Issue 1: Backend Not Deployed ❌
**Problem:** Your backend is running on localhost, but frontend is trying to reach `https://isdamarket-3.onrender.com`

**Check:**
```powershell
# Test if backend is accessible
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/docs"
```

**If this fails:** Your backend is not deployed or not running on Render.

**Solution:**
1. Deploy your backend to Render
2. OR change `.env` to use localhost:
```env
REACT_APP_API_URL=http://localhost:8000
```

---

### Issue 2: Backend Running Locally Only ❌
**Problem:** Backend is only running on your computer (localhost:8000)

**Check:**
1. Is your backend server running?
2. Open: `http://localhost:8000/docs`
3. If it works, backend is local only

**Solution Option A - Use Local Backend:**
```env
# Change .env file
REACT_APP_API_URL=http://localhost:8000
```

Then restart your React app:
```powershell
# Stop the app (Ctrl+C)
# Start again
npm start
```

**Solution Option B - Deploy Backend:**
Deploy your backend to Render so it's accessible at `https://isdamarket-3.onrender.com`

---

### Issue 3: Order Not Delivered Yet ❌
**Problem:** You can only review orders with status "delivered"

**Check in Browser Console:**
1. Press `F12`
2. Go to Console tab
3. Try to submit review
4. Look for error message

**Common Error:**
```
Order status must be 'delivered' to submit a review
```

**Solution:**
1. Make sure the order status is "delivered"
2. Seller needs to mark the order as delivered first

---

### Issue 4: Already Reviewed ❌
**Problem:** You already submitted a review for this order

**Error Message:**
```
Review already submitted for this order
```

**Solution:**
Try reviewing a different order that hasn't been reviewed yet

---

### Issue 5: Missing Order Data ❌
**Problem:** The order doesn't have required data (seller_uid, order_uid, etc.)

**Check Browser Console:**
Look for error like:
```
seller_uid is undefined
order_uid is undefined
```

**Solution:**
Make sure the order has all required fields when fetched from backend

---

## 🧪 Quick Diagnostic Tests

### Test 1: Check if Backend is Accessible

**PowerShell:**
```powershell
# Test if backend is online
try {
    Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/docs"
    Write-Host "✅ Backend is accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT accessible!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Yellow
}
```

### Test 2: Test Review Endpoint Directly

**PowerShell:**
```powershell
# Try to submit a test review
$reviewBody = @{
    buyer_uid = "test_buyer"
    buyer_name = "Test User"
    seller_uid = "test_seller"
    order_uid = "test_order"
    rating = 5
    comment = "Test review"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/reviews/" -Method POST -ContentType "application/json" -Body $reviewBody
    Write-Host "✅ Review endpoint works!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Review endpoint failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Yellow
}
```

### Test 3: Check Browser Console

1. Open your app: `http://localhost:3000`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Try to submit a review
5. Look for errors in red

**Common Errors:**

**Error A: Network Error**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```
→ Backend is not running or not accessible

**Error B: CORS Error**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```
→ Backend CORS not configured (but your backend has this, so unlikely)

**Error C: 404 Not Found**
```
POST https://isdamarket-3.onrender.com/reviews/ 404 (Not Found)
```
→ Backend endpoint doesn't exist or wrong URL

**Error D: 500 Server Error**
```
POST https://isdamarket-3.onrender.com/reviews/ 500 (Internal Server Error)
```
→ Backend has an error (check backend logs)

---

## 🔧 Solutions Based on Your Setup

### Scenario A: Backend is Local (localhost:8000)

**Step 1:** Update `.env` file
```env
REACT_APP_API_URL=http://localhost:8000
```

**Step 2:** Restart React app
```powershell
# In your frontend terminal
# Press Ctrl+C to stop
npm start
```

**Step 3:** Make sure backend is running
```powershell
# In your backend terminal
cd c:\Users\chuan\OneDrive\Documents\IsdaMarket
python run.py
```

**Step 4:** Test again

---

### Scenario B: Backend is Deployed to Render

**Step 1:** Verify backend is running
```powershell
Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/docs"
```

**Step 2:** If backend is sleeping (Render free tier), wake it up
- Visit: `https://isdamarket-3.onrender.com/docs`
- Wait 30-60 seconds for it to wake up
- Try again

**Step 3:** Check Render logs
1. Go to Render dashboard
2. Open your backend service
3. Check logs for errors

---

### Scenario C: Backend Not Deployed Yet

**You need to deploy your backend!**

**Option 1: Deploy to Render**
1. Push your backend code to GitHub
2. Connect to Render
3. Deploy the service
4. Update environment variables in Render

**Option 2: Use Local Backend**
1. Keep backend running locally
2. Update `.env` to `http://localhost:8000`
3. Both frontend and backend must run on your computer

---

## 🎯 Most Likely Issue

Based on your question "is it because i didn't deploy it?", I think:

**Your backend is running locally (localhost:8000)**
**But your frontend is trying to reach the deployed URL (https://isdamarket-3.onrender.com)**

### Quick Fix:

**Option 1: Use Local Backend (Fastest)**
```powershell
# 1. Update .env file
# Change: REACT_APP_API_URL=https://isdamarket-3.onrender.com
# To:     REACT_APP_API_URL=http://localhost:8000

# 2. Restart React app
npm start

# 3. Make sure backend is running
# In another terminal:
cd c:\Users\chuan\OneDrive\Documents\IsdaMarket
python run.py
```

**Option 2: Deploy Backend (Production Ready)**
1. Deploy your backend to Render
2. Keep `.env` as is
3. Wait for deployment to complete
4. Test again

---

## 📋 Checklist

- [ ] Backend is running (either locally or deployed)
- [ ] `.env` file has correct API URL
- [ ] React app restarted after changing `.env`
- [ ] Order status is "delivered"
- [ ] Order hasn't been reviewed yet
- [ ] Browser console shows no errors
- [ ] Test review endpoint works (PowerShell test)

---

## 🚀 Quick Test

Run this to see what's wrong:

```powershell
Write-Host "Testing Backend Connection..." -ForegroundColor Cyan
Write-Host ""

# Test deployed backend
Write-Host "1. Testing deployed backend (Render)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "https://isdamarket-3.onrender.com/docs" -ErrorAction Stop | Out-Null
    Write-Host "   ✅ Deployed backend is accessible!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Deployed backend is NOT accessible!" -ForegroundColor Red
}

Write-Host ""

# Test local backend
Write-Host "2. Testing local backend (localhost)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:8000/docs" -ErrorAction Stop | Out-Null
    Write-Host "   ✅ Local backend is running!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Local backend is NOT running!" -ForegroundColor Red
}

Write-Host ""

# Check .env file
Write-Host "3. Checking .env configuration..." -ForegroundColor Yellow
$envContent = Get-Content "c:\Users\chuan\isdamarket-frontend\.env"
$apiUrl = ($envContent | Select-String "REACT_APP_API_URL").ToString()
Write-Host "   Current setting: $apiUrl" -ForegroundColor Cyan

Write-Host ""
Write-Host "Recommendation:" -ForegroundColor Green
if ($apiUrl -like "*localhost*") {
    Write-Host "   Your .env points to localhost. Make sure local backend is running!" -ForegroundColor Yellow
} else {
    Write-Host "   Your .env points to deployed backend. Make sure it's deployed and running!" -ForegroundColor Yellow
}
```

Run this and it will tell you exactly what's wrong! 🎯
