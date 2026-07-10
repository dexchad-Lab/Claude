# Job Application Tracker

Track job applications: job description, company info, relevant links, the tailored resume for each job, and status history (before/after) with an outcome.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Prisma ORM + SQLite, Auth.js (NextAuth v5) with email/password accounts. Resumes are stored on the local filesystem.

## Getting started

```bash
npm install
cp .env.example .env
# generate your own AUTH_SECRET and put it in .env:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up for an account, and start tracking applications.

## Notes

- Each user only sees their own applications; auth is required for `/dashboard` and `/applications/*`.
- Uploaded resumes (PDF/DOC/DOCX, up to 5MB) are stored in `./uploads` (configurable via `UPLOAD_DIR`), outside of `/public` so they aren't served unauthenticated.
- Every status change is recorded in a history timeline (`StatusHistory`), including the initial "Applied" state at creation.
- `npx prisma studio` — browse the database.
- `npm run build && npm run lint` — verify before shipping changes.
