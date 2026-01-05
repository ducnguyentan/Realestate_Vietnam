# Railway Deployment Setup Guide

## Current Issue

Backend deployment is failing with TypeScript compilation errors because Railway is building from `apps/backend` directory, but the monorepo structure requires building from the root.

## Solution: Configure Railway Service Settings

### Step 1: Update Root Directory (CRITICAL)

1. Go to Railway Dashboard: https://railway.app/project/your-project-id
2. Click on **"backend"** service
3. Click **"Settings"** tab
4. Scroll to **"Root Directory"** or **"Service Root Path"**
5. **DELETE** the current value (`apps/backend`)
6. Leave it **EMPTY** or set to `/`
7. Click **"Save"**

### Step 2: Update Watch Paths (Optional)

Still in Settings:

1. Find **"Watch Paths"** section
2. Set to: `apps/backend/**`
3. This ensures Railway only redeploys when backend code changes

### Step 3: Environment Variables

Add these in Railway Settings → Variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-neon-database-url>
REDIS_URL=<your-upstash-redis-url>
JWT_SECRET=<your-jwt-secret>
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=<your-s3-access-key>
S3_SECRET_KEY=<your-s3-secret-key>
S3_BUCKET=realestate-uploads-prod
S3_REGION=ap-southeast-1
```

Copy values from `apps/backend/.env`

### Step 4: Verify Build Configuration

The `railway.json` and `nixpacks.toml` files are already configured correctly:

- **Build**: `pnpm install && pnpm --filter backend build`
- **Start**: `cd apps/backend && node dist/main.js`

### Step 5: Redeploy

After changing Root Directory:

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger deployment

## Why This Is Required

Railway needs to:

1. Install dependencies from root `pnpm-lock.yaml`
2. Build workspace packages (`@realestate/database`, etc.)
3. Then build backend with access to workspace deps
4. Run from `apps/backend/dist/main.js`

Building from `apps/backend` alone fails because workspace dependencies aren't available.

## Alternative: Manual Deploy Command

If you can't change Root Directory in UI, try setting these in Railway Settings:

**Build Command**:

```bash
pnpm install && pnpm --filter backend build
```

**Start Command**:

```bash
cd apps/backend && node dist/main.js
```

## Troubleshooting

### Error: "Found 14 error(s)" during build

This means TypeScript can't find workspace dependencies. Ensure Root Directory is set to `/` or empty.

### Error: "pnpm: not found"

Nixpacks should install pnpm. Check `nixpacks.toml` is present in `apps/backend/`.

### Error: "Cannot find module '@realestate/database'"

Workspace packages not built. Ensure build runs from root with `pnpm --filter backend build`.

## Expected Result

After correct configuration:

- Build should take ~2-3 minutes
- You'll receive a URL: `https://backend-production-xxxx.up.railway.app`
- Health check at: `https://backend-production-xxxx.up.railway.app/api/health`

## Next Steps

Once backend deploys successfully:

1. Copy the Railway URL
2. Add to Vercel: `NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api`
3. Redeploy Vercel frontend
