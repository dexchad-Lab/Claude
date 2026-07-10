"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/validations";
import type { ApplicationFormState } from "@/components/ApplicationForm";

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

export async function createApplicationAction(
  _prevState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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

  const application = await prisma.$transaction(async (tx) => {
    const created = await tx.jobApplication.create({
      data: {
        userId: session.user.id,
        companyName,
        jobTitle,
        jobDescription,
        aboutCompany: aboutCompany || null,
        outcomeNotes: outcomeNotes || null,
        links: { create: links },
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

  redirect(`/applications/${application.id}`);
}
