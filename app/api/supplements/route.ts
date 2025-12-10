import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getSupplementsForUser, createSupplement, updateSupplement, deleteSupplement } from '@/lib/db/queries';
import { z } from 'zod';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders, addCacheHeaders } from '@/lib/security/headers';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const supplementSchema = z.object({
  name: z.string().min(1).max(255),
  pillsPerDose: z.number().int().min(1),
  whenToTake: z.enum(['morning', 'afternoon', 'evening', 'before_meal', 'after_meal', 'with_meal', 'before_bed', 'as_needed']),
  benefits: z.string().min(1).max(2000),
  dosage: z.string().max(500).optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
});

/**
 * GET /api/supplements
 * Returns all supplements for the authenticated user.
 * Requires paid subscription.
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  try {
    // This will throw if user is not authenticated or doesn't have a paid plan
    const { user } = await requirePaidSubscription();
    const supplements = await getSupplementsForUser(user.id);
    
    let response = NextResponse.json({ supplements });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
    response = addCacheHeaders(response, { maxAge: 0, public: false });
    return response;
  } catch (error: any) {
    if (error.message === 'User is not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (error.message === 'This feature requires a paid subscription') {
      return NextResponse.json(
        { error: 'This feature requires a paid subscription' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supplements
 * Creates a new supplement for the authenticated user.
 * Requires paid subscription.
 */
export async function POST(request: NextRequest) {
  // Rate limiting (stricter for write operations)
  const rateLimitResponse = rateLimit(request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  try {
    // This will throw if user is not authenticated or doesn't have a paid plan
    await requirePaidSubscription();

    const body = await request.json();
    const validatedData = supplementSchema.parse(body);

    const supplement = await createSupplement({
      userId: 0, // Will be set by createSupplement from session
      name: validatedData.name,
      pillsPerDose: validatedData.pillsPerDose,
      whenToTake: validatedData.whenToTake,
      benefits: validatedData.benefits,
      dosage: validatedData.dosage || null,
      note: validatedData.note || null,
    });

    let response = NextResponse.json({ supplement }, { status: 201 });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    console.error('Error creating supplement:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid supplement data', details: error.errors },
        { status: 400 }
      );
    }
    if (error.message === 'User is not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (error.message === 'This feature requires a paid subscription') {
      return NextResponse.json(
        { error: 'This feature requires a paid subscription' },
        { status: 403 }
      );
    }
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Internal server error'
      : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/supplements
 * Updates an existing supplement for the authenticated user.
 * Requires paid subscription.
 */
export async function PUT(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  try {
    await requirePaidSubscription();

    const body = await request.json();
    const { id, ...supplementData } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Supplement ID is required' },
        { status: 400 }
      );
    }

    const validatedData = supplementSchema.partial().parse(supplementData);
    const supplement = await updateSupplement(id, validatedData);

    let response = NextResponse.json({ supplement, message: 'Supplement updated successfully' });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid supplement data', details: error.errors },
        { status: 400 }
      );
    }
    if (error.message === 'User is not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (error.message === 'This feature requires a paid subscription') {
      return NextResponse.json(
        { error: 'This feature requires a paid subscription' },
        { status: 403 }
      );
    }
    if (error.message === 'Supplement not found or access denied') {
      return NextResponse.json(
        { error: 'Supplement not found or access denied' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/supplements
 * Deletes an existing supplement for the authenticated user.
 * Requires paid subscription.
 */
export async function DELETE(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  try {
    await requirePaidSubscription();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Supplement ID is required' },
        { status: 400 }
      );
    }

    await deleteSupplement(Number(id));

    let response = NextResponse.json({ message: 'Supplement deleted successfully' });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error.message === 'User is not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (error.message === 'This feature requires a paid subscription') {
      return NextResponse.json(
        { error: 'This feature requires a paid subscription' },
        { status: 403 }
      );
    }
    if (error.message === 'Supplement not found or access denied') {
      return NextResponse.json(
        { error: 'Supplement not found or access denied' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


