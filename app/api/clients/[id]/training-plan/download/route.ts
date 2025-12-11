import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/clients/[id]/training-plan/download
 * Redirects to the PDF file in storage
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

    // Verify client exists and user has access
    const client = await getClientById(clientId, user.id);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }

    if (!client.trainingPdf) {
      return NextResponse.json(
        { error: 'No training plan PDF found for this client' },
        { status: 404 }
      );
    }

    // Redirect to the Supabase Storage public URL with cache-busting query parameter
    // This ensures the browser fetches the latest version instead of using cached PDF
    const pdfUrl = new URL(client.trainingPdf);
    pdfUrl.searchParams.set('t', Date.now().toString());
    
    const response = NextResponse.redirect(pdfUrl.toString());
    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error downloading training plan PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
