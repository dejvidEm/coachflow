import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getUser, updateUserPdfPages } from '@/lib/db/queries';
import { z } from 'zod';

const pdfPagesSchema = z.object({
  pdfFirstPageHeading: z.string().nullable().optional(),
  pdfFirstPageText: z.string().nullable().optional(),
  pdfFirstPageFooter: z.string().nullable().optional(),
  pdfFirstPageShowLogo: z.boolean().nullable().optional(),
  pdfLastPageHeading: z.string().nullable().optional(),
  pdfLastPageText: z.string().nullable().optional(),
  pdfLastPageFooter: z.string().nullable().optional(),
  pdfLastPageShowLogo: z.boolean().nullable().optional(),
});

/**
 * GET /api/user/pdf-pages
 * Returns PDF page content for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePaidSubscription();
    
    return NextResponse.json({
      pdfFirstPageHeading: user.pdfFirstPageHeading,
      pdfFirstPageText: user.pdfFirstPageText,
      pdfFirstPageFooter: user.pdfFirstPageFooter,
      pdfFirstPageShowLogo: user.pdfFirstPageShowLogo,
      pdfLastPageHeading: user.pdfLastPageHeading,
      pdfLastPageText: user.pdfLastPageText,
      pdfLastPageFooter: user.pdfLastPageFooter,
      pdfLastPageShowLogo: user.pdfLastPageShowLogo,
    });
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
 * PUT /api/user/pdf-pages
 * Updates PDF page content for the authenticated user
 */
export async function PUT(request: NextRequest) {
  try {
    const { user } = await requirePaidSubscription();
    const body = await request.json();
    
    const validatedData = pdfPagesSchema.parse(body);
    
    const updatedUser = await updateUserPdfPages(validatedData);
    
    return NextResponse.json({
      success: true,
      pdfFirstPageHeading: updatedUser.pdfFirstPageHeading,
      pdfFirstPageText: updatedUser.pdfFirstPageText,
      pdfFirstPageFooter: updatedUser.pdfFirstPageFooter,
      pdfFirstPageShowLogo: updatedUser.pdfFirstPageShowLogo,
      pdfLastPageHeading: updatedUser.pdfLastPageHeading,
      pdfLastPageText: updatedUser.pdfLastPageText,
      pdfLastPageFooter: updatedUser.pdfLastPageFooter,
      pdfLastPageShowLogo: updatedUser.pdfLastPageShowLogo,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
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
