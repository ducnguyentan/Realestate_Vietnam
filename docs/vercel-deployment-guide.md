# Vercel Deployment Guide

## Frontend Deployment Steps

### 1. Get Railway Backend URL

1. Go to Railway dashboard → Click on **backend** service
2. Go to **Settings** tab → Find **Domains** section
3. Copy the public domain (e.g., `https://backend-production-xxxx.up.railway.app`)
4. The full API URL will be: `https://your-backend-domain.up.railway.app/api`

### 2. Configure Vercel Environment Variables

1. Go to Vercel dashboard → Select your frontend project
2. Go to **Settings** → **Environment Variables**
3. Add the following variable:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app/api
```

**Important Notes:**

- Replace `your-backend-domain.up.railway.app` with your actual Railway backend domain
- Include `/api` at the end (this is the API prefix configured in backend)
- The variable name must be `NEXT_PUBLIC_API_URL` (exactly as shown)
- This variable will be available in the browser since it starts with `NEXT_PUBLIC_`

### 3. Update Railway Backend CORS Configuration

After getting the Vercel frontend URL, update Railway backend environment variables:

1. Go to Railway dashboard → Click on **backend** service
2. Go to **Variables** tab
3. Update or add:

```bash
CORS_ORIGIN=https://your-frontend.vercel.app
```

Replace `your-frontend.vercel.app` with your actual Vercel frontend domain.

### 4. Redeploy Frontend

After adding environment variables in Vercel:

1. Go to **Deployments** tab
2. Click the **three dots** (···) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster) or rebuild from scratch

### 5. Verify Connection

After redeployment, test the frontend:

1. Open your Vercel frontend URL
2. Open browser DevTools (F12) → **Network** tab
3. Try to load data from the backend
4. Check if API requests are going to the correct Railway backend URL
5. Verify there are no CORS errors in the console

## Common Issues

### CORS Error

**Error:** `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:** Update `CORS_ORIGIN` in Railway backend variables to match your Vercel frontend URL

### API URL Not Working

**Error:** API requests go to wrong URL or fail

**Solution:**

- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure it includes the `/api` prefix
- Redeploy frontend after changing environment variables

### Environment Variables Not Applied

**Issue:** Changes to environment variables don't take effect

**Solution:**

- Vercel requires redeployment after changing environment variables
- Go to Deployments → Redeploy the latest deployment

## Production URLs

After deployment, you should have:

- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.up.railway.app`
- **API Endpoint:** `https://your-backend.up.railway.app/api`
- **API Docs:** `https://your-backend.up.railway.app/docs`

## Next Steps

1. Test all frontend features
2. Verify API integration works correctly
3. Check authentication flows
4. Test file uploads (if using S3/MinIO)
5. Monitor error logs in both Vercel and Railway
