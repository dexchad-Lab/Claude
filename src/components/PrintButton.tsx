"use client";

import { DownloadIcon } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover print:hidden"
    >
      <DownloadIcon className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
