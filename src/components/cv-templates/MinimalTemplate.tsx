export function MinimalTemplate() {
  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-gray-900 shadow-sm print:shadow-none">
      <header className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-semibold">Your Name</h1>
        <p className="mt-1 text-sm text-gray-600">
          you@example.com · +1 (555) 123-4567 · City, Country · linkedin.com/in/you
        </p>
      </header>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Summary
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          One or two sentences on your experience, your specialty, and the
          kind of role you&apos;re looking for next. Keep it specific and
          skip the buzzwords.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Experience
        </h2>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-medium text-gray-900">
              Job Title, Company Name
            </h3>
            <span className="text-xs text-gray-500">Month Year – Present</span>
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
            <li>What you did, and the measurable result it produced.</li>
            <li>Another accomplishment, ideally with a number attached.</li>
            <li>A third, focused on impact rather than responsibilities.</li>
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-medium text-gray-900">
              Job Title, Company Name
            </h3>
            <span className="text-xs text-gray-500">Month Year – Month Year</span>
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
            <li>What you did, and the measurable result it produced.</li>
            <li>Another accomplishment, ideally with a number attached.</li>
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Education
        </h2>
        <div className="mt-2 flex items-baseline justify-between">
          <h3 className="font-medium text-gray-900">
            Degree, Field of Study
          </h3>
          <span className="text-xs text-gray-500">Year</span>
        </div>
        <p className="text-sm text-gray-600">University Name</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Skills
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Skill one · Skill two · Skill three · Skill four · Skill five
        </p>
      </section>
    </div>
  );
}
