import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { StatusChangeForm } from "@/components/StatusChangeForm";
import { ResumeUploader } from "@/components/ResumeUploader";
import { changeStatusAction, deleteApplicationAction } from "./actions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const application = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: {
      links: true,
      resume: true,
      statusHistory: true,
    },
  });

  if (!application) {
    notFound();
  }

  const boundChangeStatus = changeStatusAction.bind(null, application.id);
  const boundDelete = deleteApplicationAction.bind(null, application.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {application.jobTitle}
          </h1>
          <p className="text-sm text-gray-500">{application.companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
          <Link
            href={`/applications/${application.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
        </div>
      </div>

      {application.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {application.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {link.label} &#8599;
            </a>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          Job description
        </h2>
        <p className="whitespace-pre-wrap text-sm text-gray-700">
          {application.jobDescription}
        </p>
      </div>

      {application.aboutCompany && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            About the company
          </h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {application.aboutCompany}
          </p>
        </div>
      )}

      <ResumeUploader
        applicationId={application.id}
        resume={
          application.resume
            ? {
                originalFilename: application.resume.originalFilename,
                uploadedAt: application.resume.uploadedAt.toISOString(),
              }
            : null
        }
      />

      {application.outcomeNotes && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Outcome / notes
          </h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {application.outcomeNotes}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <StatusChangeForm
            action={boundChangeStatus}
            currentStatus={application.status}
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Status history
          </h2>
          <StatusTimeline
            entries={application.statusHistory.map((entry) => ({
              id: entry.id,
              fromStatus: entry.fromStatus,
              toStatus: entry.toStatus,
              note: entry.note,
              changedAt: entry.changedAt.toISOString(),
            }))}
          />
        </div>
      </div>

      <form action={boundDelete} className="border-t border-gray-200 pt-4">
        <button
          type="submit"
          className="text-sm text-red-600 underline hover:text-red-700"
        >
          Delete application
        </button>
      </form>
    </div>
  );
}
