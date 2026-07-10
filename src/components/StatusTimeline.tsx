import { STATUS_LABELS } from "@/components/StatusBadge";
import type { ApplicationStatus } from "@/generated/prisma";

export type StatusHistoryEntry = {
  id: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedAt: string;
};

export function StatusTimeline({ entries }: { entries: StatusHistoryEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );

  return (
    <ol className="space-y-4">
      {sorted.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
          <div>
            <p className="text-sm text-gray-900">
              {entry.fromStatus ? (
                <>
                  {STATUS_LABELS[entry.fromStatus]} &rarr;{" "}
                  <span className="font-medium">
                    {STATUS_LABELS[entry.toStatus]}
                  </span>
                </>
              ) : (
                <span className="font-medium">
                  Created &middot; {STATUS_LABELS[entry.toStatus]}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(entry.changedAt).toLocaleString()}
            </p>
            {entry.note && (
              <p className="mt-1 text-sm text-gray-600">{entry.note}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
