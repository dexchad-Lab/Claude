"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { createPasswordResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotPasswordState = {
  error?: string;
  submitted?: boolean;
};

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (user) {
    const token = await createPasswordResetToken(user.id);
    if (token) {
      const hdrs = await headers();
      const host = hdrs.get("host");
      const proto = hdrs.get("x-forwarded-proto") ?? "https";
      const appUrl = process.env.APP_URL || `${proto}://${host}`;
      const resetUrl = `${appUrl}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.email, user.name ?? user.email, resetUrl);
    }
  }

  // Always the same response whether or not the account exists, so this
  // form can't be used to check which emails are registered.
  return { submitted: true };
}
