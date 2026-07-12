import Link from "next/link";
import { CV_TEMPLATES } from "@/lib/cvTemplates";
import { TemplateIcon } from "@/components/icons";

export default function CvTemplatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          CV Templates
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pick a layout, fill in your details, and print it straight to PDF
          — no extra software needed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CV_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/cv-templates/${template.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TemplateIcon className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">
              {template.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {template.description}
            </p>
            <p className="mt-3 text-xs font-medium text-primary">
              Best for: {template.bestFor}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
              View &amp; print &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
