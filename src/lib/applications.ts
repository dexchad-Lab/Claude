import { prisma } from "@/lib/prisma";
import type { ApplicationRow } from "@/components/ApplicationsTable";

export async function getUserApplications(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      links: true,
      resume: true,
      statusHistory: true,
    },
  });
}

type RawApplication = Awaited<ReturnType<typeof getUserApplications>>[number];

export function toApplicationRows(
  applications: RawApplication[],
): ApplicationRow[] {
  return applications.map((app) => ({
    id: app.id,
    companyName: app.companyName,
    jobTitle: app.jobTitle,
    status: app.status,
    updatedAt: app.updatedAt.toISOString(),
    appliedAt: app.appliedAt.toISOString(),
    followUpAt: app.followUpAt ? app.followUpAt.toISOString() : null,
    jobDescription: app.jobDescription,
    aboutCompany: app.aboutCompany,
    outcomeNotes: app.outcomeNotes,
    links: app.links.map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
    })),
    resume: app.resume
      ? {
          originalFilename: app.resume.originalFilename,
          uploadedAt: app.resume.uploadedAt.toISOString(),
        }
      : null,
    statusHistory: app.statusHistory.map((entry) => ({
      id: entry.id,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      note: entry.note,
      changedAt: entry.changedAt.toISOString(),
    })),
  }));
}
