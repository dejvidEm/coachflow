import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getClientById, getMealsForUser, getSupplementsForUser, updateClientMealPdf } from '@/lib/db/queries';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { MealPlanPdfTemplate } from '@/components/clients/meal-plan-pdf-template';
import { savePdf } from '@/lib/storage/storage';

export const dynamic = 'force-dynamic';

/**
 * POST /api/clients/[id]/meal-plan/generate
 * Generates a meal plan PDF for a client and saves it to the database
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
    const { mealIds = [], supplementIds = [] } = body;

    if (!Array.isArray(mealIds) && !Array.isArray(supplementIds)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    if (mealIds.length === 0 && supplementIds.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one meal or supplement' },
        { status: 400 }
      );
    }

    // Get all meals and supplements for the user
    const allMeals = mealIds.length > 0 ? await getMealsForUser(user.id) : [];
    const allSupplements = supplementIds.length > 0 ? await getSupplementsForUser(user.id) : [];
    
    // Filter to only selected items that belong to the user
    const selectedMeals = allMeals.filter((meal) => mealIds.includes(meal.id));
    const selectedSupplements = allSupplements.filter((supplement) => supplementIds.includes(supplement.id));

    if (mealIds.length > 0 && selectedMeals.length === 0) {
      return NextResponse.json(
        { error: 'No valid meals found' },
        { status: 400 }
      );
    }

    if (supplementIds.length > 0 && selectedSupplements.length === 0) {
      return NextResponse.json(
        { error: 'No valid supplements found' },
        { status: 400 }
      );
    }

    // Generate PDF using React.createElement to avoid JSX in API route
    // Use user's PDF settings for consistent styling across all clients
    const pdfDoc = React.createElement(MealPlanPdfTemplate, {
      clientName: client.name,
      meals: selectedMeals,
      supplements: selectedSupplements,
      logoUrl: user.pdfLogoUrl,
      logoPosition: user.pdfLogoPosition,
      accentColor: user.pdfAccentColor,
      userName: user.name,
      firstPageHeading: user.pdfFirstPageHeading,
      firstPageText: user.pdfFirstPageText,
      firstPageFooter: user.pdfFirstPageFooter,
      firstPageShowLogo: user.pdfFirstPageShowLogo,
      lastPageHeading: user.pdfLastPageHeading,
      lastPageText: user.pdfLastPageText,
      lastPageFooter: user.pdfLastPageFooter,
      lastPageShowLogo: user.pdfLastPageShowLogo,
    });

    // Generate PDF as Blob
    // @ts-expect-error - React.createElement returns FunctionComponentElement but pdf() expects ReactElement with DocumentProps
    const blob = await pdf(pdfDoc).toBlob();
    
    // Convert blob to buffer for upload
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use consistent filename per client - this will overwrite the existing file
    const filename = `meal-plan-${clientId}.pdf`;

    // Upload PDF to Supabase Storage and get public URL
    // upsert: true ensures it overwrites the existing file with the same name
    const pdfUrl = await savePdf(buffer, filename);

    // Save only the PDF URL to database (updated_at is set automatically)
    await updateClientMealPdf(clientId, pdfUrl);

    return NextResponse.json({
      success: true,
      message: 'Meal plan PDF generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating meal plan PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

