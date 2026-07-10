"use client";

import { useActionState } from "react";
import { APPLICATION_STATUSES } from "@/lib/validations";
import { STATUS_LABELS } from "@/components/StatusBadge";
import type { ApplicationStatus } from "@/generated/prisma";

export type StatusChangeState = {
  error?: string;
};

export function StatusChangeForm({
  action,
  currentStatus,
}: {
  action: (
    prevState: StatusChangeState,
    formData: FormData,
  ) => Promise<StatusChangeState>;
  currentStatus: ApplicationStatus;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Change status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="note"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Note (optional)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="e.g. Recruiter call scheduled for Friday"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Updating..." : "Update status"}
      </button>
    </form>
  );
}
