import { getSupabaseClient } from '@/lib/supabase/client';

const MEAL_BUCKET_NAME = 'meal_pdf';
const TRAINING_BUCKET_NAME = 'training_pdf';

/**
 * Upload PDF to Supabase Storage and return the public URL
 */
export async function savePdf(buffer: Buffer, filename: string, bucketName: string = MEAL_BUCKET_NAME): Promise<string> {
  const supabase = getSupabaseClient();

  // First, try to delete the existing file if it exists
  // This ensures we overwrite instead of creating duplicates
  await deletePdf(filename, bucketName);

  // Convert Buffer to Uint8Array for Supabase Storage (works better than Buffer)
  const uint8Array = new Uint8Array(buffer);

  // Upload the PDF to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filename, uint8Array, {
      contentType: 'application/pdf',
      upsert: true, // Overwrite if file exists (backup)
      cacheControl: '3600',
    });

  if (error) {
    // Provide helpful error message if bucket doesn't exist
    if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
      throw new Error(
        `Supabase Storage bucket "${bucketName}" not found. ` +
        `Please create the bucket in your Supabase dashboard: Storage > New bucket > Name: "${bucketName}" > Make it public.`
      );
    }
    
    // Log the full error for debugging
    console.error('Supabase Storage upload error:', error);
    throw new Error(`Failed to upload PDF to Supabase Storage: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filename);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL from Supabase Storage');
  }

  console.log(`PDF uploaded successfully: ${filename} -> ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

/**
 * Upload training PDF to Supabase Storage and return the public URL
 */
export async function saveTrainingPdf(buffer: Buffer, filename: string): Promise<string> {
  return savePdf(buffer, filename, TRAINING_BUCKET_NAME);
}

/**
 * Delete PDF from Supabase Storage
 */
export async function deletePdf(filename: string, bucketName: string = MEAL_BUCKET_NAME): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filename]);

  if (error) {
    // Log error but don't throw - file might not exist (first time upload)
    // Only log if it's not a "not found" error
    if (!error.message.includes('not found') && !error.message.includes('No such file')) {
      console.error('Failed to delete PDF from Supabase Storage:', error.message);
    }
  } else {
    console.log(`Deleted PDF from storage: ${filename}`);
  }
}

/**
 * Extract filename from Supabase Storage URL
 */
export function getFilenameFromUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided to getFilenameFromUrl');
  }
  
  // Supabase URLs are like: https://[project].supabase.co/storage/v1/object/public/meal_pdf/filename.pdf
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
  if (!filename) {
    throw new Error('Could not extract filename from URL');
  }
  
  return filename;
}
