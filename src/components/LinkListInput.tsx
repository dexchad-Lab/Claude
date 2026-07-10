"use client";

import { useState } from "react";

export type LinkEntry = { label: string; url: string };

export function LinkListInput({
  initialLinks = [],
}: {
  initialLinks?: LinkEntry[];
}) {
  const [links, setLinks] = useState<LinkEntry[]>(
    initialLinks.length > 0 ? initialLinks : [{ label: "Job Posting", url: "" }],
  );

  function updateLink(index: number, field: keyof LinkEntry, value: string) {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    );
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Relevant links
      </label>
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              name={`links.${index}.label`}
              placeholder="Label (e.g. Job Posting)"
              value={link.label}
              onChange={(e) => updateLink(index, "label", e.target.value)}
              className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <input
              type="url"
              name={`links.${index}.url`}
              placeholder="https://..."
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="rounded-md border border-gray-300 px-2 text-sm text-gray-500 hover:bg-gray-50"
              aria-label="Remove link"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLink}
        className="mt-2 text-sm font-medium text-gray-700 underline"
      >
        + Add link
      </button>
    </div>
  );
}
