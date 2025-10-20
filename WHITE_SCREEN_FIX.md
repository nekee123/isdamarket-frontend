# White Screen on Refresh - Troubleshooting Guide

## 🔍 Problem
When you refresh the page in production, you get a white screen instead of your React app.

## 🎯 Root Causes

### 1. **Hosting Platform Routing Issue** (Most Common)
Single Page Applications (SPAs) like React use client-side routing. When you refresh on a route like `/buyer-dashboard`, the server looks for that file and returns 404, causing a white screen.

### 2. **Chunk Loading Failures**
When you deploy a new version, old cached JavaScript chunks may no longer exist, causing loading errors.

### 3. **Missing Environment Variables**
Production builds need `.env.production` file with correct API URLs.

## ✅ Solutions Applied

### 1. Created `.env.production`
```
REACT_APP_API_URL=https://isdamarket-3.onrender.com
```

### 2. Added Error Handler in `index.html`
- Automatically reloads once if chunk loading fails
- Shows user-friendly error message if reload doesn't work
- Provides clear instructions to clear cache

### 3. Updated Build Script
- Added `build:windows` command for Windows users
- Disabled source maps to reduce bundle size

### 4. Created Platform-Specific Configs
- ✅ `netlify.toml` - For Netlify
- ✅ `_redirects` - For Netlify
- ✅ `vercel.json` - For Vercel

## 🚀 Deployment Steps

### For Netlify:
1. Build the app:
   ```bash
   npm run build:windows
   ```

2. Deploy to Netlify:
   - Drag and drop the `build` folder to Netlify
   - OR connect your Git repo and set:
     - Build command: `npm run build`
     - Publish directory: `build`

3. The `netlify.toml` and `_redirects` files will automatically configure routing.

### For Vercel:
1. Build the app:
   ```bash
   npm run build:windows
   ```

2. Deploy to Vercel:
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel --prod`
   - OR connect your Git repo

3. The `vercel.json` file will automatically configure routing.

### For Other Platforms:

#### GitHub Pages:
Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/isdamarket-frontend"
```

Then use `HashRouter` instead of `BrowserRouter` in `App.js`:
```javascript
import { HashRouter as Router } from "react-router-dom";
```

#### Render (Static Site):
1. Create a new Static Site on Render
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add rewrite rule in Render dashboard:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

## 🧪 Testing After Deployment

1. **Test direct URL access:**
   - Go to `https://your-site.com/buyer-dashboard`
   - Refresh the page (F5)
   - Should load correctly, not show 404 or white screen

2. **Test after clearing cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Visit your site again

3. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Look for failed requests in Network tab

## 🔧 If Still Getting White Screen

### Step 1: Check Browser Console
Press F12 and look for errors. Common errors:

**"Loading chunk X failed"**
- Solution: Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- The error handler in `index.html` should auto-reload once

**"Failed to fetch"**
- Solution: Check if backend is running
- Verify API URL in `.env.production`

**"404 Not Found"**
- Solution: Your hosting platform isn't configured correctly
- Check that you have the right config file for your platform

### Step 2: Verify Hosting Configuration

**Netlify:**
- Check that `netlify.toml` exists in project root
- Check that `public/_redirects` exists
- In Netlify dashboard, check "Deploys" tab for errors

**Vercel:**
- Check that `vercel.json` exists in project root
- In Vercel dashboard, check deployment logs

**Render:**
- Check that rewrite rules are configured
- Go to Settings → Redirects/Rewrites
- Add: `/* → /index.html (rewrite)`

### Step 3: Clear All Caches

**Browser Cache:**
```
Ctrl+Shift+Delete → Clear cached images and files
```

**Service Worker (if any):**
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

**CDN Cache (if using Netlify/Vercel):**
- Netlify: Site settings → Build & deploy → Post processing → Clear cache
- Vercel: Deployments → Click deployment → Clear cache

### Step 4: Test Locally First

Before deploying, test the production build locally:

```bash
# Build the app
npm run build:windows

# Serve the build folder
npx serve -s build -p 3000
```

Then test:
1. Go to `http://localhost:3000`
2. Navigate to different pages
3. Refresh on each page
4. Check for white screens

If it works locally but not in production, it's a hosting configuration issue.

## 📋 Checklist Before Deployment

- [ ] `.env.production` file exists with correct API URL
- [ ] Correct config file for your hosting platform exists
- [ ] Build completes without errors: `npm run build:windows`
- [ ] Test production build locally with `npx serve -s build`
- [ ] All routes work when refreshed locally
- [ ] Backend API is accessible from frontend domain

## 🆘 Emergency Fix

If nothing works and you need the site up NOW:

**Option 1: Use HashRouter (Quick Fix)**
In `src/App.js`, change:
```javascript
import { HashRouter as Router } from "react-router-dom";
```

This adds `#` to URLs (e.g., `yoursite.com/#/buyer-dashboard`) which works on any hosting platform without configuration. Not ideal for SEO but works everywhere.

**Option 2: Deploy to Netlify**
Netlify has the best SPA support out of the box:
1. Drag and drop your `build` folder to https://app.netlify.com/drop
2. Done! It will work immediately.

## 📞 Need More Help?

Check these in order:
1. Browser console (F12) for error messages
2. Hosting platform logs/dashboard
3. Network tab (F12) to see which requests are failing
4. Backend logs to verify API is working

## 🎉 Success Indicators

You'll know it's fixed when:
- ✅ You can refresh on any page without white screen
- ✅ Direct URL access works (e.g., `yoursite.com/buyer-dashboard`)
- ✅ No errors in browser console
- ✅ All API calls work correctly
- ✅ Navigation between pages is smooth
