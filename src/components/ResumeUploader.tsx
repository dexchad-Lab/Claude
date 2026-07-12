"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ResumeUploader({
  applicationId,
  resume,
  storageConfigured = true,
}: {
  applicationId: string;
  resume: { originalFilename: string; uploadedAt: string } | null;
  storageConfigured?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/applications/${applicationId}/resume`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Delete failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-900">
        Tailored resume
      </h2>

      {resume ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <a
              href={`/api/applications/${applicationId}/resume`}
              className="text-sm font-medium text-gray-900 underline"
            >
              {resume.originalFilename}
            </a>
            <p className="text-xs text-gray-500">
              Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {isPending ? "Uploading..." : "Upload resume (PDF or Word)"}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {!storageConfigured && (
        <p className="mt-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700">
          File storage isn&apos;t fully set up yet, so this resume may not
          stick around. Ask whoever manages the deployment to add Vercel
          Blob storage.
        </p>
      )}
    </div>
  );
}
