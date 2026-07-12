"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { connectionRequestSchema } from "@/lib/validations";

export type ConnectionActionState = { error?: string; success?: string };

export async function sendConnectionRequestAction(
  _prevState: ConnectionActionState,
  formData: FormData,
): Promise<ConnectionActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = connectionRequestSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.email.toLowerCase() === session.user.email?.toLowerCase()) {
    return { error: "You can't add yourself" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!targetUser) {
    return { error: "No account found with that email" };
  }

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: session.user.id, addresseeId: targetUser.id },
        { requesterId: targetUser.id, addresseeId: session.user.id },
      ],
    },
  });
  if (existing) {
    if (existing.status === "ACCEPTED") return { error: "You're already connected" };
    if (existing.status === "PENDING") return { error: "A request is already pending" };
  }

  await prisma.connection.create({
    data: {
      requesterId: session.user.id,
      addresseeId: targetUser.id,
      status: "PENDING",
    },
  });

  revalidatePath("/network");
  return { success: "Request sent" };
}

export async function respondToConnectionRequestAction(
  connectionId: string,
  accept: boolean,
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const connection = await prisma.connection.findFirst({
    where: { id: connectionId, addresseeId: session.user.id, status: "PENDING" },
  });
  if (!connection) return { error: "Not found" };

  await prisma.connection.update({
    where: { id: connection.id },
    data: { status: accept ? "ACCEPTED" : "DECLINED" },
  });

  revalidatePath("/network");
  return {};
}
