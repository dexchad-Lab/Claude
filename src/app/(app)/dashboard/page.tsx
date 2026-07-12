import Link from "next/link";
import { auth } from "@/auth";
import { PipelineDashboard, type FunnelStage, type ActivityItem } from "@/components/PipelineDashboard";
import { STATUS_LABELS } from "@/components/StatusBadge";
import { getUserApplications } from "@/lib/applications";
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

  const applications = await getUserApplications(userId);

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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Your dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total === 0
              ? "Add your first application to get started."
              : `Tracking ${total} application${total === 1 ? "" : "s"} — keep at it.`}
          </p>
        </div>
        <Link
          href="/applications"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          View all applications
        </Link>
      </div>

      <PipelineDashboard
        total={total}
        active={active}
        offers={offers}
        responseRate={responseRate}
        funnelStages={funnelStages}
        activity={activity}
      />
    </div>
  );
}
