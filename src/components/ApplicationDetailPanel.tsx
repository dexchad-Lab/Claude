import Link from "next/link";
import { StatusTimeline } from "@/components/StatusTimeline";
import { ResumeUploader } from "@/components/ResumeUploader";
import type { ApplicationRow } from "@/components/ApplicationsTable";

export function ApplicationDetailPanel({ app }: { app: ApplicationRow }) {
  return (
    <div className="space-y-4">
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
            <ResumeUploader applicationId={app.id} resume={app.resume} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Status history
          </h3>
          <StatusTimeline entries={app.statusHistory} />
        </div>
      </div>
    </div>
  );
}
