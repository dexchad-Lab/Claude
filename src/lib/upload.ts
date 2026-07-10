import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const ALLOWED_RESUME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export function getUploadDir() {
  return path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.UPLOAD_DIR ?? "./uploads",
  );
}

export async function ensureUploadDir() {
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

  const dir = await ensureUploadDir();
  const storedFilename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, storedFilename), buffer);

  return {
    storedFilename,
    originalFilename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export async function deleteResumeFile(storedFilename: string) {
  const dir = getUploadDir();
  try {
    await fs.unlink(path.join(dir, storedFilename));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

export async function readResumeFile(storedFilename: string) {
  const dir = getUploadDir();
  return fs.readFile(path.join(dir, storedFilename));
}
