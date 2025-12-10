import { NextRequest, NextResponse } from 'next/server';
import { requirePaidSubscription } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { getSupabaseClient } from '@/lib/supabase/client';

const LOGO_BUCKET_NAME = 'pdf_logos';

/**
 * POST /api/user/logo
 * Uploads a logo image for the user's PDF customization
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePaidSubscription();

    // Get the uploaded file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Please select an image file' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const supabase = getSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${user.id}-${Date.now()}.${fileExt}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET_NAME)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload logo' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(LOGO_BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get logo URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logoUrl: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

