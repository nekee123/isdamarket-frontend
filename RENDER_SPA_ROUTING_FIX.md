# Render SPA Routing Fix - Complete Guide

## 🎯 Problem
When deploying a React app (with React Router) to Render as a static site, refreshing any page shows "Not Found" error.

**Why this happens:**
- User visits `/profile` → React Router loads the Profile component ✅
- User refreshes page → Browser requests `/profile` from server
- Server looks for a file called `profile` → Doesn't exist ❌
- Server returns 404 "Not Found" ❌

## ✅ Solution
Configure Render to serve `index.html` for ALL routes, so React Router can handle routing client-side.

---

## 📁 Required Files & Structure

Your project should have these files in the **root directory** (same level as `package.json`):

```
isdamarket-frontend/
├── package.json          ✅ Your React app config
├── static.json          ✅ Render routing config (REQUIRED)
├── render.yaml          ✅ Render service config
├── public/
│   └── _redirects       ✅ Backup fallback
├── src/
│   ├── App.js           (React Router setup)
│   └── pages/           (Your route components)
└── build/               (Generated after build)
```

---

## 🔧 Configuration Files

### 1. `static.json` (Root Directory) ⭐ MOST IMPORTANT

**Location:** `isdamarket-frontend/static.json`

```json
{
  "root": "build/",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Explanation:**
- `"root": "build/"` - Where your built files are (Create React App uses `build/`, Vite uses `dist/`)
- `"src": "/(.*)"` - Regex pattern that matches **ALL routes**
  - `/` → matches
  - `/profile` → matches
  - `/orders` → matches
  - `/seller/dashboard` → matches
  - `/any/nested/route` → matches
- `"dest": "/index.html"` - Serve index.html for all matched routes

**Alternative patterns:**
```json
// These all work the same:
{ "src": "/(.*)", "dest": "/index.html" }     ✅ Recommended
{ "src": "/.*", "dest": "/index.html" }       ✅ Also works
{ "src": "/**", "dest": "/index.html" }       ✅ Also works
```

---

### 2. `render.yaml` (Root Directory)

**Location:** `isdamarket-frontend/render.yaml`

```yaml
services:
  - type: web
    name: isdamarket-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./build
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Explanation:**
- `env: static` - Tells Render this is a static site
- `staticPublishPath: ./build` - Where to serve files from
- `routes` - Additional routing config (works with static.json)

---

### 3. `public/_redirects` (Backup Fallback)

**Location:** `isdamarket-frontend/public/_redirects`

```
/*    /index.html   200
```

**Explanation:**
- This file gets copied to `build/` during build
- Acts as a fallback if static.json doesn't work
- Format: `[source] [destination] [status code]`

---

## 🚀 How It Works

### Before Fix (❌ Broken)
```
User visits: https://your-app.onrender.com/profile
↓
User refreshes (F5)
↓
Browser requests: /profile
↓
Render looks for file: build/profile
↓
File doesn't exist
↓
❌ Returns 404 "Not Found"
```

### After Fix (✅ Working)
```
User visits: https://your-app.onrender.com/profile
↓
User refreshes (F5)
↓
Browser requests: /profile
↓
Render reads static.json
↓
Matches route: { "src": "/(.*)", "dest": "/index.html" }
↓
Serves: build/index.html
↓
React app loads
↓
React Router reads URL: /profile
↓
React Router loads: Profile component
↓
✅ Page displays correctly
```

---

## 📋 Deployment Checklist

### ✅ Before Deploying

1. **Verify file locations:**
   ```bash
   # Check static.json exists in root
   ls static.json
   
   # Check _redirects exists in public
   ls public/_redirects
   ```

2. **Verify static.json format:**
   - Must be valid JSON
   - `routes` must be an **array** `[]`, not object `{}`
   - Must have `src` and `dest` properties

3. **Test build locally:**
   ```bash
   npm run build
   
   # Serve locally to test
   npx serve -s build
   ```

### ✅ Deploy to Render

1. **Commit all files:**
   ```bash
   git add static.json render.yaml public/_redirects
   git commit -m "fix: Add Render SPA routing configuration"
   git push origin main
   ```

