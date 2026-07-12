export function ClassicTemplate() {
  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-gray-900 shadow-sm print:shadow-none">
      <header className="text-center">
        <h1 className="font-serif text-3xl tracking-wide">YOUR NAME</h1>
        <p className="mt-2 text-sm text-gray-600">
          you@example.com &nbsp;|&nbsp; +1 (555) 123-4567 &nbsp;|&nbsp; City,
          Country &nbsp;|&nbsp; linkedin.com/in/you
        </p>
      </header>
      <hr className="my-5 border-gray-400" />

      <section>
        <h2 className="font-serif text-sm font-bold uppercase tracking-widest text-gray-800">
          Professional Summary
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          One or two sentences on your experience, your specialty, and the
          kind of role you&apos;re looking for next. Keep it specific and
          skip the buzzwords.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-sm font-bold uppercase tracking-widest text-gray-800">
          Professional Experience
        </h2>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-gray-900">Job Title</h3>
            <span className="text-xs italic text-gray-500">
              Month Year – Present
            </span>
          </div>
          <p className="text-sm italic text-gray-600">Company Name, City</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
            <li>What you did, and the measurable result it produced.</li>
            <li>Another accomplishment, ideally with a number attached.</li>
            <li>A third, focused on impact rather than responsibilities.</li>
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-gray-900">Job Title</h3>
            <span className="text-xs italic text-gray-500">
              Month Year – Month Year
            </span>
          </div>
          <p className="text-sm italic text-gray-600">Company Name, City</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-gray-700">
            <li>What you did, and the measurable result it produced.</li>
            <li>Another accomplishment, ideally with a number attached.</li>
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-sm font-bold uppercase tracking-widest text-gray-800">
          Education
        </h2>
        <div className="mt-2 flex items-baseline justify-between">
          <h3 className="font-semibold text-gray-900">
            Degree, Field of Study
          </h3>
          <span className="text-xs italic text-gray-500">Year</span>
        </div>
        <p className="text-sm italic text-gray-600">University Name</p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-sm font-bold uppercase tracking-widest text-gray-800">
          Skills
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Skill one, Skill two, Skill three, Skill four, Skill five
        </p>
      </section>
    </div>
  );
}
