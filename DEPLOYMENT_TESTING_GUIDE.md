# Deployment & Testing Guide

## 🚀 Deployment Steps

### 1. **Verify Environment Configuration**

Your app is configured to automatically use the correct backend URL:

- **Production**: `https://isdamarket-3.onrender.com` (automatic)
- **Development**: `http://localhost:8000` (automatic)

**Optional:** Set environment variable in Render dashboard:
```
REACT_APP_API_URL=https://isdamarket-3.onrender.com
```

### 2. **Build and Deploy**

```bash
# Commit your changes
git add .
git commit -m "feat: Add caching, optimize performance, fix dashboard stats"
git push origin main
```

Render will automatically:
1. Detect the push
2. Run `npm install`
3. Run `npm run build`
4. Deploy to production

### 3. **Monitor Build Logs**

1. Go to Render Dashboard
2. Select `isdamarket-frontend` service
3. Click "Logs" tab
4. Watch for:
   - ✅ "Build succeeded"
   - ✅ "Deploy succeeded"
   - ❌ Any errors

---

## 🧪 Testing Checklist

### **Before Deployment (Local Testing)**

Run these tests locally before pushing:

```bash
# Start local backend (if available)
# cd ../isdamarket-backend
# uvicorn main:app --reload

# Start frontend
npm start
```

#### ✅ Buyer Dashboard Tests
- [ ] Login as buyer
- [ ] Dashboard loads without errors
- [ ] "Active Orders" shows correct number
- [ ] "Total Purchases" shows correct number
- [ ] "Products Available" shows correct number
- [ ] Loading states show "..." during fetch
- [ ] Search redirects to Browse Fish page

#### ✅ Seller Dashboard Tests
- [ ] Login as seller
- [ ] Dashboard loads without errors
- [ ] "Pending Orders" shows real count (not 0)
- [ ] "Listed Products" shows real count (not 0)
- [ ] "Total Revenue" shows ₱ amount (not ₱0)
- [ ] Loading states show "..." during fetch
- [ ] All action buttons navigate correctly

#### ✅ Browse Fish Tests
- [ ] Products load successfully
- [ ] Products grouped by seller
- [ ] Search functionality works
- [ ] "Buy Now" creates order
- [ ] Loading spinner shows during purchase
- [ ] Success toast appears after purchase
- [ ] Out of stock products show "Out of Stock"

#### ✅ Performance Tests
- [ ] First page load completes in < 3 seconds
- [ ] Cached page load completes in < 0.5 seconds
- [ ] No console errors
- [ ] No infinite loops or excessive re-renders

---

### **After Deployment (Production Testing)**

Visit your deployed app: `https://your-app.onrender.com`

#### ✅ Initial Load Test
- [ ] Homepage loads correctly
- [ ] No 404 errors on routes
- [ ] All images load
- [ ] Fonts load correctly
- [ ] Console shows correct API URL: `https://isdamarket-3.onrender.com`

#### ✅ Cold Start Test
1. Wait 15+ minutes (Render free tier spins down)
2. Visit the app
3. Check:
   - [ ] First request takes 30-60 seconds (expected)
   - [ ] Loading states appear
   - [ ] Data eventually loads
   - [ ] No errors in console

#### ✅ Buyer Flow Test
1. Navigate to `/buyer-login`
2. Login with test buyer account
3. Check dashboard:
   - [ ] Stats load correctly
   - [ ] Numbers are real (not all zeros)
4. Click "Browse Fish"
   - [ ] Products load
   - [ ] Can search products
5. Click "Buy Now" on a product
   - [ ] Order created successfully
   - [ ] Toast notification appears
6. Go back to dashboard
   - [ ] "Active Orders" increased by 1

#### ✅ Seller Flow Test
1. Navigate to `/seller-login`
2. Login with test seller account
3. Check dashboard:
   - [ ] **Pending Orders** shows real number
   - [ ] **Listed Products** shows real number
   - [ ] **Total Revenue** shows ₱ amount
4. Click "My Products"
   - [ ] Products list loads
5. Click "Customer Orders"
   - [ ] Orders list loads

#### ✅ Caching Test
1. Visit Browse Fish page
2. Note load time (should be 1-3 seconds)
3. Navigate away and back
4. Check:
   - [ ] Page loads instantly (< 0.5s)
   - [ ] Console shows "Using cached products"
5. Wait 6 minutes
6. Refresh page
7. Check:
   - [ ] Console shows "Fetching fresh products from API"

