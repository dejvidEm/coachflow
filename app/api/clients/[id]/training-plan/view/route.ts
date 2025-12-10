import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/clients/[id]/training-plan/view
 * Proxies the PDF file with proper CORS headers for iframe embedding
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

    // Fetch the PDF from Supabase Storage
    const pdfResponse = await fetch(client.trainingPdf);
    
    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch PDF' },
        { status: 500 }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Return PDF with proper CORS headers for iframe/object embedding
    // Use no-cache to ensure fresh PDF on each request
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="training-plan-${clientId}.pdf"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        // Allow embedding in iframes/objects
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error: any) {
    console.error('Error viewing training plan PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

