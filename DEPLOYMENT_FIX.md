# Deployment Fix Guide

## Problem

You're getting a Vite build error on Render because:
- Your repo has both frontend (React/Vite) and backend (Node.js/Express)
- Render is trying to build the frontend when it should only run the backend
- Frontend should be deployed separately on Vercel or Netlify

## Solution: Separate Deployments

### Backend → Render
### Frontend → Vercel or Netlify

---

## Step 1: Fix Render Backend Deployment

### Option A: Use render.yaml (Recommended)

I've created `render.yaml` in your root directory. This tells Render to:
- Only install dependencies from `server/` folder
- Only run the backend server
- Ignore the frontend code

**Steps:**
1. Commit the `render.yaml` file:
   ```bash
   git add render.yaml
   git commit -m "Add render.yaml for backend deployment"
   git push
   ```

2. In Render Dashboard:
   - Go to your service
   - It should automatically detect `render.yaml`
   - Or delete the current service and create a new one (it will auto-detect the yaml)

### Option B: Manual Configuration

If render.yaml doesn't work, manually configure in Render Dashboard:

**Build Command:**
```bash
cd server && npm install
```

**Start Command:**
```bash
cd server && node index.js
```

**Root Directory:** Leave empty (or set to `server`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

### 2.2 Configure Vercel

**Framework Preset:** Vite

**Root Directory:** Leave as `.` (root)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

### 2.3 Environment Variables (Vercel)

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

### 2.4 Update Frontend API URL

Create a new file: `src/config.js`

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

Then update `src/api.js` to use this:

```javascript
import axios from 'axios'
import { API_URL } from './config'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ... rest of your api.js code
```

---

## Step 3: Update CORS in Backend

Once you have your Vercel URL, update `server/index.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app', // Add your Vercel URL
  'https://your-custom-domain.com' // If you have a custom domain
]
```

---

## Alternative: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Import your repository

### 3.2 Configure Netlify

**Build Command:**
```bash
npm run build
```

**Publish Directory:**
```bash
dist
```

**Base Directory:** Leave empty

### 3.3 Environment Variables (Netlify)

Add in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## Complete Deployment Checklist

### Backend (Render):
- [ ] Add `render.yaml` to root
- [ ] Commit and push to GitHub
- [ ] Configure environment variables in Render:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `PORT=3001`
  - `UPI_ID=manashshinde@okaxis`
  - `ADMIN_EMAIL=admin@mayurpaints.com`
  - `ADMIN_PASSWORD=admin123`
- [ ] Deploy and verify: `https://your-app.onrender.com/api/health`
- [ ] Seed database via Render Shell: `node seed-professional.js`

### Frontend (Vercel/Netlify):
- [ ] Create `src/config.js` with API_URL
- [ ] Update `src/api.js` to use config
- [ ] Add environment variable: `VITE_API_URL`
- [ ] Deploy
- [ ] Test: Can access the site

### Final Steps:
- [ ] Update CORS in backend with frontend URL
- [ ] Redeploy backend
- [ ] Test complete flow:
  - [ ] Register/Login
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout
  - [ ] Payment
  - [ ] Admin verification

---

## Quick Fix for Current Error

If you want to fix the current Render deployment immediately:

### In Render Dashboard:

1. Go to your service
2. Click **Settings**
3. Update **Build Command:**
   ```bash
   cd server && npm install
   ```
4. Update **Start Command:**
   ```bash
   cd server && node index.js
   ```
5. Click **Save Changes**
6. Go to **Manual Deploy** → **Deploy latest commit**

This will make Render ignore the frontend and only deploy the backend.

---

## Environment Variables Summary

### Render (Backend):
```env
MONGO_URI=mongodb+srv://manashshinde_db_user:4o2X1KZ6NUzSGXcP@cluster0.5kyrnmk.mongodb.net/mayurpaints?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mayurpaints_super_secret_key_2024
NODE_ENV=production
PORT=3001
UPI_ID=manashshinde@okaxis
ADMIN_EMAIL=admin@mayurpaints.com
ADMIN_PASSWORD=admin123
```

### Vercel/Netlify (Frontend):
```env
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## Testing After Deployment

### 1. Test Backend
```bash
curl https://your-render-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "..."
}
```

### 2. Test Frontend
- Visit your Vercel/Netlify URL
- Open browser console
- Check if API calls are going to Render backend
- Test login/register

### 3. Test Complete Flow
- Register new user
- Browse products
- Add to cart
- Checkout with address
- Payment with QR code
- Upload screenshot
- Place order
- Login as admin
- Verify payment

---

## Troubleshooting

### Backend Issues:

**Error: "Cannot connect to MongoDB"**
- Check `MONGO_URI` in Render environment variables
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0

**Error: "Port already in use"**
- Render automatically assigns a port
- Make sure your code uses `process.env.PORT`

### Frontend Issues:

**Error: "Network Error" or "Failed to fetch"**
- Check `VITE_API_URL` is set correctly
- Verify CORS is configured in backend
- Check browser console for actual error

**Error: "404 on refresh"**
- Add `_redirects` file for Netlify:
  ```
  /*    /index.html   200
  ```
- Or `vercel.json` for Vercel:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

---

## Why Separate Deployments?

1. **Render Free Tier:**
   - Best for backend Node.js apps
   - Sleeps after 15 min of inactivity
   - Slower cold starts

2. **Vercel/Netlify Free Tier:**
   - Optimized for static sites (React, Vue, etc.)
   - Global CDN
   - Instant deployments
   - No sleep/cold starts
   - Better performance for frontend

3. **Best Practice:**
   - Separate concerns
   - Independent scaling
   - Easier debugging
   - Better performance

---

## Next Steps

1. **Fix Render Backend:**
   - Add `render.yaml` or update build/start commands
   - Redeploy

2. **Deploy Frontend:**
   - Choose Vercel or Netlify
   - Configure environment variables
   - Deploy

3. **Connect Them:**
   - Update CORS in backend
   - Test complete flow

4. **Optional:**
   - Add custom domain
   - Set up monitoring
   - Configure analytics

---

**Need Help?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