#### ✅ Route Test
Test all routes work on refresh:
- [ ] `/` - Homepage
- [ ] `/buyer-login` - Buyer Login
- [ ] `/seller-login` - Seller Login
- [ ] `/buyer-dashboard` - Buyer Dashboard
- [ ] `/buyer-dashboard/browse` - Browse Fish
- [ ] `/buyer-dashboard/orders` - Buyer Orders
- [ ] `/buyer-dashboard/settings` - Buyer Settings
- [ ] `/seller-dashboard` - Seller Dashboard
- [ ] `/seller-dashboard/products` - Seller Products
- [ ] `/seller-dashboard/orders` - Seller Orders
- [ ] `/seller-dashboard/settings` - Seller Settings

---

## 🐛 Troubleshooting

### Issue: Dashboard shows all zeros

**Possible Causes:**
1. Backend is down
2. No data in database
3. API endpoint mismatch

**Solutions:**
```javascript
// Check console for API URL
console.log('API URL:', BASE_URL);

// Check network tab in DevTools
// Look for failed requests to /orders/ or /products/

// Verify backend is running
// Visit: https://isdamarket-3.onrender.com/docs
```

### Issue: "Failed to load products"

**Possible Causes:**
1. Backend cold start (first request after 15 min)
2. CORS error
3. Network timeout

**Solutions:**
1. Wait 60 seconds and try again
2. Check browser console for CORS errors
3. Verify backend is accessible:
   ```bash
   curl https://isdamarket-3.onrender.com/products/
   ```

### Issue: Slow page loads

**Possible Causes:**
1. Backend cold start
2. Large images
3. Too many API calls

**Solutions:**
1. Wait for backend to warm up
2. Check cache is working (console logs)
3. Verify parallel requests in Network tab

### Issue: Cache not working

**Check:**
```javascript
// Open browser console
// Navigate to Browse Fish
// Should see: "Using cached products"

// If you see "Fetching fresh products from API" every time:
// 1. Check cache duration (5 minutes)
// 2. Verify no errors during fetch
// 3. Check browser isn't in incognito mode
```

### Issue: Stats not updating

**Solutions:**
```javascript
// Manually clear cache
import { clearCache } from './services/api';
clearCache();

// Or wait 5 minutes for cache to expire
```

---

## 📊 Performance Monitoring

### Check API Response Times

Open DevTools → Network tab:

1. Filter by "Fetch/XHR"
2. Look for requests to `/products/`, `/orders/`
3. Check timing:
   - **First request**: 500ms - 2s (acceptable)
   - **Cached request**: 0-50ms (excellent)
   - **Cold start**: 30-60s (expected on free tier)

### Check Bundle Size

```bash
npm run build

# Check build/static/js/*.js file sizes
# Main bundle should be < 500KB
```

### Check Lighthouse Score

1. Open DevTools → Lighthouse
2. Run audit
3. Target scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 80

---

## 🔍 Debugging Tools

### Console Logs

The app logs important events:

```javascript
// API URL being used
"Using API URL from environment: https://isdamarket-3.onrender.com"

// Cache hits
"Using cached products"
"Using cached buyer orders"

// Fresh fetches
"Fetching fresh products from API"
"Fetching buyer orders from API"

// Cache invalidation
"Cache cleared"
```

### Network Tab

Monitor API calls:
- Green (200): Success
- Yellow (304): Cached by browser
- Red (404/500): Error
- Pending: Waiting for response

### React DevTools

Install React DevTools extension:
1. Check component re-renders
2. Inspect props and state
3. Profile performance

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ All routes load without 404 errors
2. ✅ Buyer dashboard shows real stats
3. ✅ Seller dashboard shows real stats (not zeros)
4. ✅ Browse Fish loads products
5. ✅ Buy Now creates orders
6. ✅ Cache works (instant loads on revisit)
7. ✅ No console errors
8. ✅ Backend URL is `https://isdamarket-3.onrender.com`
9. ✅ Page loads in < 3 seconds (after cold start)
10. ✅ All user flows work end-to-end

---

## 📞 Support

If you encounter issues:

1. **Check console logs** - Most errors are logged
2. **Check Network tab** - See failed API calls
3. **Check Render logs** - Backend errors appear here
4. **Clear cache** - `clearCache()` in console
5. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

**Last Updated:** October 2025  
**Status:** ✅ Ready for Testing
