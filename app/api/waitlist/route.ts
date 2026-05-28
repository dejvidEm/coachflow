import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders } from '@/lib/security/headers';
import { sendEmail } from '@/lib/email/send-email';
import {
  waitlistNotificationEmail,
  waitlistConfirmationEmail,
} from '@/lib/email/marketing-emails';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 5, windowMs: 10 * 60 * 1000 };

const waitlistSchema = z.object({
  email: z.string().trim().email('Invalid email').max(160),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional().or(z.literal('')),
});

/**
 * POST /api/waitlist
 * Handles landing-page waitlist sign-ups: notifies the team and
 * sends a confirmation to the subscriber.
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, RATE_LIMIT);
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  let response: NextResponse;

  try {
    const body = await request.json().catch(() => null);
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      response = NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
    }

    const { email, company } = parsed.data;

    // Honeypot triggered: pretend success without sending anything.
    if (company) {
      response = NextResponse.json({ success: true });
      return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
    }

    const to = process.env.CONTACT_EMAIL;
    if (!to) {
      console.error('CONTACT_EMAIL environment variable is not set.');
      response = NextResponse.json(
        { error: 'Waitlist endpoint is not configured.' },
        { status: 500 }
      );
      return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
    }

    // Owner notification is the critical path.
    await sendEmail({
      to,
      replyTo: email,
      subject: `Nový záujemca o skorší prístup: ${email}`,
      html: waitlistNotificationEmail({ email }),
    });

    // Subscriber confirmation is best-effort; never fail the request if it bounces.
    try {
      await sendEmail({
        to: email,
        subject: 'Ste na zozname – CoachFlow skorší prístup',
        html: waitlistConfirmationEmail(),
      });
    } catch (confirmationError) {
      console.error('Waitlist confirmation email failed:', confirmationError);
    }

    response = NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Waitlist sign-up failed:', error);
    response = NextResponse.json(
      { error: 'Failed to join waitlist. Please try again later.' },
      { status: 500 }
    );
  }

  return addRateLimitHeaders(addSecurityHeaders(response), request, RATE_LIMIT);
}
