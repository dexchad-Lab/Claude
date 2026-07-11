import Link from "next/link";
import { STATUS_LABELS } from "@/components/StatusBadge";
import type { ApplicationStatus } from "@/generated/prisma";

export type FunnelStage = {
  status: ApplicationStatus;
  label: string;
  count: number;
};

export type ActivityItem = {
  id: string;
  applicationId: string;
  companyName: string;
  jobTitle: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
};

const FUNNEL_COLORS = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab"];

const STATUS_DOT: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-500",
  SCREENING: "bg-purple-500",
  INTERVIEW: "bg-amber-500",
  OFFER: "bg-green-600",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-400",
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function FunnelChart({ stages, total }: { stages: FunnelStage[]; total: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Pipeline funnel
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Applications that have ever reached each stage
      </p>
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const pct = total > 0 ? (stage.count / total) * 100 : 0;
          return (
            <div key={stage.status} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{stage.label}</span>
                <span className="tabular-nums text-gray-500">
                  {stage.count}{" "}
                  <span className="text-gray-400">
                    ({total > 0 ? Math.round(pct) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-[10px] w-full rounded-full bg-gray-100">
                <div
                  className="h-[10px] rounded-full transition-all"
                  style={{
                    width: `${Math.max(pct, total > 0 ? 2 : 0)}%`,
                    backgroundColor: FUNNEL_COLORS[i] ?? FUNNEL_COLORS[FUNNEL_COLORS.length - 1],
                  }}
                  title={`${stage.label}: ${stage.count} of ${total} applications (${Math.round(pct)}%)`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        Recent activity
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No status changes yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[item.toStatus]}`}
              />
              <div className="min-w-0">
                <Link
                  href={`/applications/${item.applicationId}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  {item.companyName}
                </Link>{" "}
                <span className="text-gray-500">&middot; {item.jobTitle}</span>
                <p className="text-xs text-gray-500">
                  {item.fromStatus ? (
                    <>
                      {STATUS_LABELS[item.fromStatus]} &rarr;{" "}
                      {STATUS_LABELS[item.toStatus]}
                    </>
                  ) : (
                    <>Created &middot; {STATUS_LABELS[item.toStatus]}</>
                  )}{" "}
                  &middot; {new Date(item.changedAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PipelineDashboard({
  total,
  active,
  offers,
  responseRate,
  funnelStages,
  activity,
}: {
  total: number;
  active: number;
  offers: number;
  responseRate: number;
  funnelStages: FunnelStage[];
  activity: ActivityItem[];
}) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total applications" value={String(total)} />
        <StatTile label="Active" value={String(active)} />
        <StatTile label="Offers" value={String(offers)} />
        <StatTile label="Response rate" value={`${responseRate}%`} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FunnelChart stages={funnelStages} total={total} />
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
