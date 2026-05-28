import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders } from '@/lib/security/headers';
import { sendEmail } from '@/lib/email/send-email';
import { contactNotificationEmail } from '@/lib/email/marketing-emails';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 5, windowMs: 10 * 60 * 1000 };

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Invalid email').max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional().or(z.literal('')),
});

/**
 * POST /api/contact
 * Handles landing-page contact form submissions and emails the team.
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, RATE_LIMIT);
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  let response: NextResponse;

  try {
    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      response = NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
    }

    const { name, email, phone, message, company } = parsed.data;

    // Honeypot triggered: pretend success without sending anything.
    if (company) {
      response = NextResponse.json({ success: true });
      return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
    }

    const to = process.env.CONTACT_EMAIL || 'coachflowsoft@gmail.com';

    await sendEmail({
      to,
      replyTo: email,
      subject: `Nová správa od ${name}`,
      html: contactNotificationEmail({ name, email, phone, message }),
    });

    response = NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form submission failed:', error);
    response = NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }

  return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
}
