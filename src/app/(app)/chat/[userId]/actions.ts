"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations";
import { getPusherServer, chatChannelName } from "@/lib/pusherServer";

async function requireAcceptedConnection(userId: string, otherUserId: string) {
  return prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: userId, addresseeId: otherUserId },
        { requesterId: otherUserId, addresseeId: userId },
      ],
    },
  });
}

export async function sendMessageAction(recipientId: string, content: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = messageSchema.safeParse({ content });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid message" };
  }

  const connection = await requireAcceptedConnection(session.user.id, recipientId);
  if (!connection) return { error: "You're not connected with this user" };

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      recipientId,
      content: parsed.data.content,
    },
  });

  const pusher = getPusherServer();
  if (pusher) {
    await pusher.trigger(
      chatChannelName(session.user.id, recipientId),
      "new-message",
      {
        id: message.id,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      },
    );
  }

  return {
    message: {
      id: message.id,
      senderId: message.senderId,
      recipientId: message.recipientId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    },
  };
}
