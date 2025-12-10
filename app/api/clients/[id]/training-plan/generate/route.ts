import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById, getExercisesForUser, updateClientTrainingPdf } from '@/lib/db/queries';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { TrainingPlanPdfTemplate } from '@/components/clients/training-plan-pdf-template';
import { saveTrainingPdf } from '@/lib/storage/storage';

export const dynamic = 'force-dynamic';

/**
 * POST /api/clients/[id]/training-plan/generate
 * Generates a training plan PDF for a client and saves it to the database
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

    // Get the client and verify ownership
    const client = await getClientById(clientId, user.id);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { exerciseIds } = body;

    if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one exercise' },
        { status: 400 }
      );
    }

    // Get all exercises for the user
    const allExercises = await getExercisesForUser(user.id);
    
    // Filter to only selected exercises that belong to the user
    const selectedExercises = allExercises.filter((exercise) => exerciseIds.includes(exercise.id));

    if (selectedExercises.length === 0) {
      return NextResponse.json(
        { error: 'No valid exercises found' },
        { status: 400 }
      );
    }

    // Generate PDF using React.createElement to avoid JSX in API route
    // Use user's PDF settings for consistent styling across all clients
    const pdfDoc = React.createElement(TrainingPlanPdfTemplate, {
      clientName: client.name,
      exercises: selectedExercises,
      logoUrl: user.pdfLogoUrl,
      logoPosition: user.pdfLogoPosition,
      accentColor: user.pdfAccentColor,
    });

    // Generate PDF as Blob
    const blob = await pdf(pdfDoc).toBlob();
    
    // Convert blob to buffer for upload
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use consistent filename per client - this will overwrite the existing file
    const filename = `training-plan-${clientId}.pdf`;

    // Upload PDF to Supabase Storage and get public URL
    // upsert: true ensures it overwrites the existing file with the same name
    const pdfUrl = await saveTrainingPdf(buffer, filename);

    // Save only the PDF URL to database (updated_at is set automatically)
    await updateClientTrainingPdf(clientId, pdfUrl);

    return NextResponse.json({
      success: true,
      message: 'Training plan PDF generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating training plan PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



