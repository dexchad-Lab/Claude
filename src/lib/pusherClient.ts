"use client";

import PusherClient from "pusher-js";

let client: PusherClient | null | undefined;

export function isPusherClientConfigured() {
  return !!(process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER);
}

/** Returns null when Pusher isn't configured, so components can render a
 * static (non-realtime) fallback instead of crashing. */
export function getPusherClient(): PusherClient | null {
  if (!isPusherClientConfigured()) return null;
  if (client === undefined) {
    client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });
  }
  return client;
}
