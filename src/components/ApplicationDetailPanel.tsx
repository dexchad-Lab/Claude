import Link from "next/link";
import { StatusTimeline } from "@/components/StatusTimeline";
import { ResumeUploader } from "@/components/ResumeUploader";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";
import { EditIcon, ExternalLinkIcon } from "@/components/icons";
import type { ApplicationRow } from "@/components/ApplicationsTable";

export function ApplicationDetailPanel({
  app,
  storageConfigured = true,
}: {
  app: ApplicationRow;
  storageConfigured?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Link
          href={`/applications/${app.id}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ExternalLinkIcon className="h-3.5 w-3.5" />
          Open full page
        </Link>
        <Link
          href={`/applications/${app.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <EditIcon className="h-3.5 w-3.5" />
          Edit details
        </Link>
        {app.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {link.label} &#8599;
          </a>
        ))}
        <span className="ml-auto">
          <DeleteApplicationButton
            applicationId={app.id}
            companyName={app.companyName}
          />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Job description
          </h3>
          <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {app.jobDescription || (
              <span className="italic text-gray-400 dark:text-gray-500">Not added yet.</span>
            )}
          </p>
          {app.aboutCompany && (
            <>
              <h3 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                About the company
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {app.aboutCompany}
              </p>
            </>
          )}
          {app.outcomeNotes && (
            <>
              <h3 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Outcome / notes
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {app.outcomeNotes}
              </p>
            </>
          )}
          <div className="mt-3">
            <ResumeUploader
              applicationId={app.id}
              resume={app.resume}
              storageConfigured={storageConfigured}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Status history
          </h3>
          <StatusTimeline entries={app.statusHistory} />
        </div>
      </div>
    </div>
  );
}
