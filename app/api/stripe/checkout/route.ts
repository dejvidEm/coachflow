import { client } from '@/lib/db/drizzle';
import { User, Team, TeamMember } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';

// Helper function to transform snake_case to camelCase
function transformUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    pdfLogoUrl: row.pdf_logo_url ? String(row.pdf_logo_url) : null,
    pdfLogoPosition: row.pdf_logo_position || null,
    pdfAccentColor: row.pdf_accent_color || null,
    pdfFirstPageHeading: row.pdf_first_page_heading || null,
    pdfFirstPageText: row.pdf_first_page_text || null,
    pdfFirstPageFooter: row.pdf_first_page_footer || null,
    pdfFirstPageShowLogo: row.pdf_first_page_show_logo ?? false,
    pdfLastPageHeading: row.pdf_last_page_heading || null,
    pdfLastPageText: row.pdf_last_page_text || null,
    pdfLastPageFooter: row.pdf_last_page_footer || null,
    pdfLastPageShowLogo: row.pdf_last_page_show_logo ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const users = await client<any[]>`
      SELECT * FROM users 
      WHERE id = ${Number(userId)} 
      LIMIT 1
    `;

    if (users.length === 0) {
      throw new Error('User not found in database.');
    }

    const user = transformUser(users[0]);

    const userTeams = await client<Array<{ team_id: number }>>`
      SELECT team_id 
      FROM team_members 
      WHERE user_id = ${user.id} 
      LIMIT 1
    `;

    if (userTeams.length === 0) {
      throw new Error('User is not associated with any team.');
    }

    await client`
      UPDATE teams 
      SET 
        stripe_customer_id = ${customerId},
        stripe_subscription_id = ${subscriptionId},
        stripe_product_id = ${productId},
        plan_name = ${(plan.product as Stripe.Product).name},
        subscription_status = ${subscription.status},
        updated_at = NOW()
      WHERE id = ${userTeams[0].team_id}
    `;

    await setSession(user);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
