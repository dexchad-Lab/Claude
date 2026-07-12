import { auth } from "@/auth";
import { ApplicationsSection } from "@/components/ApplicationsSection";
import { getUserApplications, toApplicationRows } from "@/lib/applications";
import { isBlobConfigured } from "@/lib/upload";

export default async function ApplicationsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const applications = await getUserApplications(userId);
  const tableRows = toApplicationRows(applications);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every application you&apos;ve added, all in one place.
        </p>
      </div>

      <ApplicationsSection
        applications={tableRows}
        storageConfigured={isBlobConfigured()}
      />
    </div>
  );
}
