"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS } from "@/components/StatusBadge";
import { ApplicationDetailPanel } from "@/components/ApplicationDetailPanel";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";
import { JobLinksControl } from "@/components/JobLinksControl";
import { ResumeRowControl } from "@/components/ResumeRowControl";
import { APPLICATION_STATUSES } from "@/lib/validations";
import type { ApplicationStatus } from "@/generated/prisma";
import type { ApplicationRow } from "@/components/ApplicationsTable";
import {
  quickCreateApplicationAction,
  updateCompanyNameAction,
  updateJobTitleAction,
  quickChangeStatusAction,
  updateAppliedAtAction,
  updateFollowUpAtAction,
  fetchJobFromUrlAction,
} from "@/app/(app)/dashboard/actions";

const STATUS_SELECT_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  SCREENING: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  INTERVIEW: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  OFFER: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  REJECTED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  WITHDRAWN: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function ApplicationsMobileList({
  applications,
  storageConfigured = true,
}: {
  applications: ApplicationRow[];
  storageConfigured?: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [fetchNotice, setFetchNotice] = useState<string | null>(null);
  const [creating, startCreating] = useTransition();
  const [fetching, startFetching] = useTransition();

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleFetchUrl() {
    if (!newUrl.trim()) return;
    setFetchNotice(null);
    setCreateError(null);
    startFetching(async () => {
      const result = await fetchJobFromUrlAction(newUrl.trim());
      if (result.error) {
        setFetchNotice(result.error);
        return;
      }
      if (result.companyName) setNewCompany(result.companyName);
      if (result.jobTitle) setNewTitle(result.jobTitle);
      if (result.jobDescription) setNewDescription(result.jobDescription);
      setFetchNotice(
        result.foundDetails
          ? "Filled in from that page — review before adding."
          : "Couldn't auto-detect details from that page (common for LinkedIn/Indeed) — the link will still be attached, just fill in the rest manually.",
      );
    });
  }

  function handleCreateSubmit() {
    if (!newCompany.trim() || !newTitle.trim()) {
      setCreateError("Company and job title are required");
      return;
    }
    setCreateError(null);
    const formData = new FormData();
    formData.set("companyName", newCompany);
    formData.set("jobTitle", newTitle);
    formData.set("jobDescription", newDescription);
    formData.set("sourceUrl", newUrl.trim());
    startCreating(async () => {
      const result = await quickCreateApplicationAction(formData);
      if (result.error) {
        setCreateError(result.error);
        return;
      }
      setNewCompany("");
      setNewTitle("");
      setNewDescription("");
      setNewUrl("");
      setFetchNotice(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-xl border border-gray-200 bg-white shadow-sm p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Add application
        </h2>
        <input
          type="url"
          placeholder="Paste a job posting URL to auto-fill (optional)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        {newUrl.trim() && (
          <button
            type="button"
            onClick={handleFetchUrl}
            disabled={fetching}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {fetching ? "Fetching…" : "Fetch details from URL"}
          </button>
        )}
        {fetchNotice && <p className="text-xs text-gray-500 dark:text-gray-400">{fetchNotice}</p>}
        <input
          type="text"
          placeholder="Company name"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <input
          type="text"
          placeholder="Job title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={handleCreateSubmit}
          disabled={creating}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {creating ? "Adding…" : "+ Add application"}
        </button>
        {createError && <p className="text-xs text-red-600 dark:text-red-400">{createError}</p>}
      </div>

      {applications.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
          No applications yet &mdash; add your first one above.
        </div>
      )}

      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          isExpanded={expanded.has(app.id)}
          onToggle={() => toggleExpand(app.id)}
          storageConfigured={storageConfigured}
        />
      ))}
    </div>
  );
}

