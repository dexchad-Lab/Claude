"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quickCreateSchema, APPLICATION_STATUSES } from "@/lib/validations";
import { fetchJobPostingFromUrl } from "@/lib/jobPosting";
import { z } from "zod";

async function requireOwnedApplication(applicationId: string, userId: string) {
  return prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
}

export async function quickCreateApplicationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const parsed = quickCreateSchema.safeParse({
    companyName: formData.get("companyName"),
    jobTitle: formData.get("jobTitle"),
    jobDescription: formData.get("jobDescription"),
    sourceUrl: formData.get("sourceUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const application = await prisma.$transaction(async (tx) => {
    const created = await tx.jobApplication.create({
      data: {
        userId: session.user.id,
        companyName: parsed.data.companyName,
        jobTitle: parsed.data.jobTitle,
        jobDescription: parsed.data.jobDescription || "",
        links: parsed.data.sourceUrl
          ? { create: [{ label: "Job Posting", url: parsed.data.sourceUrl }] }
          : undefined,
      },
    });
    await tx.statusHistory.create({
      data: {
        jobApplicationId: created.id,
        fromStatus: null,
        toStatus: "APPLIED",
      },
    });
    return created;
  });

  revalidatePath("/dashboard");
  return { id: application.id };
}

export async function fetchJobFromUrlAction(url: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsedUrl = z.url().safeParse(url);
  if (!parsedUrl.success) return { error: "Enter a valid URL" };

  try {
    const result = await fetchJobPostingFromUrl(parsedUrl.data);
    return {
      companyName: result.companyName ?? "",
      jobTitle: result.jobTitle ?? "",
      jobDescription: result.jobDescription ?? "",
      foundDetails: !!(result.companyName || result.jobTitle || result.jobDescription),
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't fetch that URL" };
  }
}

export async function updateCompanyNameAction(
  applicationId: string,
  companyName: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const trimmed = companyName.trim();
  if (!trimmed) return { error: "Company name is required" };

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );
  if (!application) return { error: "Not found" };

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { companyName: trimmed.slice(0, 200) },
  });
  revalidatePath("/dashboard");
  return {};
}

export async function updateJobTitleAction(
  applicationId: string,
  jobTitle: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const trimmed = jobTitle.trim();
  if (!trimmed) return { error: "Job title is required" };

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );
  if (!application) return { error: "Not found" };

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { jobTitle: trimmed.slice(0, 200) },
  });
  revalidatePath("/dashboard");
  return {};
}

export async function updateAppliedAtAction(
  applicationId: string,
  dateStr: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return { error: "Invalid date" };

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );
  if (!application) return { error: "Not found" };

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { appliedAt: date },
  });
  revalidatePath("/dashboard");
  return {};
}

export async function updateFollowUpAtAction(
  applicationId: string,
  dateStr: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  let date: Date | null = null;
  if (dateStr) {
    date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return { error: "Invalid date" };
  }

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );
  if (!application) return { error: "Not found" };

  await prisma.jobApplication.update({
    where: { id: applicationId },
    // Changing the follow-up date means it's a new reminder target, so
    // clear any prior notification flag for it.
    data: { followUpAt: date, followUpNotifiedAt: null },
  });
  revalidatePath("/dashboard");
  return {};
}

const statusEnum = z.enum(APPLICATION_STATUSES);

export async function quickChangeStatusAction(
  applicationId: string,
  status: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsedStatus = statusEnum.safeParse(status);
  if (!parsedStatus.success) return { error: "Invalid status" };

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );
  if (!application) return { error: "Not found" };

  await prisma.$transaction([
    prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: parsedStatus.data },
    }),
    prisma.statusHistory.create({
      data: {
        jobApplicationId: applicationId,
        fromStatus: application.status,
        toStatus: parsedStatus.data,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  return {};
}
