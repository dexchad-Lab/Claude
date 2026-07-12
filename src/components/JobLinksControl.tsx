"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PaperclipIcon, TrashIcon } from "@/components/icons";
import { addLinkAction, removeLinkAction } from "@/app/(app)/dashboard/actions";

export function JobLinksControl({
  applicationId,
  links,
}: {
  applicationId: string;
  links: { id: string; label: string; url: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleAdd() {
    if (!url.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await addLinkAction(
        applicationId,
        label.trim() || "Link",
        url.trim(),
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      setUrl("");
      setLabel("");
      router.refresh();
    });
  }

  function handleRemove(linkId: string) {
    startTransition(async () => {
      await removeLinkAction(applicationId, linkId);
      router.refresh();
    });
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`${links.length} job link${links.length === 1 ? "" : "s"} — add or view`}
        title="Job links"
        className={`flex h-6 items-center gap-1 rounded px-1 text-xs hover:bg-primary/10 ${
          links.length > 0 ? "text-primary" : "text-gray-300 hover:text-primary"
        }`}
      >
        <PaperclipIcon className="h-3.5 w-3.5" />
        {links.length > 0 && <span className="tabular-nums">{links.length}</span>}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white p-3 text-left shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {links.length > 0 && (
            <ul className="mb-2 max-h-32 space-y-1 overflow-y-auto">
              {links.map((link) => (
                <li key={link.id} className="flex items-center justify-between gap-1 text-xs">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    {link.label}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(link.id)}
                    aria-label={`Remove ${link.label}`}
                    className="shrink-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-1.5">
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Label (optional)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending || !url.trim()}
              className="w-full rounded bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