function ApplicationCard({
  app,
  isExpanded,
  onToggle,
  storageConfigured = true,
}: {
  app: ApplicationRow;
  isExpanded: boolean;
  onToggle: () => void;
  storageConfigured?: boolean;
}) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(app.companyName);
  const [jobTitle, setJobTitle] = useState(app.jobTitle);
  const [appliedAt, setAppliedAt] = useState(toDateInputValue(app.appliedAt));
  const [followUpAt, setFollowUpAt] = useState(toDateInputValue(app.followUpAt));
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isOverdue =
    !!app.followUpAt &&
    new Date(app.followUpAt) < new Date(new Date().toDateString()) &&
    !["OFFER", "REJECTED", "WITHDRAWN"].includes(app.status);

  function saveCompanyName() {
    const trimmed = companyName.trim();
    if (!trimmed || trimmed === app.companyName) {
      setCompanyName(app.companyName);
      return;
    }
    setFieldError(null);
    startTransition(async () => {
      const result = await updateCompanyNameAction(app.id, trimmed);
      if (result.error) {
        setFieldError(result.error);
        setCompanyName(app.companyName);
      } else {
        router.refresh();
      }
    });
  }

  function saveJobTitle() {
    const trimmed = jobTitle.trim();
    if (!trimmed || trimmed === app.jobTitle) {
      setJobTitle(app.jobTitle);
      return;
    }
    setFieldError(null);
    startTransition(async () => {
      const result = await updateJobTitleAction(app.id, trimmed);
      if (result.error) {
        setFieldError(result.error);
        setJobTitle(app.jobTitle);
      } else {
        router.refresh();
      }
    });
  }

  function changeStatus(status: string) {
    setFieldError(null);
    startTransition(async () => {
      const result = await quickChangeStatusAction(app.id, status);
      if (result.error) {
        setFieldError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function saveAppliedAt() {
    if (!appliedAt) {
      setAppliedAt(toDateInputValue(app.appliedAt));
      return;
    }
    setFieldError(null);
    startTransition(async () => {
      const result = await updateAppliedAtAction(app.id, appliedAt);
      if (result.error) {
        setFieldError(result.error);
        setAppliedAt(toDateInputValue(app.appliedAt));
      } else {
        router.refresh();
      }
    });
  }

  function saveFollowUpAt() {
    setFieldError(null);
    startTransition(async () => {
      const result = await updateFollowUpAtAction(app.id, followUpAt);
      if (result.error) {
        setFieldError(result.error);
        setFollowUpAt(toDateInputValue(app.followUpAt));
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={saveCompanyName}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm font-semibold text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800"
            />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onBlur={saveJobTitle}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:text-gray-300 dark:focus:bg-gray-800"
            />
            <div className="flex items-center gap-1">
              <JobLinksControl applicationId={app.id} links={app.links} />
              <ResumeRowControl applicationId={app.id} resume={app.resume} />
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            <DeleteApplicationButton
              applicationId={app.id}
              companyName={app.companyName}
              showLabel={false}
              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950"
            />
            <button
              type="button"
              onClick={onToggle}
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <span
                className={`inline-block text-lg transition-transform ${isExpanded ? "rotate-90" : ""}`}
              >
                &#9656;
              </span>
            </button>
          </div>
        </div>

        <select
          value={app.status}
          onChange={(e) => changeStatus(e.target.value)}
          className={`mt-2 w-full rounded-md border border-transparent px-2 py-2 text-sm font-medium ${STATUS_SELECT_STYLES[app.status]}`}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Applied</span>
            <input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              onBlur={saveAppliedAt}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:text-gray-400 dark:focus:bg-gray-800"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
              Follow-up
            </span>
            <input
              type="date"
              value={followUpAt}
              onChange={(e) => setFollowUpAt(e.target.value)}
              onBlur={saveFollowUpAt}
              className={`w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                isOverdue ? "font-medium text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </label>
        </div>

        {fieldError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldError}</p>}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/30">
          <ApplicationDetailPanel app={app} storageConfigured={storageConfigured} />
        </div>
      )}
    </div>
  );
}
