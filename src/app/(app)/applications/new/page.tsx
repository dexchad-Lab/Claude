import { ApplicationForm } from "@/components/ApplicationForm";
import { createApplicationAction } from "./actions";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        New application
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ApplicationForm
          action={createApplicationAction}
          submitLabel="Create application"
        />
      </div>
    </div>
  );
}
