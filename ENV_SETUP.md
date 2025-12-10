# Environment Variables Setup Guide

## Required Environment Variables

### 1. Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **What it is**: Your Supabase project URL
- **Where to find it**: Supabase Dashboard → Settings → API → Project URL
- **Example**: `https://your-project-id.supabase.co`
- **Note**: This is safe to expose client-side (starts with `NEXT_PUBLIC_`)

#### `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL - KEEP SECRET**
- **What it is**: Service role key for server-side operations (Storage uploads, etc.)
- **Where to find it**: Supabase Dashboard → Settings → API → `service_role` key (under "Project API keys")
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **⚠️ SECURITY WARNING**: 
  - **NEVER** expose this to the client-side
  - **NEVER** commit this to Git
  - Only use it in server-side code (API routes, server components)
  - This key bypasses Row Level Security (RLS) - use with caution

### 2. Database Configuration

#### `DATABASE_URL`
- **What it is**: PostgreSQL connection string
- **Where to find it**: Supabase Dashboard → Settings → Database → Connection string → URI
- **Example**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **⚠️ SECURITY WARNING**: Contains database password - keep secret

### 3. Stripe Configuration (for payments)

#### `STRIPE_SECRET_KEY`
- **What it is**: Stripe secret key for server-side operations
- **Where to find it**: Stripe Dashboard → Developers → API keys → Secret key
- **Example**: `sk_live_...` or `sk_test_...`
- **⚠️ SECURITY WARNING**: Keep secret, never expose to client

#### `STRIPE_WEBHOOK_SECRET`
- **What it is**: Webhook secret for verifying Stripe webhook events
- **Where to find it**: Stripe Dashboard → Developers → Webhooks → Signing secret
- **⚠️ SECURITY WARNING**: Keep secret

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **What it is**: Stripe publishable key (safe for client-side)
- **Where to find it**: Stripe Dashboard → Developers → API keys → Publishable key
- **Example**: `pk_live_...` or `pk_test_...`
- **Note**: Safe to expose client-side (starts with `NEXT_PUBLIC_`)

## Setup Instructions

### Step 1: Create `.env` file
Create a `.env` file in the root of your project (if it doesn't exist):

```bash
touch .env
```

### Step 2: Add Environment Variables
Add all required variables to your `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Restart Development Server
After adding environment variables, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Security Checklist

- [ ] `.env` file is in `.gitignore` (should already be there)
- [ ] Never commit `.env` file to Git
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only used in server-side code
- [ ] All secrets are set in production environment (Vercel, etc.)
- [ ] Database connection uses SSL in production

## Production Setup (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all environment variables (same as `.env` file)
4. Make sure to set them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY environment variable is not set"
- Make sure you've added it to your `.env` file
- Restart your development server after adding it
- Check that the variable name is exactly `SUPABASE_SERVICE_ROLE_KEY` (no typos)

### "Bucket not found" errors
- Make sure you've created the required Supabase Storage buckets:
  - `meal_pdf` (for meal plan PDFs)
  - `training_pdf` (for training plan PDFs)
  - `pdf_logos` (for logo uploads)
- Buckets should be **public** for PDFs and logos

### Logo upload fails
- Check that `pdf_logos` bucket exists and is public
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check file size (must be < 5MB)
- Check file type (must be an image)

