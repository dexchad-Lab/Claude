"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema, statusChangeSchema } from "@/lib/validations";
import type { ApplicationFormState } from "@/components/ApplicationForm";
import type { StatusChangeState } from "@/components/StatusChangeForm";
import { deleteResumeFile } from "@/lib/upload";

async function requireOwnedApplication(applicationId: string, userId: string) {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
  if (!application) {
    redirect("/dashboard");
  }
  return application;
}

function extractLinks(formData: FormData) {
  const links: { label: string; url: string }[] = [];
  let i = 0;
  while (formData.has(`links.${i}.url`)) {
    const label = String(formData.get(`links.${i}.label`) ?? "").trim();
    const url = String(formData.get(`links.${i}.url`) ?? "").trim();
    if (url) {
      links.push({ label: label || "Link", url });
    }
    i++;
  }
  return links;
}

export async function updateApplicationAction(
  applicationId: string,
  _prevState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );

  const parsed = applicationFormSchema.safeParse({
    companyName: formData.get("companyName"),
    jobTitle: formData.get("jobTitle"),
    jobDescription: formData.get("jobDescription"),
    aboutCompany: formData.get("aboutCompany"),
    outcomeNotes: formData.get("outcomeNotes"),
    links: extractLinks(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { companyName, jobTitle, jobDescription, aboutCompany, outcomeNotes, links } =
    parsed.data;

  await prisma.$transaction([
    prisma.link.deleteMany({ where: { jobApplicationId: application.id } }),
    prisma.jobApplication.update({
      where: { id: application.id },
      data: {
        companyName,
        jobTitle,
        jobDescription,
        aboutCompany: aboutCompany || null,
        outcomeNotes: outcomeNotes || null,
        links: { create: links },
      },
    }),
  ]);

  redirect(`/applications/${application.id}`);
}

export async function changeStatusAction(
  applicationId: string,
  _prevState: StatusChangeState,
  formData: FormData,
): Promise<StatusChangeState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const application = await requireOwnedApplication(
    applicationId,
    session.user.id,
  );

  const parsed = statusChangeSchema.safeParse({
    status: formData.get("status"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { status, note } = parsed.data;

  await prisma.$transaction([
    prisma.jobApplication.update({
      where: { id: application.id },
      data: { status },
    }),
    prisma.statusHistory.create({
      data: {
        jobApplicationId: application.id,
        fromStatus: application.status,
        toStatus: status,
        note: note || null,
      },
    }),
  ]);

  revalidatePath(`/applications/${application.id}`);
  return {};
}

export async function deleteApplicationAction(applicationId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId: session.user.id },
    include: { resume: true },
  });
  if (!application) redirect("/dashboard");

  if (application.resume) {
    await deleteResumeFile(application.resume.storageKey);
  }

  await prisma.jobApplication.delete({ where: { id: application.id } });
  redirect("/dashboard");
}
