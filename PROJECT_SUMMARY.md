# CoachFlow - Project Summary

## Overview
CoachFlow is a SaaS platform designed for personal trainers and fitness coaches to manage their clients, create custom meal plans and training programs, and generate professional PDFs. It's built with Next.js 15, TypeScript, PostgreSQL, Stripe for payments, and Supabase for file storage.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **File Storage**: Supabase Storage
- **Payments**: Stripe (subscriptions, checkout, webhooks)
- **Email**: Resend API
- **PDF Generation**: @react-pdf/renderer
- **State Management**: SWR for server state, React hooks for UI state
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, custom components

## Core Features

### 1. User Authentication & Teams
- User sign up/sign in with email and password
- Team-based multi-tenancy (each user belongs to a team)
- Team member invitations with roles (owner/member)
- Session management with JWT

### 2. Client Management
- Create, edit, delete clients
- Client information: name, email, date of birth, gender, weight, height, fitness goals
- Client notes
- Client cards with profile icons (color-coded by gender: blue=male, pink=female, gray=other)
- Search and filter clients
- Card and table view modes

### 3. Meal Planning
- Create custom meals with:
  - Name, description
  - Macros (protein, carbs, fats, calories)
  - Meal type (breakfast, lunch, dinner, snack)
- Meal database management
- Generate meal plan PDFs for clients
- Custom PDF templates with branding

### 4. Training Plans
- Exercise database with:
  - Name, description, instructions
  - Muscle groups, equipment needed
  - Exercise images
- Create custom training plans for clients
- Generate training plan PDFs
- Custom PDF templates

### 5. Supplements
- Supplement database
- Track supplements with dosage, timing, benefits

### 6. PDF Generation & Email
- Generate meal plan PDFs with custom branding
- Generate training plan PDFs
- PDF preview and download
- Send PDFs via email to clients (using Resend)
- Secure PDF access with proxy routes

### 7. Subscription Management
- Stripe integration for subscriptions
- Multiple pricing tiers (Base, Plus)
- Trial periods
- Subscription status tracking
- Customer portal for managing subscriptions

### 8. Landing Page
- Hero section with animated preloader
- Features section
- How it works section
- Pricing section
- Testimonials
- CTA section
- Changelog page

## Project Structure

```
coachflow/
├── app/
│   ├── (dashboard)/          # Dashboard routes (protected)
│   │   ├── dashboard/         # Main dashboard
│   │   │   ├── clients/      # Client management
│   │   │   ├── meals/        # Meal management
│   │   │   ├── exercises/    # Exercise management
│   │   │   ├── supplements/  # Supplement management
│   │   │   └── settings/     # Settings pages
│   │   ├── pricing/         # Pricing page
│   │   ├── changelog/        # Changelog page
│   │   └── page.tsx          # Landing page
│   ├── (login)/              # Auth routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── api/                  # API routes
│       ├── clients/          # Client CRUD, PDF generation
│       ├── meals/            # Meal CRUD
│       ├── exercises/        # Exercise CRUD
│       ├── supplements/      # Supplement CRUD
│       ├── stripe/           # Stripe webhooks, checkout
│       └── user/             # User management
├── components/
│   ├── clients/              # Client-related components
│   ├── meals/                # Meal-related components
│   ├── exercises/            # Exercise-related components
│   ├── dashboard/            # Dashboard components
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── db/                   # Database setup, queries, schema
│   ├── payments/             # Stripe integration
│   ├── auth/                 # Authentication
│   ├── storage/              # Supabase storage
│   ├── email/                # Email sending (Resend)
│   └── security/             # Security utilities
└── public/                   # Static assets
```

## Database Schema

### Main Tables
- **users**: User accounts
- **teams**: Team/organization (one per user initially)
- **team_members**: Team membership and roles
- **clients**: Client information
- **meals**: Meal database
- **exercises**: Exercise database
- **supplements**: Supplement database

### Key Relationships
- User → Team (one-to-one initially, can have multiple via team_members)
- Team → Clients (one-to-many)
- Team → Meals/Exercises/Supplements (one-to-many, shared within team)

