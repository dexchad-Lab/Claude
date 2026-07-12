"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";
import { consumePasswordResetToken } from "@/lib/passwordReset";

export type ResetPasswordState = {
  error?: string;
  success?: boolean;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const verified = await consumePasswordResetToken(parsed.data.token);
  if (!verified) {
    return {
      error: "That reset link is invalid or has expired. Request a new one.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: verified.userId },
    data: { passwordHash },
  });

  return { success: true };
}
