"use client";

import { useMemo, useState } from "react";
import { STATUS_LABELS } from "@/components/StatusBadge";
import { ApplicationsTable, type ApplicationRow } from "@/components/ApplicationsTable";
import { ApplicationsMobileList } from "@/components/ApplicationsMobileList";
import { APPLICATION_STATUSES } from "@/lib/validations";

const PAGE_SIZE = 25;

export function ApplicationsSection({
  applications,
  storageConfigured = true,
}: {
  applications: ApplicationRow[];
  storageConfigured?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesQuery =
        !q ||
        app.companyName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search company or job title…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="ALL">All statuses</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        {(query || statusFilter !== "ALL") && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} of {applications.length}
          </span>
        )}
      </div>

      {filtered.length === 0 && applications.length > 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
          No applications match your search or filter.
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <ApplicationsTable applications={visible} storageConfigured={storageConfigured} />
          </div>
          <div className="md:hidden">
            <ApplicationsMobileList applications={visible} storageConfigured={storageConfigured} />
          </div>
        </>
      )}

      {hasMore && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Load more ({filtered.length - visible.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
