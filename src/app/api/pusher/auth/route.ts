import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPusherServer, PRESENCE_CHANNEL } from "@/lib/pusherServer";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pusher = getPusherServer();
  if (!pusher) {
    return NextResponse.json({ error: "Realtime not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const socketId = String(formData.get("socket_id") ?? "");
  const channelName = String(formData.get("channel_name") ?? "");

  if (!socketId || !channelName) {
    return NextResponse.json({ error: "Missing socket_id/channel_name" }, { status: 400 });
  }

  if (channelName === PRESENCE_CHANNEL) {
    const authResponse = pusher.authorizeChannel(socketId, channelName, {
      user_id: session.user.id,
      user_info: { name: session.user.name ?? session.user.email ?? "" },
    });
    return NextResponse.json(authResponse);
  }

  if (channelName.startsWith("private-chat-")) {
    const [userIdA, userIdB] = channelName.replace("private-chat-", "").split("-");
    if (!userIdA || !userIdB || ![userIdA, userIdB].includes(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const otherUserId = userIdA === session.user.id ? userIdB : userIdA;
    const connection = await prisma.connection.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: session.user.id, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: session.user.id },
        ],
      },
    });
    if (!connection) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  }

  return NextResponse.json({ error: "Unknown channel" }, { status: 403 });
}
