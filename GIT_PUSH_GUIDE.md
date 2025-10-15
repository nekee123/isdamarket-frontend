# 📤 Git Push Guide for Frontend

## 🚀 Quick Commands

```powershell
# Navigate to your frontend folder
cd c:\Users\chuan\isdamarket-frontend

# Check git status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Add search, seller profile, notifications, and message features"

# Push to GitHub
git push origin main
```

---

## 📋 Step-by-Step Guide

### Step 1: Check Git Status
```powershell
cd c:\Users\chuan\isdamarket-frontend
git status
```

**You'll see:**
- Modified files (in red)
- New files (in red)
- Untracked files

---

### Step 2: Add All Changes
```powershell
git add .
```

**This adds:**
- All modified files
- All new files
- All changes to staging

**Or add specific files:**
```powershell
git add src/pages/BrowseFish.js
git add src/pages/SellerProfile.js
git add src/components/NotificationDropdown.js
```

---

### Step 3: Commit Changes
```powershell
git commit -m "Add search, seller profile, notifications, and message features"
```

**Good commit messages:**
```powershell
git commit -m "Add seller profile page with reviews"
git commit -m "Fix search functionality"
git commit -m "Add notification system"
git commit -m "Add message notifications"
git commit -m "Update .env to use localhost"
```

---

### Step 4: Push to GitHub
```powershell
git push origin main
```

**Or if your branch is named `master`:**
```powershell
git push origin master
```

---

## 🔍 Check Your Branch Name

```powershell
git branch
```

**You'll see:**
```
* main
```
or
```
* master
```

The `*` shows your current branch.

---

## ⚠️ If You Get Errors

### Error 1: "No upstream branch"

**Error message:**
```
fatal: The current branch main has no upstream branch.
```

**Fix:**
```powershell
git push -u origin main
```

---

### Error 2: "Remote rejected"

**Error message:**
```
! [rejected]        main -> main (fetch first)
```

**Fix:**
```powershell
# Pull first, then push
git pull origin main
git push origin main
```

---

### Error 3: "Not a git repository"

**Error message:**
```
fatal: not a git repository
```

**Fix - Initialize git:**
```powershell
git init
git remote add origin https://github.com/YOUR_USERNAME/isdamarket-frontend.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

### Error 4: "Authentication failed"

**You need to authenticate with GitHub.**

**Option 1: Use GitHub Desktop**
1. Download GitHub Desktop
2. Sign in with your GitHub account
3. Use it to push

**Option 2: Use Personal Access Token**
1. Go to GitHub.com
2. Settings → Developer settings → Personal access tokens
3. Generate new token
4. Use token as password when pushing

---

## 📦 What Files Will Be Pushed

### Modified Files:
- ✅ `src/pages/BuyerDashboard.js` - Added search handler
- ✅ `src/pages/BrowseFish.js` - Added View Profile button
- ✅ `src/pages/SellerProfile.js` - Fixed reviews endpoint
- ✅ `.env` - Changed to localhost

### New Files:
- ✅ `SEARCH_AND_PROFILE_FEATURE.md`
- ✅ `NOTIFICATION_MESSAGE_FIX.md`
- ✅ `NOTIFICATIONS_COMPLETE_GUIDE.md`
- ✅ `TEST_BACKEND.md`
- ✅ `test_backend.ps1`
- ✅ `test_notifications.ps1`
- ✅ `BACKEND_VERIFICATION_STEPS.md`
- ✅ And other documentation files

---

## 🚫 Files That Won't Be Pushed

These are in `.gitignore`:
- ❌ `node_modules/` - Too large, not needed
- ❌ `.env` - Contains sensitive info (MIGHT be ignored)
- ❌ `build/` - Generated files

---

## ⚠️ Important: Check .env

Your `.env` file might be in `.gitignore`. Check:

```powershell
cat .gitignore
```

**If you see `.env` in the list:**
- ✅ Good! It won't be pushed (keeps your secrets safe)
- But you need to manually update `.env` on deployment

**If `.env` is NOT in `.gitignore`:**
- ⚠️ It will be pushed to GitHub
- **Change it back to deployed URL before pushing:**

```env
REACT_APP_API_URL=https://isdamarket-3.onrender.com
```

---

## 🎯 Complete Push Process

```powershell
# 1. Navigate to frontend folder
cd c:\Users\chuan\isdamarket-frontend

# 2. Check what changed
git status

# 3. Check if .env will be pushed
cat .gitignore | Select-String ".env"

# 4. If .env is NOT ignored, change it back to deployed URL
# Edit .env file:
# REACT_APP_API_URL=https://isdamarket-3.onrender.com

# 5. Add all changes
git add .

# 6. Commit with descriptive message
git commit -m "Add search, seller profile, and notification features

- Add search functionality to navbar
- Add seller profile page with reviews
- Add View Profile button in browse page
- Fix notification system
- Add message notifications
- Update documentation"

# 7. Push to GitHub
git push origin main

# 8. If error, try:
git push -u origin main
```

---

## 📊 Verify Push Succeeded

### Check on GitHub:
1. Go to: `https://github.com/YOUR_USERNAME/isdamarket-frontend`
2. You should see your latest commit
3. Check the commit message and timestamp
4. Browse files to verify changes

### Check locally:
```powershell
git log --oneline -5
```

**You'll see your recent commits.**

---

## 🔄 After Pushing

### If you're deploying to Vercel/Netlify:
1. They will automatically detect the push
2. Start building your app
3. Deploy the new version
4. Your changes will be live!

### If deploying manually:
1. Pull the changes on your server
2. Run `npm install` (if package.json changed)
3. Run `npm run build`
4. Deploy the build folder

---

## 💡 Pro Tips

### Tip 1: Check Before Pushing
```powershell
# See what will be pushed
git diff

# See staged changes
git diff --staged
```

### Tip 2: Commit Often
```powershell
# Make small, frequent commits
git add src/pages/BrowseFish.js
git commit -m "Add View Profile button"

git add src/pages/SellerProfile.js
git commit -m "Fix reviews API endpoint"

git push origin main
```

### Tip 3: Use Meaningful Commit Messages
```powershell
# ❌ Bad
git commit -m "fix"
git commit -m "update"
git commit -m "changes"

# ✅ Good
git commit -m "Add seller profile page with reviews"
git commit -m "Fix search functionality in navbar"
git commit -m "Add notification system for orders and messages"
```

### Tip 4: Create .gitignore if Missing
```powershell
# Create .gitignore file
@"
node_modules/
build/
.env
.env.local
.DS_Store
*.log
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

---

## 🎯 Quick Reference

| Command | What it does |
|---------|-------------|
| `git status` | Show changed files |
| `git add .` | Add all changes |
| `git add <file>` | Add specific file |
| `git commit -m "message"` | Commit with message |
| `git push origin main` | Push to GitHub |
| `git pull origin main` | Pull from GitHub |
| `git log` | Show commit history |
| `git diff` | Show changes |
| `git branch` | Show current branch |

---

## 🚀 Ready to Push!

Run these commands now:

```powershell
cd c:\Users\chuan\isdamarket-frontend
git add .
git commit -m "Add search, seller profile, and notification features"
git push origin main
```

**Done!** Your changes are now on GitHub! 🎉
