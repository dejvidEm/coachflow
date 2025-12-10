import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientsForUser, createClient, updateClient, deleteClient, getUser } from '@/lib/db/queries';
import { z } from 'zod';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  dateOfBirth: z.string().nullable().optional().transform((val) => val ? new Date(val) : null),
  email: z.string().email('Invalid email address').nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  actualWeight: z.number().min(0).nullable().optional(),
  actualHeight: z.number().min(0).nullable().optional(),
  fitnessGoal: z.enum(['mass_gain', 'weight_loss', 'maintain']).default('maintain'),
});

/**
 * GET /api/clients
 * Returns all clients for the authenticated user.
 * Requires paid subscription.
 */
export async function GET(request: NextRequest) {
  try {
    // This will throw if user is not authenticated or doesn't have a paid plan
    const { user } = await requirePaidSubscription();
    const clients = await getClientsForUser(user.id);
    
    const response = NextResponse.json({ clients });
    // Allow SWR to cache, but revalidate on next request
    response.headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
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
 * POST /api/clients
 * Creates a new client for the authenticated user.
 * Requires paid subscription.
 */
export async function POST(request: NextRequest) {
  try {
    // This will throw if user is not authenticated or doesn't have a paid plan
    await requirePaidSubscription();

    const body = await request.json();
    const validatedData = clientSchema.parse(body);

    const client = await createClient({
      userId: 0, // Will be set by createClient from session
      name: validatedData.name,
      dateOfBirth: validatedData.dateOfBirth,
      email: validatedData.email || null,
      gender: validatedData.gender || null,
      note: validatedData.note || null,
      actualWeight: validatedData.actualWeight || null,
      actualHeight: validatedData.actualHeight || null,
      fitnessGoal: validatedData.fitnessGoal,
      mealPdf: null,
      trainingPdf: null,
    });

    return NextResponse.json({ client, message: 'Client created successfully' }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid client data', details: error.errors },
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
 * PUT /api/clients
 * Updates an existing client for the authenticated user.
 * Requires paid subscription.
 */
export async function PUT(request: NextRequest) {
  try {
    await requirePaidSubscription();

    const body = await request.json();
    const { id, ...clientData } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const validatedData = clientSchema.partial().parse(clientData);
    const updatedClient = await updateClient(id, validatedData);

    return NextResponse.json({ client: updatedClient, message: 'Client updated successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid client data', details: error.errors },
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
    if (error.message === 'Client not found or access denied') {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients
 * Deletes an existing client for the authenticated user.
 * Requires paid subscription.
 */
export async function DELETE(request: NextRequest) {
  try {
    await requirePaidSubscription();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await deleteClient(Number(id));

    return NextResponse.json({ message: 'Client deleted successfully' });
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
    if (error.message === 'Client not found or access denied') {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
