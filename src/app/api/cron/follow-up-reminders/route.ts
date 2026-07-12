import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendFollowUpReminderEmail,
  isEmailConfigured,
  type FollowUpReminderItem,
} from "@/lib/email";
import type { ApplicationStatus } from "@/generated/prisma";

const TERMINAL_STATUSES: ApplicationStatus[] = ["OFFER", "REJECTED", "WITHDRAWN"];

export async function GET(request: NextRequest) {
  // Vercel sets this automatically for scheduled cron invocations when
  // CRON_SECRET is configured on the project; skip the check if it isn't
  // set (e.g. local testing) rather than locking the route out entirely.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const due = await prisma.jobApplication.findMany({
    where: {
      followUpAt: { lte: new Date() },
      followUpNotifiedAt: null,
      status: { notIn: TERMINAL_STATUSES },
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  const byUser = new Map<
    string,
    { email: string; name: string; items: FollowUpReminderItem[] }
  >();
  for (const app of due) {
    const entry = byUser.get(app.userId) ?? {
      email: app.user.email,
      name: app.user.name ?? app.user.email,
      items: [],
    };
    entry.items.push({
      applicationId: app.id,
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      followUpAt: app.followUpAt!,
    });
    byUser.set(app.userId, entry);
  }

  const appUrl = process.env.APP_URL ?? new URL(request.url).origin;

  let usersNotified = 0;
  let applicationsNotified = 0;
  const errors: string[] = [];

  for (const [, { email, name, items }] of byUser) {
    const result = await sendFollowUpReminderEmail(email, name, items, appUrl);
    if (result.sent) {
      await prisma.jobApplication.updateMany({
        where: { id: { in: items.map((i) => i.applicationId) } },
        data: { followUpNotifiedAt: new Date() },
      });
      usersNotified++;
      applicationsNotified += items.length;
    } else if (result.error && result.error !== "Email not configured") {
      errors.push(`${email}: ${result.error}`);
    }
  }

  return NextResponse.json({
    emailConfigured: isEmailConfigured(),
    dueApplications: due.length,
    usersNotified,
    applicationsNotified,
    errors,
  });
}
