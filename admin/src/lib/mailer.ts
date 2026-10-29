// src/lib/mailer.ts
import { Resend } from 'resend';

export async function sendClientQuoteNotification(quoteDoc: any) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes('your_resend_api_key')) {
    console.warn('RESEND_API_KEY not configured in .env.local; skipping email alert.');
    return;
  }

  const resend = new Resend(apiKey);
  const preferredFrom =
    process.env.RESEND_FROM_EMAIL || 'ByFalguni Quotes <onboarding@resend.dev>';
  const to = process.env.NOTIFY_EMAIL || 'byfalguni@gmail.com';

  const sym = quoteDoc.region === 'INDIA' ? '₹' : '$';
  const formattedTotal = `${sym}${Number(
    quoteDoc.evaluatedQuote?.grandTotal || 0
  ).toLocaleString()}`;
  const formattedBudget =
    Number(quoteDoc.budget || 0) > 0
      ? `${sym}${Number(quoteDoc.budget).toLocaleString()}`
      : 'Not specified (Client requested custom quote)';
  const pagesCount = quoteDoc.simpleChoices?.pages ?? 0;

  const html = `
    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 640px; margin: 0 auto; background: #f4f4f4; padding: 24px; border-radius: 16px; color: #111;">
      <div style="background: #111; color: #fff; padding: 20px 24px; border-radius: 12px;">
        <span style="color: #ff5733; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">New Project Scope Submission</span>
        <h2 style="margin: 6px 0 0; font-size: 22px;">${quoteDoc.fullName} — ${
    quoteDoc.businessName || 'New Project'
  }</h2>
      </div>

      <div style="background: #fff; padding: 24px; border-radius: 12px; margin-top: 16px;">
        <p style="margin: 0 0 10px;"><strong>Client Name:</strong> ${quoteDoc.fullName}</p>
        <p style="margin: 0 0 10px;"><strong>Country / Region:</strong> ${quoteDoc.countryFlag} ${
    quoteDoc.countryName
  } (${quoteDoc.region})</p>
        <p style="margin: 0 0 10px;"><strong>Email / Phone:</strong> ${quoteDoc.emailPhone}</p>
        <p style="margin: 0 0 10px;"><strong>Website Category & Pages:</strong> ${
          quoteDoc.simpleChoices?.projectPurpose || 'Custom'
        } (${pagesCount > 0 ? `${pagesCount} pages` : '0 pages — Recommend for client'})</p>
        <p style="margin: 0 0 10px;"><strong>Client Stated Target Budget:</strong> ${formattedBudget}</p>
        <p style="margin: 0 0 10px;"><strong>System Estimated Total (Hidden from Client):</strong> <span style="color: #ff5733; font-weight: 800; font-size: 18px;">${formattedTotal}</span></p>
        <p style="margin: 0 0 10px;"><strong>Main Goal:</strong> ${quoteDoc.mainGoal || 'N/A'}</p>
        <p style="margin: 0 0 10px;"><strong>Ideal Launch Date & Reason:</strong> ${
          quoteDoc.launchDateReason || 'N/A'
        }</p>
        <p style="margin: 0 0 10px;"><strong>Design / Reference Links:</strong> ${
          quoteDoc.designReferences || 'N/A'
        }</p>
        <p style="margin: 0 0 10px;"><strong>Client Custom Notes:</strong> ${
          quoteDoc.clientDescription || 'N/A'
        }</p>
        <p style="margin: 0;"><strong>Uploaded Assets:</strong> ${
          (quoteDoc.uploadedAssets || []).length
        } file(s)</p>
      </div>

      <p style="font-size: 12px; color: #666; text-align: center; margin-top: 16px;">
        Open <strong>admin.byfalguni.com</strong> to review their submitted requirements, fine-tune the Complex Project Price Calculator, and download their Official Quote PDF.
      </p>
    </div>
  `;

  const subject = `🔥 New Project Brief: ${quoteDoc.fullName} (Est. ${formattedTotal} | ${quoteDoc.countryFlag} ${quoteDoc.countryName})`;

  // Attempt with preferred sender (e.g., alerts@byfalguni.com)
  const firstAttempt = await resend.emails.send({
    from: preferredFrom,
    to: [to],
    subject,
    html,
  });

  // Automatic fallback to onboarding@resend.dev if byfalguni.com DNS is not verified yet
  if (firstAttempt.error && !preferredFrom.includes('onboarding@resend.dev')) {
    console.warn(
      `Custom domain sender (${preferredFrom}) not verified yet in Resend; falling back to onboarding@resend.dev`
    );
    await resend.emails.send({
      from: 'ByFalguni Quotes <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });
  }
}