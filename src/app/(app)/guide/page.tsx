import Link from "next/link";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

export default function GuidePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Guide: Landing a Remote Job
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Practical, no-fluff advice for finding and winning a remote role.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="1. Make your resume remote-ready">
          <p>
            Remote hiring managers screen for one thing above all else:
            proof you can work without someone watching over your shoulder.
            Rewrite your bullet points around outcomes, not tasks —
            &ldquo;shipped X, which increased Y by Z%&rdquo; beats
            &ldquo;responsible for X&rdquo; every time.
          </p>
          <p>
            If you&apos;ve worked remotely, async, or across time zones
            before, say so explicitly near the top. It&apos;s the fastest
            signal a recruiter looks for.
          </p>
          <p>
            Need a starting layout?{" "}
            <Link href="/cv-templates" className="font-medium text-primary hover:underline">
              Browse the CV templates
            </Link>{" "}
            and print one straight to PDF.
          </p>
        </Section>

        <Section title="2. Look in the right places">
          <p>
            General job boards are flooded with applicants for every remote
            posting. You&apos;ll get better odds on boards built specifically
            for remote work, where every listing is remote by definition —
            no filtering required.
          </p>
          <p>
            Check the{" "}
            <Link href="/remote-jobs" className="font-medium text-primary hover:underline">
              Remote Jobs
            </Link>{" "}
            page for live listings, and add anything promising straight to
            your tracker with one click.
          </p>
        </Section>

        <Section title="3. Watch for scam listings">
          <p>
            Remote work attracts real employers and scammers in roughly
            equal measure. Be suspicious of postings that skip a real
            interview, ask you to buy your own equipment before starting,
            or want your bank details on day one.
          </p>
          <p>
            A real company will always have a verifiable website, a
            LinkedIn presence, and employees you can look up. If you
            can&apos;t find any of that, treat the offer as fake until
            proven otherwise.
          </p>
        </Section>

        <Section title="4. Nail the async interview">
          <p>
            Remote interviews often include a written or asynchronous round
            — a take-home task, a written Q&amp;A, or a recorded video
            response. Treat these with the same care as a live interview:
            proofread, be specific, and answer the actual question asked.
          </p>
          <p>
            For live video calls: test your camera and audio ahead of time,
            keep your background simple, and over-communicate slightly —
            body language reads differently on a screen.
          </p>
        </Section>

        <Section title="5. Be upfront about time zones">
          <p>
            If a role spans time zones, say clearly which hours you can
            realistically overlap with the team, and mention it early — in
            your application or the first call. It saves everyone a
            mismatched offer down the line, and shows you&apos;ve actually
            thought about how the job would work day to day.
          </p>
        </Section>

        <Section title="6. Know the tools remote teams expect">
          <p>
            Most remote teams run on a similar toolkit: Slack or a
            Slack-like chat tool for daily communication, a video tool
            (Zoom, Google Meet) for calls, and a project tracker (Jira,
            Linear, Asana, Trello) for work. You don&apos;t need to be an
            expert in the exact tools a company uses, but comfort with the
            categories helps you ramp up fast — and it&apos;s worth a
            mention in interviews.
          </p>
        </Section>

        <Section title="7. Follow up — but not too much">
          <p>
            One follow-up email roughly a week after applying, or after an
            interview, is normal and expected. More than that starts to
            read as pressure. Huntly can remind you automatically — set a
            follow-up date on any application from your{" "}
            <Link href="/applications" className="font-medium text-primary hover:underline">
              applications list
            </Link>{" "}
            and you&apos;ll get an email when it&apos;s time.
          </p>
        </Section>
      </div>
    </div>
  );
}
