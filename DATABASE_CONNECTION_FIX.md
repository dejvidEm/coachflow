# Database Connection Fix - ENOTFOUND Error

## Problem
```
Error: getaddrinfo ENOTFOUND db.uxegmixpgmtnughwgfgx.supabase.co
```

This means the database hostname cannot be resolved. This is usually because:

1. **Wrong connection string format** - Using direct connection instead of pooler
2. **Missing environment variable** in Vercel
3. **Incorrect hostname** in the connection string

## Solution

### Option 1: Use Connection Pooler (RECOMMENDED for Production)

Supabase recommends using the **Connection Pooler** for production applications. It's more reliable and handles connections better.

**In Vercel Environment Variables, use this format:**

```
POSTGRES_URL=postgresql://postgres.uxegmixpgmtnughwgfgx:[YOUR-PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

**Key differences:**
- Host: `aws-1-eu-central-2.pooler.supabase.com` (NOT `db.uxegmixpgmtnughwgfgx.supabase.co`)
- Port: `6543` (NOT `5432`)
- User: `postgres.uxegmixpgmtnughwgfgx` (includes project ref)

### Option 2: Use Direct Connection (Alternative)

If you want to use direct connection:

```
POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.uxegmixpgmtnughwgfgx.supabase.co:5432/postgres
```

**But this is less reliable in production!**

## How to Get the Correct Connection String

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **Connection pooling** tab (RECOMMENDED)
6. Select **URI** format
7. Copy the connection string
8. Replace `[YOUR-PASSWORD]` with your actual database password

## Steps to Fix in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find `POSTGRES_URL` (or `DATABASE_URL`)
4. **Update it** with the Connection Pooler URL format
5. Make sure it's set for **Production** environment
6. **Redeploy** your application

## Verify Your Connection String Format

**Correct format (Connection Pooler):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

**Incorrect format (Direct - causes ENOTFOUND):**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Common Issues

1. **Missing password**: Make sure `[YOUR-PASSWORD]` is replaced with actual password
2. **Wrong hostname**: Use `pooler.supabase.com` not `db.*.supabase.co`
3. **Wrong port**: Use `6543` for pooler, not `5432`
4. **Environment variable not set**: Check Vercel environment variables

## After Fixing

1. Redeploy your application in Vercel
2. Try signing in again
3. The error should be resolved

---

**Note:** The connection pooler is more reliable and recommended for production. It handles connection limits better and is optimized for serverless environments like Vercel.






