"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DocumentIcon, PaperclipIcon, TrashIcon } from "@/components/icons";

export function ResumeRowControl({
  applicationId,
  resume,
}: {
  applicationId: string;
  resume: { originalFilename: string; uploadedAt: string } | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("resume", file);

    startTransition(async () => {
      const res = await fetch(`/api/applications/${applicationId}/resume`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Upload failed");
        return;
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await fetch(`/api/applications/${applicationId}/resume`, {
        method: "DELETE",
      });
      router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-1">
      {resume ? (
        <>
          <a
            href={`/api/applications/${applicationId}/resume?mode=inline`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Preview ${resume.originalFilename}`}
            aria-label={`Preview resume: ${resume.originalFilename}`}
            className="flex h-6 w-6 items-center justify-center rounded text-primary hover:bg-primary/10"
          >
            <DocumentIcon className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            title="Remove resume"
            aria-label="Remove resume"
            className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          title="Upload resume"
          aria-label="Upload resume"
          className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
        >
          <PaperclipIcon className="h-3.5 w-3.5" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
