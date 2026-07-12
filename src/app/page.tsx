import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

const FEATURES = [
  {
    title: "Track every application",
    description:
      "Job description, company info, links, and the exact tailored resume you sent — all in one place, per application.",
  },
  {
    title: "See your pipeline at a glance",
    description:
      "A funnel view of how far your applications get, response rate, and a timeline of every status change.",
  },
  {
    title: "Never miss a follow-up",
    description:
      "Set a follow-up date on any application and it's flagged the moment it's overdue.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold text-gray-900">
            Job Application Tracker
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
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Track your search.
            <br />
            Grow your career.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            One place for every application, every resume you tailored, and
            every step of the process — so nothing falls through the cracks.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-semibold text-gray-900">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-6">
        <p className="text-center text-xs text-gray-400">
          Job Application Tracker
        </p>
      </footer>
    </div>
  );
}
