import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { updateUserPdfSettings, getUser } from '@/lib/db/queries';
import { z } from 'zod';

const pdfSettingsSchema = z.object({
  pdfLogoUrl: z.string().nullable().optional(),
  pdfLogoPosition: z.enum(['top-left', 'top-center', 'top-right']).nullable().optional(),
  pdfAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
});

/**
 * GET /api/user/pdf-settings
 * Returns PDF settings for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePaidSubscription();
    
    return NextResponse.json({
      pdfLogoUrl: user.pdfLogoUrl,
      pdfLogoPosition: user.pdfLogoPosition,
      pdfAccentColor: user.pdfAccentColor,
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
 * PUT /api/user/pdf-settings
 * Updates PDF settings for the authenticated user
 */
export async function PUT(request: NextRequest) {
  try {
    await requirePaidSubscription();

    const body = await request.json();
    const validatedData = pdfSettingsSchema.parse(body);

    const updatedUser = await updateUserPdfSettings(validatedData);

    return NextResponse.json({
      pdfLogoUrl: updatedUser.pdfLogoUrl,
      pdfLogoPosition: updatedUser.pdfLogoPosition,
      pdfAccentColor: updatedUser.pdfAccentColor,
      message: 'PDF settings updated successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid PDF settings data', details: error.errors },
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
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

