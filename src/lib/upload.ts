import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put, del, get } from "@vercel/blob";

export const ALLOWED_RESUME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

function isBlobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function getUploadDir() {
  return path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.UPLOAD_DIR ?? "./uploads",
  );
}

async function ensureUploadDir() {
  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function saveResumeFile(file: File) {
  const ext = ALLOWED_RESUME_TYPES[file.type];
  if (!ext) {
    throw new Error("Unsupported file type. Upload a PDF or Word document.");
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 5MB.");
  }

  const pathname = `resumes/${crypto.randomUUID()}${ext}`;

  if (isBlobConfigured()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await put(pathname, buffer, {
      access: "private",
      contentType: file.type,
      addRandomSuffix: false,
    });
  } else {
    const dir = await ensureUploadDir();
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, pathname.replace("resumes/", "")), buffer);
  }

  return {
    storageKey: pathname,
    originalFilename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export async function deleteResumeFile(storageKey: string) {
  if (isBlobConfigured()) {
    await del(storageKey);
    return;
  }

  const dir = getUploadDir();
  try {
    await fs.unlink(path.join(dir, storageKey.replace("resumes/", "")));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

export async function readResumeFile(storageKey: string) {
  if (isBlobConfigured()) {
    const result = await get(storageKey, { access: "private" });
    if (!result || result.statusCode !== 200) {
      throw new Error("Resume file not found in storage.");
    }
    const arrayBuffer = await new Response(result.stream).arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const dir = getUploadDir();
  return fs.readFile(path.join(dir, storageKey.replace("resumes/", "")));
}
