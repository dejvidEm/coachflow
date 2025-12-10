import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getExercisesForUser, createExercise, updateExercise, deleteExercise, getUser } from '@/lib/db/queries';
import { z } from 'zod';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders, addCacheHeaders } from '@/lib/security/headers';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const exerciseSchema = z.object({
  name: z.string().min(1).max(255),
  muscleGroup: z.enum(['back', 'chest', 'arms']),
  description: z.string().max(2000).optional().nullable(),
  photo: z.string().refine(
    (val) => !val || val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'Photo must be a valid image data URL or URL' }
  ).optional().nullable(),
  sets: z.number().int().min(1),
});

/**
 * GET /api/exercises
 * Returns all exercises for the authenticated user.
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
    const exercises = await getExercisesForUser(user.id);
    
    let response = NextResponse.json({ exercises });
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
 * POST /api/exercises
 * Creates a new exercise for the authenticated user.
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
    const validatedData = exerciseSchema.parse(body);

    const exercise = await createExercise({
      userId: 0, // Will be set by createExercise from session
      name: validatedData.name,
      muscleGroup: validatedData.muscleGroup,
      description: validatedData.description || null,
      photo: validatedData.photo || null,
      sets: validatedData.sets,
    });

    let response = NextResponse.json({ exercise }, { status: 201 });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid exercise data', details: error.errors },
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/exercises
 * Updates an existing exercise for the authenticated user.
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
    const { id, ...exerciseData } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    const validatedData = exerciseSchema.partial().parse(exerciseData);
    const exercise = await updateExercise(id, validatedData);

    let response = NextResponse.json({ exercise, message: 'Exercise updated successfully' });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid exercise data', details: error.errors },
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
    if (error.message === 'Exercise not found or access denied') {
      return NextResponse.json(
        { error: 'Exercise not found or access denied' },
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
 * DELETE /api/exercises
 * Deletes an existing exercise for the authenticated user.
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
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    await deleteExercise(Number(id));

    let response = NextResponse.json({ message: 'Exercise deleted successfully' });
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
    if (error.message === 'Exercise not found or access denied') {
      return NextResponse.json(
        { error: 'Exercise not found or access denied' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
