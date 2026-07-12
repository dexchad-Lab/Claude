import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ChatThread } from "@/components/ChatThread";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: otherUserId } = await params;
  const session = await auth();
  const currentUserId = session!.user.id;

  const connection = await prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: currentUserId, addresseeId: otherUserId },
        { requesterId: otherUserId, addresseeId: currentUserId },
      ],
    },
  });
  if (!connection) {
    notFound();
  }

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
    select: { name: true, email: true },
  });
  if (!otherUser) {
    notFound();
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      recipientId: currentUserId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <ChatThread
        currentUserId={currentUserId}
        otherUserId={otherUserId}
        otherUserName={otherUser.name ?? otherUser.email}
        initialMessages={messages.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          recipientId: m.recipientId,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