## Security Features
- Authentication required for all dashboard routes
- Paid subscription required for core features
- User/team-based data isolation
- PDF URLs secured with proxy routes
- Rate limiting
- Input validation

## Environment Variables Required
- `POSTGRES_URL` - Database connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `RESEND_API_KEY` - Resend API key for emails
- `RESEND_FROM_EMAIL` - Email sender address
- `AUTH_SECRET` - JWT secret
- `BASE_URL` - Application base URL

## Current Subscription Plans

### Base Plan
- Price: $8/month
- Trial: 7 days
- Features: Unlimited usage, unlimited workspace members, email support

### Plus Plan
- Price: $12/month
- Trial: 7 days
- Features: Everything in Base, early access to new features, 24/7 support + Slack access

## How Plans Work

1. **Products & Prices in Stripe**: Created in Stripe Dashboard
2. **Features in Code**: Defined in `app/(dashboard)/pricing/page.tsx`
3. **Plan Enforcement**: Checked via `requirePaidSubscription()` middleware
4. **Subscription Tracking**: Stored in `teams` table (subscriptionStatus, planName)

---

# How to Create New Plans

## Step 1: Create Product in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Fill in:
   - **Name**: e.g., "Pro", "Enterprise"
   - **Description**: Brief description of the plan
   - **Pricing**: 
     - Set price (e.g., $20 = 2000 cents)
     - Billing period: Monthly/Yearly
     - Trial period (optional): e.g., 7 days
   - **Recurring**: Enable for subscription
4. Click **Save**
5. **Copy the Product ID** and **Price ID** (you'll need these)

## Step 2: Update Pricing Page Code

Edit `app/(dashboard)/pricing/page.tsx`:

```typescript
export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');
  const proPlan = products.find((product) => product.name === 'Pro'); // NEW

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);
  const proPrice = prices.find((price) => price.productId === proPlan?.id); // NEW

  return (
    <main id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"> {/* Changed to 3 columns */}
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={basePrice?.unitAmount || 800}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
          priceId={basePrice?.id}
        />
        <PricingCard
          name={plusPlan?.name || 'Plus'}
          price={plusPrice?.unitAmount || 1200}
          interval={plusPrice?.interval || 'month'}
          trialDays={plusPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
          priceId={plusPrice?.id}
        />
        {/* NEW PLAN */}
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={proPrice?.unitAmount || 2000}
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Plus, and:',
            'Advanced Analytics',
            'Priority Support',
            'Custom Branding',
            'API Access',
          ]}
          priceId={proPrice?.id}
        />
      </div>
    </main>
  );
}
```

## Step 3: Update Landing Page Pricing (Optional)

If you want the new plan on the landing page, update `components/pricing-section.tsx` similarly.

## Step 4: Add Plan-Specific Features (If Needed)

If your new plan has different features or limits, add logic in:

1. **Middleware** (`lib/auth/middleware.ts`): Check plan type
2. **Feature flags**: Add plan-specific feature checks
3. **Usage limits**: Enforce limits based on plan

Example:
```typescript
// In a component or API route
const team = await getTeamForUser(user.id);
const isProPlan = team?.planName === 'Pro';

if (isProPlan) {
  // Allow advanced features
} else {
  // Show upgrade prompt
}
```

## Step 5: Test

1. Use Stripe test mode
2. Create a test subscription with the new plan
3. Verify the plan appears on pricing page
4. Test checkout flow
5. Verify subscription status updates correctly

## Important Notes

- **Product names must match**: The code finds products by name (e.g., "Base", "Plus", "Pro")
- **Prices are in cents**: $20 = 2000 cents
- **Active products only**: Code only fetches active products from Stripe
- **Features are hardcoded**: Plan features are defined in code, not Stripe
- **Plan enforcement**: Add checks in code to enforce plan-specific limits

## Quick Reference

**Stripe Dashboard**: https://dashboard.stripe.com/products
**Pricing Page Code**: `app/(dashboard)/pricing/page.tsx`
**Stripe Functions**: `lib/payments/stripe.ts`
**Subscription Check**: `lib/auth/middleware.ts` → `requirePaidSubscription()`

