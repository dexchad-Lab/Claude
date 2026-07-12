import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PipelineDashboard, type FunnelStage, type ActivityItem } from "@/components/PipelineDashboard";
import { ApplicationsTable, type ApplicationRow } from "@/components/ApplicationsTable";
import { STATUS_LABELS } from "@/components/StatusBadge";
import type { ApplicationStatus } from "@/generated/prisma";

const FUNNEL_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      links: true,
      resume: true,
      statusHistory: true,
    },
  });

  const total = applications.length;
  const offers = applications.filter((app) => app.status === "OFFER").length;
  const active = applications.filter(
    (app) => app.status !== "REJECTED" && app.status !== "WITHDRAWN",
  ).length;

  const reachedCounts = new Map<ApplicationStatus, number>();
  let respondedCount = 0;
  for (const app of applications) {
    const reached = new Set<ApplicationStatus>(
      app.statusHistory.map((entry) => entry.toStatus),
    );
    reached.add(app.status);
    for (const status of FUNNEL_STATUSES) {
      if (reached.has(status)) {
        reachedCounts.set(status, (reachedCounts.get(status) ?? 0) + 1);
      }
    }
    if (
      reached.has("SCREENING") ||
      reached.has("INTERVIEW") ||
      reached.has("OFFER")
    ) {
      respondedCount++;
    }
  }

  const funnelStages: FunnelStage[] = FUNNEL_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: reachedCounts.get(status) ?? 0,
  }));

  const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;

  const activity: ActivityItem[] = applications
    .flatMap((app) =>
      app.statusHistory.map((entry) => ({
        id: entry.id,
        applicationId: app.id,
        companyName: app.companyName,
        jobTitle: app.jobTitle,
        fromStatus: entry.fromStatus,
        toStatus: entry.toStatus,
        changedAt: entry.changedAt.toISOString(),
      })),
    )
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
    .slice(0, 8);

  const tableRows: ApplicationRow[] = applications.map((app) => ({
    id: app.id,
    companyName: app.companyName,
    jobTitle: app.jobTitle,
    status: app.status,
    updatedAt: app.updatedAt.toISOString(),
    appliedAt: app.appliedAt.toISOString(),
    followUpAt: app.followUpAt ? app.followUpAt.toISOString() : null,
    jobDescription: app.jobDescription,
    aboutCompany: app.aboutCompany,
    outcomeNotes: app.outcomeNotes,
    links: app.links.map((link) => ({ id: link.id, label: link.label, url: link.url })),
    resume: app.resume
      ? {
          originalFilename: app.resume.originalFilename,
          uploadedAt: app.resume.uploadedAt.toISOString(),
        }
      : null,
    statusHistory: app.statusHistory.map((entry) => ({
      id: entry.id,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      note: entry.note,
      changedAt: entry.changedAt.toISOString(),
    })),
  }));

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Your applications
      </h1>

      <PipelineDashboard
        total={total}
        active={active}
        offers={offers}
        responseRate={responseRate}
        funnelStages={funnelStages}
        activity={activity}
      />

      <ApplicationsTable applications={tableRows} />
    </div>
  );
}
