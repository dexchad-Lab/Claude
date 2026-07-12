import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/Sidebar";
import { PresenceProvider } from "@/components/PresenceProvider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [pendingRequestsCount, unreadMessagesCount] = await Promise.all([
    prisma.connection.count({
      where: { addresseeId: session.user.id, status: "PENDING" },
    }),
    prisma.message.count({
      where: { recipientId: session.user.id, readAt: null },
    }),
  ]);

  return (
    <PresenceProvider>
      <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row dark:bg-gray-950">
        <Sidebar
          userLabel={session.user.name ?? session.user.email ?? ""}
          messagesBadgeCount={pendingRequestsCount + unreadMessagesCount}
        />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </PresenceProvider>
  );
}
