import Link from "next/link";
import { notFound } from "next/navigation";
import { getCvTemplate } from "@/lib/cvTemplates";
import { PrintButton } from "@/components/PrintButton";
import { ModernTemplate } from "@/components/cv-templates/ModernTemplate";
import { MinimalTemplate } from "@/components/cv-templates/MinimalTemplate";
import { ClassicTemplate } from "@/components/cv-templates/ClassicTemplate";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
};

export default async function CvTemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = getCvTemplate(id);
  const Template = TEMPLATE_COMPONENTS[id as keyof typeof TEMPLATE_COMPONENTS];

  if (!meta || !Template) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <Link
            href="/cv-templates"
            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
          >
            &larr; Back to templates
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {meta.name} template
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Edit the placeholder text below (right in your browser&apos;s
            dev tools) or copy the layout into your own editor, then print
            to save as a PDF.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-gray-800 print:border-0 print:bg-transparent print:p-0">
        <Template />
      </div>
    </div>
  );
}
