import { Resend } from "resend";

export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY;
}

let client: Resend | null | undefined;

function getResendClient(): Resend | null {
  if (!isEmailConfigured()) return null;
  if (client === undefined) {
    client = new Resend(process.env.RESEND_API_KEY!);
  }
  return client;
}

export type FollowUpReminderItem = {
  applicationId: string;
  companyName: string;
  jobTitle: string;
  followUpAt: Date;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderFollowUpEmailHtml(
  name: string,
  items: FollowUpReminderItem[],
  appUrl: string,
) {
  const rows = items
    .map((item) => {
      const overdue = item.followUpAt < new Date(new Date().toDateString());
      const dateLabel = item.followUpAt.toLocaleDateString();
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
            <strong>${escapeHtml(item.companyName)}</strong><br/>
            <span style="color:#6b7280;">${escapeHtml(item.jobTitle)}</span>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:${overdue ? "#dc2626" : "#374151"};">
            ${overdue ? "Overdue: " : ""}${dateLabel}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#0369a1;">Follow-up reminders</h2>
      <p>Hi ${escapeHtml(name)}, you have ${items.length} application${items.length === 1 ? "" : "s"} due for follow-up:</p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <p style="margin-top:16px;">
        <a href="${appUrl}/dashboard" style="background:#0369a1;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
          Open your dashboard
        </a>
      </p>
    </div>`;
}

/** No-ops (with a console warning) when RESEND_API_KEY isn't set, so the
 * cron route can still be exercised — and its DB side effects verified —
 * without a live email provider configured. */
export async function sendFollowUpReminderEmail(
  to: string,
  name: string,
  items: FollowUpReminderItem[],
  appUrl: string,
): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping follow-up reminder email to ${to} (${items.length} item(s))`,
    );
    return { sent: false, error: "Email not configured" };
  }

  const from = process.env.EMAIL_FROM || "Job Application Tracker <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from,
      to,
      subject: `${items.length} application${items.length === 1 ? "" : "s"} due for follow-up`,
      html: renderFollowUpEmailHtml(name, items, appUrl),
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}
