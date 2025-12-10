import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getMealsForUser, createMeal, updateMeal, deleteMeal } from '@/lib/db/queries';
import { z } from 'zod';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders, addCacheHeaders } from '@/lib/security/headers';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const mealSchema = z.object({
  name: z.string().min(1).max(255),
  calories: z.number().int().min(0),
  proteinG: z.number().min(0),
  carbsG: z.number().min(0),
  fatsG: z.number().min(0),
  portionSize: z.string().min(1).max(100),
  category: z.enum(['breakfast', 'snack', 'lunch', 'dinner']),
  note: z.string().max(1000).optional().nullable(),
  lactofree: z.boolean().optional().default(false),
  glutenfree: z.boolean().optional().default(false),
  nutfree: z.boolean().optional().default(false),
  vegan: z.boolean().optional().default(false),
});

/**
 * GET /api/meals
 * Returns all meals for the authenticated user.
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
    const meals = await getMealsForUser(user.id);
    
    let response = NextResponse.json({ meals });
    // Add security headers
    response = addSecurityHeaders(response);
    // Add rate limit headers
    response = addRateLimitHeaders(response, request, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
    // Cache headers for SWR
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
 * POST /api/meals
 * Creates a new meal for the authenticated user.
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
    const validatedData = mealSchema.parse(body);

    const meal = await createMeal({
      userId: 0, // Will be set by createMeal from session
      name: validatedData.name,
      calories: validatedData.calories,
      proteinG: validatedData.proteinG,
      carbsG: validatedData.carbsG,
      fatsG: validatedData.fatsG,
      portionSize: validatedData.portionSize,
      category: validatedData.category,
      note: validatedData.note || null,
      lactofree: validatedData.lactofree ?? false,
      glutenfree: validatedData.glutenfree ?? false,
      nutfree: validatedData.nutfree ?? false,
      vegan: validatedData.vegan ?? false,
    });

    let response = NextResponse.json({ meal }, { status: 201 });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meal data', details: error.errors },
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
 * PUT /api/meals
 * Updates an existing meal for the authenticated user.
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
    const { id, ...mealData } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    const validatedData = mealSchema.partial().parse(mealData);
    const meal = await updateMeal(id, validatedData);

    let response = NextResponse.json({ meal, message: 'Meal updated successfully' });
    response = addSecurityHeaders(response);
    response = addRateLimitHeaders(response, request, { maxRequests: 20, windowMs: 15 * 60 * 1000 });
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meal data', details: error.errors },
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
    if (error.message === 'Meal not found or access denied') {
      return NextResponse.json(
        { error: 'Meal not found or access denied' },
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
 * DELETE /api/meals
 * Deletes an existing meal for the authenticated user.
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
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    await deleteMeal(Number(id));

    let response = NextResponse.json({ message: 'Meal deleted successfully' });
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
    if (error.message === 'Meal not found or access denied') {
      return NextResponse.json(
        { error: 'Meal not found or access denied' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
