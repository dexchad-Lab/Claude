import Pusher from "pusher";

let instance: Pusher | null | undefined;

export function isPusherConfigured() {
  return !!(
    process.env.PUSHER_APP_ID &&
    process.env.PUSHER_KEY &&
    process.env.PUSHER_SECRET &&
    process.env.PUSHER_CLUSTER
  );
}

/** Returns null when Pusher env vars aren't set, so chat degrades to
 * persisted-but-not-realtime (messages still save, recipients see them on
 * next load/refresh) instead of throwing. */
export function getPusherServer(): Pusher | null {
  if (!isPusherConfigured()) return null;
  if (instance === undefined) {
    instance = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return instance;
}

export function chatChannelName(userIdA: string, userIdB: string) {
  const [a, b] = [userIdA, userIdB].sort();
  return `private-chat-${a}-${b}`;
}

export const PRESENCE_CHANNEL = "presence-online-users";
