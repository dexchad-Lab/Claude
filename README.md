# Huntly

Track job applications — job description, company info, relevant links, the tailored resume for each job, status history with an outcome, and follow-up reminders — plus connect and chat in real time with other users.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Prisma ORM + Postgres, Auth.js (NextAuth v5) with email/password accounts. Resumes are stored in Vercel Blob (or the local filesystem when no Blob token is configured). Realtime chat + online presence run on Pusher Channels. Follow-up reminder emails are sent daily via a Vercel Cron job + Resend.

## Local development

```bash
npm install
cp .env.example .env
# generate your own AUTH_SECRET and put it in .env:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Set `DATABASE_URL` in `.env` to a Postgres connection string (a local Postgres, or a free instance from [Neon](https://neon.tech)/[Supabase](https://supabase.com)/Vercel Postgres both work). Leave `BLOB_READ_WRITE_TOKEN`, the `PUSHER_*` vars, and `RESEND_API_KEY` empty for local dev — resumes fall back to `./uploads`, chat still works but without instant delivery or online indicators, and the follow-up reminder cron route still runs (and is safe to hit manually at `/api/cron/follow-up-reminders`) but skips actually sending mail.

```bash
npm run dev
```

`npm run dev` automatically applies any pending Prisma migrations before starting (see `predev` in `package.json`). Open [http://localhost:3000](http://localhost:3000), sign up, and start tracking applications.

## Deploying to Vercel

This app needs two things Vercel's serverless filesystem can't provide on its own: a persistent database and persistent file storage. Both are required — a fresh deploy without them will fail as soon as someone tries to create an account.

1. **Database**: in the Vercel dashboard, go to your project → **Storage** → create a **Postgres** database (or bring your own from Neon/Supabase). Vercel adds `DATABASE_URL` (and related vars) to your project automatically when you connect it this way.
2. **Resume storage**: in the same **Storage** tab, create a **Blob** store and connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Auth secret**: add an `AUTH_SECRET` environment variable in **Settings → Environment Variables** (generate one with the command above).
4. **Realtime chat** (optional but recommended): create a free app at [pusher.com](https://pusher.com) → Channels. Add these environment variables from your Pusher app's dashboard:
   - `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
   - `NEXT_PUBLIC_PUSHER_KEY` (same value as `PUSHER_KEY`), `NEXT_PUBLIC_PUSHER_CLUSTER` (same value as `PUSHER_CLUSTER`)

   Without these, chat still works — messages are saved and show up on refresh — but there's no instant delivery and no online/offline indicator.
5. **Follow-up reminder emails** (optional): sign up at [resend.com](https://resend.com) (free tier) and create an API key. Add these environment variables:
   - `RESEND_API_KEY` — your Resend API key.
   - `EMAIL_FROM` (optional) — defaults to Resend's shared test sender (`onboarding@resend.dev`), which works without verifying a domain. Replace it once you verify your own domain in Resend.
   - `CRON_SECRET` — any random string you choose. Vercel Cron automatically sends this as a `Bearer` token when it calls the reminder route, so set the same value here as the secret itself (not a reference to another var).

   A daily cron job is already configured in `vercel.json` (`/api/cron/follow-up-reminders`, runs once a day). It emails each user a single digest of applications whose follow-up date has arrived, and never re-sends for the same application once that email succeeds. On Vercel's Hobby plan, cron jobs are limited to once per day, which is why the schedule is daily rather than hourly. Without `RESEND_API_KEY` set, the cron job still runs on schedule but skips sending (logged as a warning) — no reminders are lost, they just won't go out until the key is added.
6. Redeploy. The `build` script runs `prisma migrate deploy` before `next build`, so the database schema is created/updated automatically on every deploy — no manual migration step needed.

If `BLOB_READ_WRITE_TOKEN` isn't set, resume uploads silently fall back to local disk, which does **not** persist between requests on Vercel — make sure the Blob store is connected before testing uploads in production.

## Notes

- Each user only sees their own applications; auth is required for `/dashboard`, `/applications/*`, `/settings`, `/network`, and `/chat/*`.
- Resumes (PDF/DOC/DOCX, up to 5MB) are uploaded to Vercel Blob as **private** objects — downloads are proxied through an authenticated API route that checks ownership before ever touching blob storage, so the underlying blob URL is never exposed to the client.
- Every status change is recorded in a history timeline (`StatusHistory`), including the initial "Applied" state at creation.
- Chat is 1:1 and requires both users to accept a connection request first (`/network`) — there's no public user directory or search-by-name, only add-by-email, to avoid exposing a full list of accounts.
- Quick-adding an application from a job posting URL only auto-fills details when the page exposes `schema.org` `JobPosting` structured data (common on ATS platforms like Greenhouse/Lever). Sites like LinkedIn and Indeed block this and will just attach the link for manual entry.
- Follow-up reminders are sent once per application: setting or changing a follow-up date clears its "already notified" flag, so editing the date re-arms the reminder.
- Forgotten passwords are reset via a one-hour, single-use emailed link (`/forgot-password` → `/reset-password`). Uses the same Resend config as follow-up reminders; without `RESEND_API_KEY` set, the reset link is logged to the server console instead of emailed, so the flow is still testable locally. The request form always shows the same message regardless of whether the email is registered, to avoid leaking which accounts exist.
- `npx prisma studio` — browse the database.
- `npm run build && npm run lint` — verify before shipping changes.
