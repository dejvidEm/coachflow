import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById } from '@/lib/db/queries';

/**
 * GET /api/clients/[id]
 * Returns a specific client for the authenticated user.
 * Requires paid subscription.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePaidSubscription();
    const { id } = await params;
    const clientId = parseInt(id);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: 'Invalid client ID' },
        { status: 400 }
      );
    }

    const client = await getClientById(clientId, user.id);

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }

    // Include the PDF URLs in the response
    const clientResponse = {
      ...client,
      hasMealPdf: !!client.mealPdf,
      hasTrainingPdf: !!client.trainingPdf,
    };

    const response = NextResponse.json({ client: clientResponse });
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


