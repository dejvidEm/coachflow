/**
 * Branded HTML email templates for marketing/landing-page interactions
 * (contact form submissions and waitlist sign-ups).
 *
 * @module lib/email/marketing-emails
 */

const BRAND_COLOR = '#44B080';
const BRAND_COLOR_DARK = '#3a9a6d';

/**
 * Escapes user-provided strings before interpolating them into HTML emails,
 * preventing HTML/script injection in the rendered message.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_DARK} 100%); padding: 28px 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: -0.02em;">CoachFlow</h1>
          </div>
          <div style="padding: 32px;">
            ${content}
          </div>
        </div>
      </body>
    </html>
  `;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 8px 0; color: #999; font-size: 13px; vertical-align: top; width: 140px;">${escapeHtml(label)}</td>
      <td style="padding: 8px 0; color: #333; font-size: 15px; vertical-align: top;">${value}</td>
    </tr>
  `;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}

/**
 * Notification sent to the business owner when the contact form is submitted.
 */
export function contactNotificationEmail(data: ContactSubmission): string {
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const phoneRow = data.phone
    ? row('Telefón', `<a href="tel:${escapeHtml(data.phone)}" style="color: ${BRAND_COLOR}; text-decoration: none;">${escapeHtml(data.phone)}</a>`)
    : '';

  return layout(`
    <h2 style="color: #333; margin: 0 0 8px; font-size: 18px;">Nová správa z kontaktného formulára</h2>
    <p style="color: #666; font-size: 14px; margin: 0 0 24px;">Niekto vám napísal cez landing page.</p>
    <table style="width: 100%; border-collapse: collapse;">
      ${row('Meno / firma', escapeHtml(data.name))}
      ${row('E-mail', `<a href="mailto:${safeEmail}" style="color: ${BRAND_COLOR}; text-decoration: none;">${safeEmail}</a>`)}
      ${phoneRow}
    </table>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 13px; margin: 0 0 8px;">Správa</p>
      <p style="color: #333; font-size: 15px; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
    </div>
  `);
}

export interface WaitlistSubmission {
  email: string;
}

/**
 * Notification sent to the business owner when someone joins the waitlist.
 */
export function waitlistNotificationEmail(data: WaitlistSubmission): string {
  const safeEmail = escapeHtml(data.email);

  return layout(`
    <h2 style="color: #333; margin: 0 0 8px; font-size: 18px;">Nový záujemca o skorší prístup</h2>
    <p style="color: #666; font-size: 14px; margin: 0 0 24px;">Niekto sa pridal do waitlistu cez landing page.</p>
    <table style="width: 100%; border-collapse: collapse;">
      ${row('E-mail', `<a href="mailto:${safeEmail}" style="color: ${BRAND_COLOR}; text-decoration: none;">${safeEmail}</a>`)}
    </table>
  `);
}

/**
 * Confirmation sent to the user who joined the waitlist.
 */
export function waitlistConfirmationEmail(): string {
  return layout(`
    <h2 style="color: #333; margin: 0 0 12px; font-size: 18px;">Ďakujeme za váš záujem! 🎉</h2>
    <p style="color: #666; font-size: 15px; margin: 0 0 16px;">
      Zaradili sme vás do zoznamu na skorší prístup do CoachFlow. Akonáhle bude pripravený,
      ozveme sa vám medzi prvými.
    </p>
    <p style="color: #666; font-size: 15px; margin: 0;">
      Tešíme sa,<br>
      tím CoachFlow
    </p>
  `);
}
