"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { PRESENCE_CHANNEL } from "@/lib/pusherServer";

const PresenceContext = createContext<Set<string>>(new Set());

export function usePresence() {
  return useContext(PresenceContext);
}

type PresenceMember = { id: string; info: unknown };

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(PRESENCE_CHANNEL);

    channel.bind("pusher:subscription_succeeded", (data: { members: Record<string, unknown> }) => {
      setOnlineUserIds(new Set(Object.keys(data.members ?? {})));
    });
    channel.bind("pusher:member_added", (member: PresenceMember) => {
      setOnlineUserIds((prev) => new Set(prev).add(member.id));
    });
    channel.bind("pusher:member_removed", (member: PresenceMember) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    });

    return () => {
      pusher.unsubscribe(PRESENCE_CHANNEL);
    };
  }, []);

  return (
    <PresenceContext.Provider value={onlineUserIds}>
      {children}
    </PresenceContext.Provider>
  );
}
