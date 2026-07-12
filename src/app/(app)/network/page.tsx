import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NetworkClient, type ConnectionPerson } from "@/components/NetworkClient";

export default async function NetworkPage() {
  const session = await auth();
  const userId = session!.user.id;

  const connectionsRaw = await prisma.connection.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: { id: true, name: true, email: true } },
      addressee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingReceived: ConnectionPerson[] = [];
  const pendingSent: ConnectionPerson[] = [];
  const connections: ConnectionPerson[] = [];

  for (const c of connectionsRaw) {
    const isRequester = c.requesterId === userId;
    const other = isRequester ? c.addressee : c.requester;
    const person: ConnectionPerson = {
      connectionId: c.id,
      userId: other.id,
      name: other.name ?? other.email,
      email: other.email,
    };

    if (c.status === "ACCEPTED") {
      connections.push(person);
    } else if (c.status === "PENDING") {
      if (isRequester) pendingSent.push(person);
      else pendingReceived.push(person);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Network</h1>
      <NetworkClient
        pendingReceived={pendingReceived}
        pendingSent={pendingSent}
        connections={connections}
      />
    </div>
  );
}
