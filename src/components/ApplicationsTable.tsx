"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUS_LABELS } from "@/components/StatusBadge";
import { StatusTimeline, type StatusHistoryEntry } from "@/components/StatusTimeline";
import { ResumeUploader } from "@/components/ResumeUploader";
import { APPLICATION_STATUSES } from "@/lib/validations";
import type { ApplicationStatus } from "@/generated/prisma";
import {
  quickCreateApplicationAction,
  updateCompanyNameAction,
  updateJobTitleAction,
  quickChangeStatusAction,
  updateAppliedAtAction,
  updateFollowUpAtAction,
  fetchJobFromUrlAction,
} from "@/app/(app)/dashboard/actions";

export type ApplicationRow = {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  updatedAt: string;
  appliedAt: string;
  followUpAt: string | null;
  jobDescription: string;
  aboutCompany: string | null;
  outcomeNotes: string | null;
  links: { id: string; label: string; url: string }[];
  resume: { originalFilename: string; uploadedAt: string } | null;
  statusHistory: StatusHistoryEntry[];
};

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

const STATUS_SELECT_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700",
  SCREENING: "bg-purple-50 text-purple-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-600",
};

const NEW_ROW = 0;

function focusCell(table: HTMLTableElement | null, row: number, col: number) {
  const el = table?.querySelector<HTMLInputElement | HTMLSelectElement>(
    `[data-row="${row}"][data-col="${col}"]`,
  );
  el?.focus();
  if (el instanceof HTMLInputElement) el.select();
}

