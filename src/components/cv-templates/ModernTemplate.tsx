export function ModernTemplate() {
  return (
    <div className="mx-auto flex max-w-3xl bg-white text-gray-900 shadow-sm print:shadow-none">
      <aside className="w-1/3 shrink-0 bg-primary p-6 text-white">
        <h1 className="text-xl font-bold leading-tight">Your Name</h1>
        <p className="mt-1 text-sm text-white/80">Job Title You&apos;re Targeting</p>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Contact
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>you@example.com</li>
            <li>+1 (555) 123-4567</li>
            <li>City, Country</li>
            <li>linkedin.com/in/you</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Skills
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Skill one</li>
            <li>Skill two</li>
            <li>Skill three</li>
            <li>Skill four</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Education
          </h2>
          <p className="mt-2 text-sm">Degree, Field of Study</p>
          <p className="text-sm text-white/80">University Name, Year</p>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Summary
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            One or two sentences on your experience, your specialty, and the
            kind of role you&apos;re looking for next. Keep it specific and
            skip the buzzwords.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Experience
          </h2>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold text-gray-900">Job Title</h3>
              <span className="text-xs text-gray-500">Month Year – Present</span>
            </div>
            <p className="text-sm text-gray-600">Company Name · Remote</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
              <li>What you did, and the measurable result it produced.</li>
              <li>Another accomplishment, ideally with a number attached.</li>
              <li>A third, focused on impact rather than responsibilities.</li>
            </ul>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold text-gray-900">Job Title</h3>
              <span className="text-xs text-gray-500">Month Year – Month Year</span>
            </div>
            <p className="text-sm text-gray-600">Company Name · Remote</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
              <li>What you did, and the measurable result it produced.</li>
              <li>Another accomplishment, ideally with a number attached.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
