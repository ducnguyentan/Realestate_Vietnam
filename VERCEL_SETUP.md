# Vercel Deployment Setup Guide

## Current Issue: 404 NOT_FOUND Error

The deployment is failing because Vercel needs to be configured for this monorepo structure.

## Solution: Configure Vercel Project Settings

Go to your Vercel project settings and update the following:

### 1. General Settings

**Root Directory**: `apps/frontend`

- This tells Vercel where your Next.js app is located in the monorepo

**Framework Preset**: Next.js

- Let Vercel auto-detect (should be automatic)

### 2. Build & Development Settings

**Build Command**: Leave empty or use `pnpm build`

- Vercel will auto-detect Next.js build command

**Output Directory**: Leave empty

- Next.js outputs to `.next` by default

**Install Command**: `pnpm install`

- Use pnpm as package manager

**Development Command**: `pnpm dev`

### 3. Environment Variables

Make sure these are set in Vercel:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Alternative: Use vercel.json (Not Recommended for Next.js)

If you prefer to use `vercel.json`, create this at the project root:

```json
{
  "buildCommand": "cd apps/frontend && pnpm build",
  "devCommand": "cd apps/frontend && pnpm dev",
  "installCommand": "pnpm install"
}
```

**However**, the recommended approach is to configure the Root Directory in Vercel Dashboard instead.

## Steps to Fix

1. Go to https://vercel.com/your-username/realestate-vietnam/settings
2. Under "General" → Set **Root Directory** to `apps/frontend`
3. Click "Save"
4. Go to "Deployments" and click "Redeploy"

The 404 error should be resolved after this configuration.
