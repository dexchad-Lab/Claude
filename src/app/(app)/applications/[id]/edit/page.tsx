import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "@/components/ApplicationForm";
import { updateApplicationAction } from "../actions";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const application = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: { links: true },
  });

  if (!application) {
    notFound();
  }

  const boundUpdate = updateApplicationAction.bind(null, application.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Edit application
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ApplicationForm
          action={boundUpdate}
          initial={{
            companyName: application.companyName,
            jobTitle: application.jobTitle,
            jobDescription: application.jobDescription,
            aboutCompany: application.aboutCompany ?? "",
            outcomeNotes: application.outcomeNotes ?? "",
            links: application.links.map((l) => ({ label: l.label, url: l.url })),
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