export function ApplicationsTable({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const router = useRouter();
  const tableRef = useRef<HTMLTableElement>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [fetchNotice, setFetchNotice] = useState<string | null>(null);
  const [creating, startCreating] = useTransition();
  const [fetching, startFetching] = useTransition();

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

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    row: number,
    col: number,
  ) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusCell(tableRef.current, row + 1, col);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCell(tableRef.current, row - 1, col);
    } else if (e.key === "Enter" && e.currentTarget.tagName === "INPUT") {
      e.preventDefault();
      e.currentTarget.blur();
      focusCell(tableRef.current, row + 1, col);
    }
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
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table ref={tableRef} className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="w-8 px-3 py-2"></th>
            <th className="px-2 py-2">Company</th>
            <th className="px-2 py-2">Job title</th>
            <th className="px-2 py-2">Status</th>
            <th className="hidden px-2 py-2 md:table-cell">Applied</th>
            <th className="hidden px-2 py-2 md:table-cell">Follow-up</th>
            <th className="hidden px-2 py-2 sm:table-cell">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-gray-50">
            <td colSpan={7} className="px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste a job posting URL to auto-fill (optional)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleFetchUrl();
                    }
                  }}
                  className="w-72 max-w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleFetchUrl}
                  disabled={fetching || !newUrl.trim()}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {fetching ? "Fetching…" : "Fetch details"}
                </button>
                {fetchNotice && (
                  <span className="text-xs text-gray-500">{fetchNotice}</span>
                )}
              </div>
            </td>
          </tr>
          <tr className="border-b border-gray-100 bg-gray-50">
            <td className="px-3 py-2 text-gray-300">+</td>
            <td className="p-1">
              <input
                data-row={NEW_ROW}
                data-col={0}
                type="text"
                placeholder="Company name"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    focusCell(tableRef.current, NEW_ROW, 1);
                  } else {
                    handleKeyDown(e, NEW_ROW, 0);
                  }
                }}
                className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 focus:border-gray-300 focus:bg-white focus:outline-none"
              />
            </td>
            <td className="p-1">
              <input
                data-row={NEW_ROW}
                data-col={1}
                type="text"
                placeholder="Job title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateSubmit();
                  } else {
                    handleKeyDown(e, NEW_ROW, 1);
                  }
                }}
                className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 focus:border-gray-300 focus:bg-white focus:outline-none"
              />
            </td>
            <td className="p-1" colSpan={4}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateSubmit}
                  disabled={creating}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                >
                  {creating ? "Adding…" : "+ Add application"}
                </button>
                {createError && (
                  <span className="text-xs text-red-600">{createError}</span>
                )}
              </div>
            </td>
          </tr>

          {applications.map((app, index) => (
            <ApplicationRowGroup
              key={app.id}
              app={app}
              row={index + 1}
              isExpanded={expanded.has(app.id)}
              onToggle={() => toggleExpand(app.id)}
              onKeyDown={handleKeyDown}
            />
          ))}

          {applications.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                No applications yet &mdash; add your first one above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationRowGroup({
  app,
  row,
  isExpanded,
  onToggle,
  onKeyDown,
}: {
  app: ApplicationRow;
  row: number;
  isExpanded: boolean;
  onToggle: () => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    row: number,
    col: number,
  ) => void;
}) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(app.companyName);
  const [jobTitle, setJobTitle] = useState(app.jobTitle);
  const [appliedAt, setAppliedAt] = useState(toDateInputValue(app.appliedAt));
  const [followUpAt, setFollowUpAt] = useState(toDateInputValue(app.followUpAt));
  const [savingField, setSavingField] = useState<string | null>(null);
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
    setSavingField("company");
    setFieldError(null);
    startTransition(async () => {
      const result = await updateCompanyNameAction(app.id, trimmed);
      setSavingField(null);
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
    setSavingField("title");
    setFieldError(null);
    startTransition(async () => {
      const result = await updateJobTitleAction(app.id, trimmed);
      setSavingField(null);
      if (result.error) {
        setFieldError(result.error);
        setJobTitle(app.jobTitle);
      } else {
        router.refresh();
      }
    });
  }

  function changeStatus(status: string) {
    setSavingField("status");
    setFieldError(null);
    startTransition(async () => {
      const result = await quickChangeStatusAction(app.id, status);
      setSavingField(null);
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
    setSavingField("appliedAt");
    setFieldError(null);
    startTransition(async () => {
      const result = await updateAppliedAtAction(app.id, appliedAt);
      setSavingField(null);
      if (result.error) {
        setFieldError(result.error);
        setAppliedAt(toDateInputValue(app.appliedAt));
      } else {
        router.refresh();
      }
    });
  }

  function saveFollowUpAt() {
    setSavingField("followUpAt");
    setFieldError(null);
    startTransition(async () => {
      const result = await updateFollowUpAtAction(app.id, followUpAt);
      setSavingField(null);
      if (result.error) {
        setFieldError(result.error);
        setFollowUpAt(toDateInputValue(app.followUpAt));
      } else {
        router.refresh();
      }
    });
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="px-3 py-2">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <span
              className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              &#9656;
            </span>
          </button>
        </td>
        <td className="p-1">
          <input
            data-row={row}
            data-col={0}
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onBlur={saveCompanyName}
            onKeyDown={(e) => onKeyDown(e, row, 0)}
            className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 font-medium text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-none"
          />
        </td>
        <td className="p-1">
          <input
            data-row={row}
            data-col={1}
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onBlur={saveJobTitle}
            onKeyDown={(e) => onKeyDown(e, row, 1)}
            className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-gray-700 focus:border-gray-300 focus:bg-white focus:outline-none"
          />
        </td>
        <td className="p-1">
          <select
            data-row={row}
            data-col={2}
            value={app.status}
            onChange={(e) => changeStatus(e.target.value)}
            onKeyDown={(e) => onKeyDown(e, row, 2)}
            className={`w-full cursor-pointer rounded border border-transparent px-2 py-1.5 text-xs font-medium focus:border-gray-300 focus:outline-none ${STATUS_SELECT_STYLES[app.status]}`}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </td>
        <td className="hidden p-1 md:table-cell">
          <input
            data-row={row}
            data-col={3}
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            onBlur={saveAppliedAt}
            onKeyDown={(e) => onKeyDown(e, row, 3)}
            className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-xs text-gray-600 focus:border-gray-300 focus:bg-white focus:outline-none"
          />
        </td>
        <td className="hidden p-1 md:table-cell">
          <input
            data-row={row}
            data-col={4}
            type="date"
            value={followUpAt}
            onChange={(e) => setFollowUpAt(e.target.value)}
            onBlur={saveFollowUpAt}
            onKeyDown={(e) => onKeyDown(e, row, 4)}
            className={`w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-xs focus:border-gray-300 focus:bg-white focus:outline-none ${
              isOverdue ? "font-medium text-red-600" : "text-gray-600"
            }`}
          />
        </td>
        <td className="hidden px-2 py-2 text-xs text-gray-400 sm:table-cell">
          {savingField ? "Saving…" : new Date(app.updatedAt).toLocaleDateString()}
        </td>
      </tr>
      {fieldError && (
        <tr>
          <td></td>
          <td colSpan={6} className="px-2 pb-1 text-xs text-red-600">
            {fieldError}
          </td>
        </tr>
      )}
      {isExpanded && (
        <tr className="border-b border-gray-100 bg-gray-50/60">
          <td></td>
          <td colSpan={6} className="space-y-4 px-3 py-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/applications/${app.id}`}
                className="rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100"
              >
                Open full page
              </Link>
              <Link
                href={`/applications/${app.id}/edit`}
                className="rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100"
              >
                Edit details
              </Link>
              {app.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100"
                >
                  {link.label} &#8599;
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Job description
                </h3>
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {app.jobDescription || (
                    <span className="italic text-gray-400">Not added yet.</span>
                  )}
                </p>
                {app.aboutCompany && (
                  <>
                    <h3 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      About the company
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {app.aboutCompany}
                    </p>
                  </>
                )}
                {app.outcomeNotes && (
                  <>
                    <h3 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Outcome / notes
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {app.outcomeNotes}
                    </p>
                  </>
                )}
                <div className="mt-3">
                  <ResumeUploader
                    applicationId={app.id}
                    resume={app.resume}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status history
                </h3>
                <StatusTimeline entries={app.statusHistory} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
