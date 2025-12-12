/**
 * Email sending utility
 * 
 * Uses Resend API to send emails with PDF attachments
 * 
 * @module lib/email/send-email
 */

import { Resend } from 'resend';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  pdfAttachment?: {
    filename: string;
    content: Buffer;
  };
}

/**
 * Sends an email using Resend API
 * 
 * @param options - Email options
 * @returns Promise resolving to success status
 * @throws Error if email sending fails
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
  const { to, subject, html, pdfAttachment } = options;

  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set. Please configure Resend API key.');
  }

  // Initialize Resend client
  const resend = new Resend(resendApiKey);

  // Prepare email options
  const emailOptions: any = {
    from: process.env.RESEND_FROM_EMAIL || 'CoachFlow <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
  };

  // Add PDF attachment if provided
  if (pdfAttachment) {
    emailOptions.attachments = [
      {
        filename: pdfAttachment.filename,
        content: pdfAttachment.content,
      },
    ];
  }

  // Send email via Resend
  const { data, error } = await resend.emails.send(emailOptions);

  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }

  return {
    success: true,
    messageId: data?.id,
  };
}

/**
 * Generates HTML email template for sending PDFs
 */
export function generatePdfEmailTemplate(
  clientName: string,
  pdfType: 'meal-plan' | 'training-plan'
): string {
  const pdfTypeLabel = pdfType === 'meal-plan' ? 'Meal Plan' : 'Training Plan';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #44B080 0%, #3a9a6d 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">CoachFlow</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; margin-top: 0;">Your Updated ${pdfTypeLabel}</h2>
          <p style="color: #666; font-size: 16px;">
            Hi ${clientName},
          </p>
          <p style="color: #666; font-size: 16px;">
            Your updated ${pdfTypeLabel.toLowerCase()} is attached to this email. Please find the PDF file attached below.
          </p>
          <p style="color: #666; font-size: 16px;">
            If you have any questions or need to make changes, please don't hesitate to reach out.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              Your CoachFlow Team
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}


