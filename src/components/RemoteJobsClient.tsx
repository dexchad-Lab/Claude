"use client";

import { useMemo, useState, useTransition } from "react";
import type { RemoteJob } from "@/lib/remoteJobs";
import { quickCreateApplicationAction } from "@/app/(app)/dashboard/actions";
import { ExternalLinkIcon, BriefcaseIcon } from "@/components/icons";

function AddToTrackerButton({ job }: { job: RemoteJob }) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const formData = new FormData();
    formData.set("companyName", job.company);
    formData.set("jobTitle", job.position);
    formData.set("jobDescription", "");
    formData.set("sourceUrl", job.url);
    startTransition(async () => {
      const result = await quickCreateApplicationAction(formData);
      if (!result.error) setAdded(true);
    });
  }

  if (added) {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
        Added to tracker
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <BriefcaseIcon className="h-3.5 w-3.5" />
      {isPending ? "Adding…" : "Add to tracker"}
    </button>
  );
}

export function RemoteJobsClient({ jobs }: { jobs: RemoteJob[] }) {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("ALL");

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const job of jobs) {
      for (const tag of job.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag);
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.position.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);
      const matchesTag = tagFilter === "ALL" || job.tags.includes(tagFilter);
      return matchesQuery && matchesTag;
    });
  }, [jobs, query, tagFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search role or company…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <select
          aria-label="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="ALL">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} of {jobs.length} roles
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
          No roles match your search or filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {job.position}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.company}
                  </p>
                  {job.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                    View posting
                  </a>
                  <AddToTrackerButton job={job} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
