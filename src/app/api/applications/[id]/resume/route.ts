import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveResumeFile, deleteResumeFile, readResumeFile } from "@/lib/upload";

async function getOwnedApplication(applicationId: string, userId: string) {
  return prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
    include: { resume: true },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await getOwnedApplication(id, session.user.id);
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  let saved;
  try {
    saved = await saveResumeFile(file);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 },
    );
  }

  const previousStorageKey = application.resume?.storageKey;

  await prisma.resume.upsert({
    where: { jobApplicationId: application.id },
    create: {
      jobApplicationId: application.id,
      originalFilename: saved.originalFilename,
      storageKey: saved.storageKey,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
    },
    update: {
      originalFilename: saved.originalFilename,
      storageKey: saved.storageKey,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
      uploadedAt: new Date(),
    },
  });

  if (previousStorageKey) {
    await deleteResumeFile(previousStorageKey);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await getOwnedApplication(id, session.user.id);
  if (!application?.resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readResumeFile(application.resume.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": application.resume.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        application.resume.originalFilename,
      )}"`,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await getOwnedApplication(id, session.user.id);
  if (!application?.resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { jobApplicationId: application.id } });
  await deleteResumeFile(application.resume.storageKey);

  return NextResponse.json({ ok: true });
}
