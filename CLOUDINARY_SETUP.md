# Cloudinary Setup Guide

## Required Environment Variables in Vercel

Set these **exact** environment variable names in your Vercel project settings:

### Client-Side Variables (NEXT_PUBLIC_ prefix)
These are exposed to the browser, so use them for non-sensitive config:

```
NEXT_PUBLIC_USE_CLOUDINARY=true
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dt2nlraqg
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key_here
NEXT_CLOUDINARY_FOLDER=qi-ee-portfolio-pics
```

### Server-Side Variables (NO NEXT_PUBLIC_ prefix)
This is sensitive and only used server-side:

```
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Important Notes

1. **USE_CLOUDINARY must be the string "true"** (not boolean `true`)
2. **API_KEY and API_SECRET** are required to fetch images from Cloudinary Admin API
3. **FOLDER** is optional - defaults to "qi-ee-portfolio-pics" if not set
4. After setting variables, **redeploy** your Vercel project

## How to Get Your Cloudinary Credentials

1. Go to https://cloudinary.com/console
2. Navigate to Settings → Access Keys
3. Copy:
   - Cloud Name (already have: `dt2nlraqg`)
   - API Key
   - API Secret

## Verification

After deploying, check Vercel function logs for:
- `=== CLOUDINARY CONFIGURATION ===`
- Should show all values as SET (not MISSING)

