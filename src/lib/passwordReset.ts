import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESEND_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Returns null (and creates nothing) if a still-valid token was already
 * issued for this user in the last couple of minutes, so repeatedly
 * submitting the form doesn't spam out a new reset email every time.
 */
export async function createPasswordResetToken(
  userId: string,
): Promise<string | null> {
  const recent = await prisma.passwordResetToken.findFirst({
    where: {
      userId,
      usedAt: null,
      createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_MS) },
    },
  });
  if (recent) return null;

  const rawToken = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return rawToken;
}

export async function verifyPasswordResetToken(
  rawToken: string,
): Promise<{ userId: string } | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;
  return { userId: record.userId };
}

export async function consumePasswordResetToken(
  rawToken: string,
): Promise<{ userId: string } | null> {
  const verified = await verifyPasswordResetToken(rawToken);
  if (!verified) return null;

  await prisma.passwordResetToken.update({
    where: { tokenHash: hashToken(rawToken) },
    data: { usedAt: new Date() },
  });
  return verified;
}
