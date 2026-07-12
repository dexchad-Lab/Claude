import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

function IconStroke({
  children,
  className = "h-6 w-6",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const FEATURES = [
  {
    title: "See it all in one place",
    description:
      "The job post, the company, the links, and the exact resume you sent. Every application, all in one spot.",
    icon: (
      <IconStroke>
        <path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2Z" />
        <rect x="4" y="6" width="16" height="15" rx="2" />
        <path d="M9 12h6M9 16h6" />
      </IconStroke>
    ),
  },
  {
    title: "Watch your progress",
    description:
      "See how far each application gets, your response rate, and every change over time — at a glance.",
    icon: (
      <IconStroke>
        <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" />
      </IconStroke>
    ),
  },
  {
    title: "Never forget to follow up",
    description:
      "Pick a date, and we'll email you the moment it's time to follow up. No more guessing.",
    icon: (
      <IconStroke>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </IconStroke>
    ),
  },
  {
    title: "Add a job in seconds",
    description:
      "Paste the link. Huntly fills in the company, title, and description for you — instantly.",
    icon: (
      <IconStroke>
        <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" />
        <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.36-1.36" />
      </IconStroke>
    ),
  },
  {
    title: "You're not doing this alone",
    description:
      "Connect with other job seekers, chat live, and cheer each other on while you both search.",
    icon: (
      <IconStroke>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </IconStroke>
    ),
  },
  {
    title: "Built to grow with you",
    description:
      "Search, filter, and scroll through hundreds of applications without ever slowing down.",
    icon: (
      <IconStroke>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </IconStroke>
    ),
  },
];

const STEPS = [
  {
    step: "1",
    title: "Add a job",
    description:
      "Paste the link, or type it in yourself. Company, role, description, links, and your resume.",
  },
  {
    step: "2",
    title: "Track your progress",
    description:
      "Move it from Applied to Interview to Offer. We save every step for you, automatically.",
  },
  {
    step: "3",
    title: "Follow up. Land it.",
    description:
      "We'll email you the moment it's time to follow up — so you never miss your shot.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Huntly
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(3,105,161,0.08),transparent_60%)]"
          />
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              New: we&apos;ll remind you to follow up
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Hunt smarter.
              <br />
              <span className="glow-text">Land</span> faster.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
              Huntly keeps your whole job search in one place. Every
              application. Every resume. Every follow-up. Nothing gets lost,
              and nothing slows you down.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover sm:w-auto"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="w-full rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Log in
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Free to start · No credit card required
            </p>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything your search needs.
              <br />
              <span className="glow-text">Nothing</span>{" "}it doesn&apos;t.
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Made for people who apply to a lot of jobs — not for a messy
              spreadsheet.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200 p-6 transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                How it works
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Just three steps to get organized.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {STEPS.map((item) => (
                <div key={item.step} className="text-center sm:text-left">
                  <span className="glow-text text-4xl font-extrabold">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-16 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(3,105,161,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(22,163,74,0.25),transparent_55%)]"
            />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to <span className="glow-text">land</span> your next
              role?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-gray-300">
              Sign up in under a minute. It&apos;s free, and it might just
              land you the job.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/signup"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:px-6">
          <span className="text-sm font-bold text-gray-900">Huntly</span>
          <p className="text-xs text-gray-400">
            Your job hunt, organized.
          </p>
        </div>
      </footer>
    </div>
  );
}
