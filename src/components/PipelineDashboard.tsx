import Link from "next/link";
import { STATUS_LABELS } from "@/components/StatusBadge";
import {
  BriefcaseIcon,
  FlameIcon,
  TrophyIcon,
  ChartBarIcon,
  FunnelIcon,
  ActivityIcon,
} from "@/components/icons";
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

const STAT_ACCENTS = {
  blue: { icon: "bg-blue-50 text-blue-600", ring: "hover:border-blue-200" },
  amber: { icon: "bg-amber-50 text-amber-600", ring: "hover:border-amber-200" },
  green: { icon: "bg-green-50 text-green-600", ring: "hover:border-green-200" },
  purple: { icon: "bg-purple-50 text-purple-600", ring: "hover:border-purple-200" },
};

function StatTile({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: keyof typeof STAT_ACCENTS;
}) {
  const styles = STAT_ACCENTS[accent];
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition dark:border-gray-800 dark:bg-gray-900 ${styles.ring}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FunnelChart({ stages, total }: { stages: FunnelStage[]; total: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <FunnelIcon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pipeline funnel</h2>
      </div>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Applications that have ever reached each stage
      </p>
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const pct = total > 0 ? (stage.count / total) * 100 : 0;
          return (
            <div key={stage.status} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{stage.label}</span>
                <span className="tabular-nums text-gray-500 dark:text-gray-400">
                  {stage.count}{" "}
                  <span className="text-gray-400">
                    ({total > 0 ? Math.round(pct) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-[10px] w-full rounded-full bg-gray-100 dark:bg-gray-800">
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <ActivityIcon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent activity</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No status changes yet.</p>
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
                  className="font-medium text-gray-900 hover:underline dark:text-gray-100"
                >
                  {item.companyName}
                </Link>{" "}
                <span className="text-gray-500 dark:text-gray-400">&middot; {item.jobTitle}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
        <StatTile
          label="Total applications"
          value={String(total)}
          icon={<BriefcaseIcon className="h-5 w-5" />}
          accent="blue"
        />
        <StatTile
          label="Active"
          value={String(active)}
          icon={<FlameIcon className="h-5 w-5" />}
          accent="amber"
        />
        <StatTile
          label="Offers"
          value={String(offers)}
          icon={<TrophyIcon className="h-5 w-5" />}
          accent="green"
        />
        <StatTile
          label="Response rate"
          value={`${responseRate}%`}
          icon={<ChartBarIcon className="h-5 w-5" />}
          accent="purple"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FunnelChart stages={funnelStages} total={total} />
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
