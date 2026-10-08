import nodemailer from "nodemailer";

export type MailInput = {
  name: string;
  email: string;
  subject?: string;
  body: string;
};

/**
 * Sends an email via SMTP if SMTP_* env vars are configured.
 * Returns { sent: boolean }. When SMTP is not configured (offline mode),
 * it returns { sent: false } silently — the message is still saved to the DB.
 */
export async function sendContactMail(input: MailInput): Promise<{ sent: boolean; error?: string }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { sent: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: SMTP_TO || SMTP_USER,
      replyTo: input.email,
      subject: input.subject
        ? `[Studio] ${input.subject}`
        : `[Studio] New message from ${input.name}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.body}`,
      html: `<p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(
        input.email
      )}&gt;</p><p>${escapeHtml(input.body).replace(/\n/g, "<br/>")}</p>`,
    });
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
