"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quickCreateSchema, APPLICATION_STATUSES } from "@/lib/validations";
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
