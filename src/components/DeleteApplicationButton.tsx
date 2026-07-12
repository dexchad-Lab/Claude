"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";
import { deleteApplicationAction } from "@/app/(app)/dashboard/actions";

export function DeleteApplicationButton({
  applicationId,
  companyName,
  redirectTo,
  showLabel = true,
  className = "inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50",
}: {
  applicationId: string;
  companyName: string;
  redirectTo?: string;
  showLabel?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteApplicationAction(applicationId);
      if (result.error) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-gray-600">
          Delete {companyName}?
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={showLabel ? undefined : `Delete ${companyName}`}
      title={showLabel ? undefined : `Delete ${companyName}`}
      className={className}
    >
      <TrashIcon className="h-3.5 w-3.5" />
      {showLabel && "Delete"}
    </button>
  );
}
