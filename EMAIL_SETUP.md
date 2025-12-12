# Email Setup Guide

This guide explains how to configure email functionality for sending meal plans and training plans to clients.

## Overview

The application uses [Resend](https://resend.com) to send emails with PDF attachments. When you click "Send Email" for a meal plan or training plan, the system will:

1. Fetch the latest PDF from storage
2. Attach it to an email
3. Send it to the client's email address

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "CoachFlow Production")
5. Copy the API key (you'll only see it once!)

### 3. Configure Environment Variables

Add the following environment variables to your `.env.local` file (for local development) or your hosting platform (Vercel, etc.):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=CoachFlow <noreply@yourdomain.com>
```

**Important Notes:**
- Replace `re_xxxxxxxxxxxxxxxxxxxxx` with your actual Resend API key
- For `RESEND_FROM_EMAIL`, you can use:
  - `onboarding@resend.dev` (for testing - Resend provides this)
  - `noreply@yourdomain.com` (for production - requires domain verification)

### 4. Domain Verification (Production Only)

If you want to use your own domain for sending emails:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)
6. Update `RESEND_FROM_EMAIL` to use your verified domain

## Usage

### Sending Meal Plans

1. Navigate to a client's detail page
2. Go to the **Meal PDF** tab
3. Click **Send Email** button (only visible if client has an email address)
4. Confirm the action in the modal
5. The PDF will be sent to the client's email address

### Sending Training Plans

1. Navigate to a client's detail page
2. Go to the **Training PDF** tab
3. Click **Send Email** button (only visible if client has an email address)
4. Confirm the action in the modal
5. The PDF will be sent to the client's email address

## Features

- ✅ Confirmation dialog before sending
- ✅ Loading states during email sending
- ✅ Error handling and user feedback
- ✅ Only shows send button if client has email address
- ✅ Only sends if PDF exists
- ✅ Professional email template with branding

## Troubleshooting

### "RESEND_API_KEY environment variable is not set"

- Make sure you've added `RESEND_API_KEY` to your environment variables
- Restart your development server after adding environment variables
- Check that the variable name is exactly `RESEND_API_KEY` (case-sensitive)

### "Client does not have an email address"

- The send button only appears if the client has an email address
- Add an email address to the client in the client edit form

### "No meal plan PDF found for this client"

- Generate a meal plan PDF first before trying to send it
- The send button only appears if a PDF exists

### Email not received

- Check the Resend dashboard for delivery status
- Verify the client's email address is correct
- Check spam/junk folder
- Make sure your domain is verified (if using custom domain)

## API Routes

- `POST /api/clients/[id]/meal-plan/send` - Sends meal plan PDF
- `POST /api/clients/[id]/training-plan/send` - Sends training plan PDF

Both routes require:
- Authentication (paid subscription)
- Client ownership verification
- Client email address
- Existing PDF

## Email Template

The email includes:
- Professional HTML template with CoachFlow branding
- Personalized greeting with client name
- PDF attachment
- Clear call-to-action

You can customize the email template in `lib/email/send-email.ts` in the `generatePdfEmailTemplate` function.


