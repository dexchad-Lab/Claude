# Job Application Tracker

Track job applications — job description, company info, relevant links, the tailored resume for each job, status history with an outcome, and follow-up reminders — plus connect and chat in real time with other users.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Prisma ORM + Postgres, Auth.js (NextAuth v5) with email/password accounts. Resumes are stored in Vercel Blob (or the local filesystem when no Blob token is configured). Realtime chat + online presence run on Pusher Channels.

## Local development

```bash
npm install
cp .env.example .env
# generate your own AUTH_SECRET and put it in .env:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Set `DATABASE_URL` in `.env` to a Postgres connection string (a local Postgres, or a free instance from [Neon](https://neon.tech)/[Supabase](https://supabase.com)/Vercel Postgres both work). Leave `BLOB_READ_WRITE_TOKEN` and the `PUSHER_*` vars empty for local dev — resumes fall back to `./uploads`, and chat still works but without instant delivery or online indicators.

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
5. Redeploy. The `build` script runs `prisma migrate deploy` before `next build`, so the database schema is created/updated automatically on every deploy — no manual migration step needed.

If `BLOB_READ_WRITE_TOKEN` isn't set, resume uploads silently fall back to local disk, which does **not** persist between requests on Vercel — make sure the Blob store is connected before testing uploads in production.

## Notes

- Each user only sees their own applications; auth is required for `/dashboard`, `/applications/*`, `/settings`, `/network`, and `/chat/*`.
- Resumes (PDF/DOC/DOCX, up to 5MB) are uploaded to Vercel Blob as **private** objects — downloads are proxied through an authenticated API route that checks ownership before ever touching blob storage, so the underlying blob URL is never exposed to the client.
- Every status change is recorded in a history timeline (`StatusHistory`), including the initial "Applied" state at creation.
- Chat is 1:1 and requires both users to accept a connection request first (`/network`) — there's no public user directory or search-by-name, only add-by-email, to avoid exposing a full list of accounts.
- Quick-adding an application from a job posting URL only auto-fills details when the page exposes `schema.org` `JobPosting` structured data (common on ATS platforms like Greenhouse/Lever). Sites like LinkedIn and Indeed block this and will just attach the link for manual entry.
- `npx prisma studio` — browse the database.
- `npm run build && npm run lint` — verify before shipping changes.
