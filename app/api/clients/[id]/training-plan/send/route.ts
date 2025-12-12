import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById } from '@/lib/db/queries';
import { sendEmail, generatePdfEmailTemplate } from '@/lib/email/send-email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/clients/[id]/training-plan/send
 * Sends the training plan PDF to the client's email address
 */
export async function POST(
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

    // Check if client has email
    if (!client.email) {
      return NextResponse.json(
        { error: 'Client does not have an email address' },
        { status: 400 }
      );
    }

    // Check if training plan PDF exists
    if (!client.trainingPdf) {
      return NextResponse.json(
        { error: 'No training plan PDF found for this client' },
        { status: 404 }
      );
    }

    // Fetch the PDF from storage
    const pdfResponse = await fetch(client.trainingPdf);
    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch PDF from storage' },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    const pdfFilename = `training-plan-${client.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    // Generate email template
    const emailHtml = generatePdfEmailTemplate(client.name, 'training-plan');

    // Send email with PDF attachment
    await sendEmail({
      to: client.email,
      subject: `Your Updated Training Plan - ${client.name}`,
      html: emailHtml,
      pdfAttachment: {
        filename: pdfFilename,
        content: pdfBuffer,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Training plan PDF sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending training plan PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}