2. **Render auto-deploys:**
   - Detects push
   - Runs `npm install && npm run build`
   - Reads `static.json`
   - Deploys to production

3. **Monitor deployment:**
   - Go to Render Dashboard
   - Check build logs
   - Wait for "Your site is live 🎉"

---

## 🧪 Testing After Deployment

### Test 1: Direct URL Access
```
Visit: https://your-app.onrender.com/profile
✅ Should load Profile page directly
```

### Test 2: Refresh Test
```
1. Visit: https://your-app.onrender.com/orders
2. Press F5 (Refresh)
✅ Should stay on Orders page (not show "Not Found")
```

### Test 3: Nested Routes
```
Visit: https://your-app.onrender.com/seller/dashboard
Press F5
✅ Should stay on Seller Dashboard
```

### Test 4: Browser Navigation
```
1. Visit homepage
2. Click to /profile
3. Click browser back button
4. Click browser forward button
✅ All navigation should work smoothly
```

### Test 5: Invalid Routes
```
Visit: https://your-app.onrender.com/invalid-page
✅ Should show your custom 404/NotFound page (if you have one)
✅ OR show blank page (if no 404 handler in React Router)
```

---

## 🐛 Troubleshooting

### Issue: Still showing "Not Found" after deployment

**Solution 1: Verify static.json format**
```json
// ❌ WRONG - routes is an object
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  }
}

// ✅ CORRECT - routes is an array
{
  "root": "build/",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Solution 2: Check file location**
```bash
# static.json MUST be in root directory
isdamarket-frontend/
├── static.json          ✅ HERE (correct)
├── src/
│   └── static.json      ❌ NOT HERE (wrong)
└── public/
    └── static.json      ❌ NOT HERE (wrong)
```

**Solution 3: Clear browser cache**
```
1. Press Ctrl + Shift + Delete (Windows) or Cmd + Shift + Delete (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Or try incognito/private mode
```

**Solution 4: Hard refresh**
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

**Solution 5: Check Render build logs**
```
1. Go to Render Dashboard
2. Select your service
3. Click "Logs"
4. Look for errors during build
5. Verify "Your site is live 🎉" appears
```

---

### Issue: Works on localhost but not on Render

**Cause:** Local dev server (webpack-dev-server) automatically handles SPA routing. Production server needs explicit configuration.

**Solution:** Ensure `static.json` is committed and pushed:
```bash
git status
# Should NOT show "static.json" as untracked

git add static.json
git commit -m "fix: Add static.json for SPA routing"
git push origin main
```

---

### Issue: Some routes work, others don't

**Cause:** Incorrect regex pattern in static.json

**Solution:** Use `"/(.*)"` to match ALL routes:
```json
{
  "root": "build/",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 📊 Configuration Comparison

### Create React App (CRA)
```json
{
  "root": "build/",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Vite
```json
{
  "root": "dist/",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Only difference:** `"root"` directory
- CRA builds to `build/`
- Vite builds to `dist/`

---

## 🎯 Summary

### Required Files (All in Root Directory)

1. **static.json** ⭐ MOST IMPORTANT
   - Tells Render to serve index.html for all routes
   - Must be in root directory
   - Must use array format for routes

2. **render.yaml**
   - Configures Render service
   - Specifies build command and publish path

3. **public/_redirects**
   - Backup fallback
   - Gets copied to build/ during build

### How to Deploy

```bash
# 1. Ensure all files exist
ls static.json render.yaml public/_redirects

# 2. Commit and push
git add .
git commit -m "fix: Configure SPA routing for Render"
git push origin main

# 3. Wait for Render to deploy (2-5 minutes)

# 4. Test all routes with refresh
```

### Expected Behavior After Fix

✅ Refreshing any page stays on that page  
✅ Direct URL access works  
✅ Browser back/forward works  
✅ Nested routes work  
✅ No "Not Found" errors  

---

## 📚 Additional Resources

- [Render Static Site Docs](https://render.com/docs/static-sites)
- [React Router Docs](https://reactrouter.com/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)

---

**Status:** ✅ Configuration Complete  
**Your App:** Ready for deployment with proper SPA routing!
