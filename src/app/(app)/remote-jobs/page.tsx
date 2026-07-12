import { fetchRemoteJobs } from "@/lib/remoteJobs";
import { RemoteJobsClient } from "@/components/RemoteJobsClient";

export default async function RemoteJobsPage() {
  const jobs = await fetchRemoteJobs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Remote Jobs
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Live listings pulled from remote job boards. Find one, then add it
          straight to your tracker.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Couldn&apos;t load listings right now.
          </p>
          <p className="mt-1">
            The job board we pull from may be temporarily unreachable —
            try refreshing in a moment.
          </p>
        </div>
      ) : (
        <RemoteJobsClient jobs={jobs} />
      )}
    </div>
  );
}
