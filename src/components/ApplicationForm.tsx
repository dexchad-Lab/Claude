"use client";

import { useActionState } from "react";
import { LinkListInput, type LinkEntry } from "@/components/LinkListInput";

export type ApplicationFormState = {
  error?: string;
};

export function ApplicationForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    prevState: ApplicationFormState,
    formData: FormData,
  ) => Promise<ApplicationFormState>;
  initial?: {
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    aboutCompany?: string;
    outcomeNotes?: string;
    links?: LinkEntry[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="companyName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            defaultValue={initial?.companyName}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="jobTitle"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Job title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            required
            defaultValue={initial?.jobTitle}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="jobDescription"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Job description
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          rows={6}
          defaultValue={initial?.jobDescription}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="aboutCompany"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          About the company
        </label>
        <textarea
          id="aboutCompany"
          name="aboutCompany"
          rows={4}
          defaultValue={initial?.aboutCompany}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <LinkListInput initialLinks={initial?.links} />

      <div>
        <label
          htmlFor="outcomeNotes"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Outcome / notes
        </label>
        <textarea
          id="outcomeNotes"
          name="outcomeNotes"
          rows={3}
          defaultValue={initial?.outcomeNotes}
          placeholder="Final outcome, reflections, or anything worth remembering"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
